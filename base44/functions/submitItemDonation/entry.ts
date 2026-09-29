/**
 * submitItemDonation
 *
 * The only way the public can create an ItemDonation. The entity itself is
 * admin-only, so the checks below cannot be skipped by writing to it directly.
 *
 * - Refuses everything when DonationSettings.item_donations_enabled is false.
 * - Refuses pickups when DonationSettings.pickup_enabled is false.
 * - Only takes items on the DonationNeed list with status 'open', in a
 *   condition that need accepts, up to that need's per-donation cap. Off-list
 *   items are refused unless DonationSettings.allow_other_items is true.
 * - Geocodes pickup addresses (US Census first, OpenStreetMap Nominatim as a
 *   fallback) and refuses anything farther than pickup_radius_miles
 *   (default 50) in a straight line from Westland, MI.
 * - Emails greggsdevelopment@gmail.com through the Gmail connector. A failed
 *   email never fails the submission.
 *
 * Request (POST, JSON):
 *   { donor_name, email, phone, delivery_method: 'pickup' | 'dropoff',
 *     address_line, city, state, zip, pickup_window, notes,
 *     items: [{ need_id, description, quantity, condition }],
 *     website (honeypot, must be empty), check_only?: boolean }
 * Responses:
 *   200 { success: true, id }                 created
 *   200 { ok: true, distance_miles }          check_only and in range
 *   400 { error: 'invalid', field, message }
 *   403 { error: 'closed' | 'pickup_closed', message }
 *   422 { error: 'address_not_found' | 'out_of_range', message, distance_miles?, radius_miles? }
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import {
  ORIGIN,
  base64UrlEncode,
  emailBody,
  haversineMiles,
  radiusFrom,
  safeHeader,
  validateSubmission,
} from './logic.ts';

const NOTIFY_TO = 'greggsdevelopment@gmail.com';
const USER_AGENT = 'ogwogd.org donation pickup check (https://ogwogd.org/donate)';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS_HEADERS },
  });
}

type Geo = { lat: number; lng: number; matched: string };

async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 8000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function geocodeCensus(oneLine: string): Promise<Geo | null> {
  const url =
    'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress' +
    `?address=${encodeURIComponent(oneLine)}&benchmark=Public_AR_Current&format=json`;
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const data = await res.json();
    const match = data?.result?.addressMatches?.[0];
    if (!match?.coordinates) return null;
    return { lat: Number(match.coordinates.y), lng: Number(match.coordinates.x), matched: String(match.matchedAddress || '') };
  } catch {
    return null;
  }
}

async function geocodeNominatim(street: string, city: string, state: string, zip: string): Promise<Geo | null> {
  const params = new URLSearchParams({
    street,
    city,
    state,
    postalcode: zip,
    countrycodes: 'us',
    format: 'jsonv2',
    limit: '1',
  });
  try {
    const res = await fetchWithTimeout(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'User-Agent': USER_AGENT, Referer: 'https://ogwogd.org/donate' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const hit = Array.isArray(data) ? data[0] : null;
    if (!hit) return null;
    return { lat: Number(hit.lat), lng: Number(hit.lon), matched: String(hit.display_name || '') };
  } catch {
    return null;
  }
}

async function loadSettings(base44: any): Promise<any> {
  try {
    const rows = await base44.asServiceRole.entities.DonationSettings.list('-updated_date', 1);
    return rows?.[0] || {};
  } catch {
    return {};
  }
}

async function loadNeeds(base44: any): Promise<any[]> {
  try {
    const rows = await base44.asServiceRole.entities.DonationNeed.list('sort_order', 500);
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function notify(base44: any, record: any): Promise<boolean> {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const subject = `New Item Donation - ${safeHeader(record.donor_name)} (${record.delivery_method === 'pickup' ? 'pickup' : 'drop-off'})`;
    const raw = base64UrlEncode(
      `To: ${NOTIFY_TO}\r\n` +
        `Subject: ${subject}\r\n` +
        `Reply-To: ${safeHeader(record.email)}\r\n` +
        'Content-Type: text/plain; charset=UTF-8\r\n' +
        'MIME-Version: 1.0\r\n' +
        '\r\n' +
        emailBody(record),
    );
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed', message: 'Use POST.' }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid', field: null, message: 'That request could not be read.' }, 400);
  }

  const base44 = createClientFromRequest(req);
  const settings = await loadSettings(base44);
  const itemsEnabled = settings.item_donations_enabled !== false;
  const pickupEnabled = settings.pickup_enabled !== false;
  const allowOther = settings.allow_other_items === true;
  const radius = radiusFrom(settings);

  if (!itemsEnabled) {
    return json({ error: 'closed', message: 'We are not taking item donations through the site right now.' }, 403);
  }

  // Honeypot: real people never see or fill the "website" field.
  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return json({ success: true, id: null });
  }

  const needs = await loadNeeds(base44);
  const checked = validateSubmission(body, { pickupEnabled, allowOther, needs });
  if (!checked.ok) {
    const code = checked.field === 'delivery_method' && body?.delivery_method === 'pickup' && !pickupEnabled ? 403 : 400;
    return json({ error: code === 403 ? 'pickup_closed' : 'invalid', field: checked.field, message: checked.message }, code);
  }
  const sub = checked.value;

  let geo: Geo | null = null;
  let distance: number | null = null;
  if (sub.delivery_method === 'pickup') {
    const oneLine = `${sub.address_line}, ${sub.city}, ${sub.state} ${sub.zip}`;
    geo = (await geocodeCensus(oneLine)) || (await geocodeNominatim(sub.address_line, sub.city, sub.state, sub.zip));
    if (!geo || !Number.isFinite(geo.lat) || !Number.isFinite(geo.lng)) {
      return json(
        {
          error: 'address_not_found',
          message:
            'We could not find that address. Double check the street, city and ZIP, or choose drop-off and we will sort it out with you.',
        },
        422,
      );
    }
    distance = Math.round(haversineMiles(ORIGIN, geo) * 10) / 10;
    if (distance > radius) {
      return json(
        {
          error: 'out_of_range',
          distance_miles: distance,
          radius_miles: radius,
          message: `That address is about ${Math.round(distance)} miles from ${ORIGIN.label}. We pick up within ${radius} miles. You can still donate by choosing drop-off.`,
        },
        422,
      );
    }
  }

  if (body?.check_only === true) {
    return json({ ok: true, distance_miles: distance, radius_miles: radius });
  }

  const record: Record<string, unknown> = {
    ...sub,
    status: 'new',
    matched_address: geo?.matched || '',
    latitude: geo?.lat ?? null,
    longitude: geo?.lng ?? null,
    distance_miles: distance,
  };

  let created: any;
  try {
    created = await base44.asServiceRole.entities.ItemDonation.create(record);
  } catch (err) {
    console.error('ItemDonation create failed', err);
    return json(
      {
        error: 'save_failed',
        message: 'Something went wrong saving that. Call (734) 383-3865 or email greggsdevelopment@gmail.com and we will take it down by hand.',
      },
      500,
    );
  }

  const sent = await notify(base44, record);
  if (sent && created?.id) {
    try {
      await base44.asServiceRole.entities.ItemDonation.update(created.id, { notification_sent_at: new Date().toISOString() });
    } catch {
      // the email already went out; a missing timestamp is not worth failing over
    }
  }

  return json({ success: true, id: created?.id ?? null });
});
