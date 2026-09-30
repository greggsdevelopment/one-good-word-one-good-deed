/**
 * submitForm
 *
 * The single front door for every public form on ogwogd.org (pledges,
 * contact, prayer requests, newsletter, resource suggestions, sponsorship
 * applications, event RSVPs, school bookings). The matching entities no
 * longer accept writes from the browser, so everything must pass through here.
 *
 * What it enforces:
 * - Only the fields listed for that form in logic.ts are saved; anything else
 *   the browser sends (approved, status, read, checked_in, notes...) is
 *   dropped, and admin-only fields are forced to safe defaults.
 * - Required fields, lengths, email format, numbers and dates are checked.
 * - A hidden honeypot field catches most bots silently.
 * - Cloudflare Turnstile: every request must carry a fresh, single-use token
 *   minted on ogwogd.org for this exact form (see turnstile.ts).
 * - Rate limits: per email address and per form overall, over a 10 minute
 *   window, so a script cannot flood the database or the notification inbox.
 * - Newsletter signups for an address already on the list are a quiet no-op.
 * - RSVPs must point at a real event; the event title is taken from the
 *   event itself, not from the browser.
 * - Booking references are generated here, not trusted from the browser.
 *
 * Request (POST, JSON): { form: string, data: object, website?: string, turnstile_token?: string }
 * Responses: 200 { success: true, id, reference? }
 *            400 { error: 'invalid', field, message }
 *            413 { error: 'too_large' }
 *            429 { error: 'rate_limited', message }
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { FORMS, MAX_BODY_BYTES, bookingReference, overLimit, validate } from './logic.ts';
import { verifyHuman } from './turnstile.ts';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...CORS_HEADERS } });
}

function clientIp(req: Request): string {
  const direct = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip');
  if (direct) return direct.trim();
  const fwd = req.headers.get('x-forwarded-for');
  return fwd ? fwd.split(',')[0].trim() : 'unknown';
}

/** A random server-side key, created once and kept in an admin-only table. */
async function serverKey(db: any, name: string): Promise<string> {
  const found = (await db.ServerKey.filter({ name }, 'created_date', 1)) || [];
  if (found[0]?.value) return found[0].value;
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const value = [...bytes].map((x) => x.toString(16).padStart(2, '0')).join('');
  await db.ServerKey.create({ name, value });
  // If two requests raced, everyone uses the oldest key from now on.
  const again = (await db.ServerKey.filter({ name }, 'created_date', 1)) || [];
  return again[0]?.value || value;
}

/**
 * Anonymous poster tag: a keyed hash of a random ID the browser keeps for this
 * site (or, without one, the network address). Keyed, so it cannot be turned
 * back into an address; device based, so blocking one person does not block
 * a whole school's Wi-Fi.
 */
async function submitterTag(req: Request, db: any, device: unknown): Promise<string> {
  const id = typeof device === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(device) ? `d:${device}` : `ip:${clientIp(req)}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(await serverKey(db, 'pledge-tag')), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(id));
  return [...new Uint8Array(sig)].slice(0, 8).map((x) => x.toString(16).padStart(2, '0')).join('');
}

const SLOW_DOWN = 'You have sent a lot of these in the last few minutes. Please wait a bit and try again, or call (734) 383-3865.';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let text: string;
  try {
    text = await req.text();
  } catch {
    return json({ error: 'invalid', field: null, message: 'That request could not be read.' }, 400);
  }
  if (text.length > MAX_BODY_BYTES) return json({ error: 'too_large', message: 'That is too much text for one form.' }, 413);

  let body: any;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: 'invalid', field: null, message: 'That request could not be read.' }, 400);
  }

  const formKey = String(body?.form || '');
  const def = FORMS[formKey];
  if (!def) return json({ error: 'invalid', field: null, message: 'Unknown form.' }, 400);

  // Honeypot: people never see or fill the "website" field. Pretend it worked.
  if (typeof body?.website === 'string' && body.website.trim() !== '') return json({ success: true, id: null });

  const checked = validate(formKey, body?.data);
  if (!checked.ok) return json({ error: 'invalid', field: checked.field, message: checked.message }, 400);
  const record = checked.record;

  const human = await verifyHuman(req, body?.turnstile_token, `form-${formKey}`);
  if (!human.ok) return json(human.body, human.status);

  const base44 = createClientFromRequest(req);
  const entity = (base44.asServiceRole.entities as any)[def.entity];

  try {
    // Overall flood cap for this form.
    const recent = await entity.list('-created_date', def.global);
    const recentForThisForm = formKey === 'prayer' || formKey === 'contact'
      ? recent.filter((r: any) => (formKey === 'prayer') === (r.subject === 'Prayer Request'))
      : recent;
    if (recentForThisForm.length >= def.global && overLimit(recentForThisForm.map((r: any) => r.created_date), def.global)) {
      return json({ error: 'rate_limited', message: SLOW_DOWN }, 429);
    }

    // Per-person cap and newsletter dedupe.
    if (def.emailField && record[def.emailField]) {
      const mine = await entity.filter({ [def.emailField]: record[def.emailField] }, '-created_date', 10);
      if (def.dedupeByEmail && mine.length > 0) return json({ success: true, id: mine[0].id, duplicate: true });
      if (def.perEmail && overLimit(mine.map((r: any) => r.created_date), def.perEmail)) {
        return json({ error: 'rate_limited', message: SLOW_DOWN }, 429);
      }
    }
  } catch (err) {
    // Fail closed: if we cannot confirm the limits, we do not write.
    console.error('submitForm: rate check failed', err);
    return json({ error: 'try_again', message: 'Something hiccuped on our end. Please try again in a minute.' }, 503);
  }

  if (formKey === 'rsvp') {
    let event: any = null;
    try {
      const found = await base44.asServiceRole.entities.Event.filter({ id: String(record.event_id) });
      event = found && found[0];
    } catch {
      event = null;
    }
    if (!event) return json({ error: 'invalid', field: 'event_id', message: 'That event could not be found. Refresh the page and try again.' }, 400);
    record.event_title = event.title || '';
  }

  if (formKey === 'booking') record.reference = bookingReference();

  if (formKey === 'pledge') {
    // Anonymous tag: lets viewers block a submitter and lets us ban one, without
    // storing who they are. A banned submitter's pledge is quietly dropped.
    let tag = '';
    try {
      tag = await submitterTag(req, base44.asServiceRole.entities, body?.device);
    } catch (err) {
      console.error('submitForm: pledge tag failed', err);
    }
    try {
      const banned = tag ? await base44.asServiceRole.entities.BlockedSubmitter.filter({ tag }) : [];
      if (banned && banned.length) return json({ success: true, id: null });
    } catch {
      // table missing or unreachable: do not block legitimate pledges over it
    }
    if (tag) record.submitter_tag = tag;
  }

  try {
    const created = await entity.create(record);
    return json({ success: true, id: created?.id ?? null, reference: record.reference ?? undefined });
  } catch (err) {
    console.error('submitForm: create failed', formKey, err);
    return json({ error: 'save_failed', message: 'Something went wrong saving that. Please try again, or email greggsdevelopment@gmail.com.' }, 500);
  }
});
