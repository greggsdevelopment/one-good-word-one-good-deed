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

  try {
    const created = await entity.create(record);
    return json({ success: true, id: created?.id ?? null, reference: record.reference ?? undefined });
  } catch (err) {
    console.error('submitForm: create failed', formKey, err);
    return json({ error: 'save_failed', message: 'Something went wrong saving that. Please try again, or email greggsdevelopment@gmail.com.' }, 500);
  }
});
