/**
 * reportContent
 *
 * Lets anyone report a pledge on the Pledge Wall (Apple guideline 1.2, Google
 * Play UGC policy). A report hides the pledge at once and sends it back to the
 * admin review queue; the team is emailed. Public by design, so it limits
 * itself: 6 reports per network address per hour and 60 site-wide per day,
 * and it only acts on pledges that are currently showing.
 *
 * Request: { kind: 'pledge', target_id, reason, details?, turnstile_token? }
 * Responses: 200 { success: true } | 400 invalid | 429 rate_limited
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sendMail } from './mail.ts';
import { verifyHuman } from './turnstile.ts';

const REASONS = ['bullying_or_hate', 'personal_info', 'inappropriate', 'spam', 'other'];
const LABEL: Record<string, string> = {
  bullying_or_hate: 'Bullying, hate or threats',
  personal_info: 'Shares personal information',
  inappropriate: 'Inappropriate',
  spam: 'Spam or ads',
  other: 'Other',
};
const PER_IP_PER_HOUR = 6;
const PER_DAY = 60;
const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json', ...CORS } });

function clientIp(req: Request): string {
  const direct = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip');
  if (direct) return direct.trim();
  const fwd = req.headers.get('x-forwarded-for');
  return fwd ? fwd.split(',')[0].trim() : 'unknown';
}
async function hash(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const within = (iso: unknown, ms: number) => Number.isFinite(Date.parse(String(iso))) && Date.now() - Date.parse(String(iso)) < ms;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  let body: any;
  try {
    const raw = await req.text();
    if (raw.length > 4000) return json({ error: 'too_large' }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'invalid', message: 'That request could not be read.' }, 400);
  }
  if (body?.kind !== 'pledge') return json({ error: 'invalid', message: 'Unknown content.' }, 400);
  const targetId = String(body?.target_id || '');
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(targetId)) return json({ error: 'invalid', message: 'Unknown pledge.' }, 400);
  const reason = REASONS.includes(body?.reason) ? body.reason : 'other';
  const details = clean(body?.details, 500);

  // Bot check (invisible for most people), so a script cannot empty the wall.
  const human = await verifyHuman(req, body?.turnstile_token, 'report');
  if (!human.ok) return json(human.body, human.status);

  const base44 = createClientFromRequest(req);
  const db = base44.asServiceRole.entities as any;
  const ipHash = await hash(`ogwogd-report:${clientIp(req)}`);

  try {
    const mine = await db.ContentReport.filter({ ip_hash: ipHash }, '-created_date', PER_IP_PER_HOUR);
    if (mine.length >= PER_IP_PER_HOUR && mine.every((r: any) => within(r.created_date, 3600_000))) {
      return json({ error: 'rate_limited', message: 'You have sent a lot of reports. Our team will review them. Please try again later.' }, 429);
    }
    const recent = await db.ContentReport.list('-created_date', PER_DAY);
    const dayFull = recent.length >= PER_DAY && recent.every((r: any) => within(r.created_date, 86_400_000));

    const found = await db.Pledge.filter({ id: targetId });
    const pledge = found?.[0];
    if (!pledge) return json({ error: 'invalid', message: 'That pledge was not found.' }, 400);

    await db.ContentReport.create({
      kind: 'pledge',
      target_id: targetId,
      target_preview: clean(`${pledge.first_name || ''} ${pledge.last_initial || ''}: ${pledge.pledge_statement || ''}`, 300),
      reason,
      details,
      ip_hash: ipHash,
      status: 'new',
    });

    // Hide it right away if it is showing. When the daily cap is hit (a flood of
    // reports), stop auto-hiding so one person cannot empty the wall; reports
    // still land in the queue.
    if (pledge.approved && !dayFull) {
      await db.Pledge.update(targetId, { approved: false, hidden_reason: 'reported', reported_at: new Date().toISOString() });
      try {
        await sendMail(base44, {
          to: 'greggsdevelopment@gmail.com',
          subject: 'Pledge reported and hidden',
          text: [
            'A visitor reported a pledge on ogwogd.org. It has been hidden from the wall until you review it.',
            '',
            `Reason: ${LABEL[reason]}`,
            details ? `Note: ${details}` : null,
            `Pledge: ${pledge.first_name || ''} ${pledge.last_initial || ''} (${pledge.city || 'no city'})`,
            `"${clean(pledge.pledge_statement, 500)}"`,
            '',
            'Review: https://ogwogd.org/admin?tab=pledges',
          ].filter((l) => l !== null).join('\r\n'),
        });
      } catch (err) {
        console.error('reportContent: email failed', err);
      }
    }
    return json({ success: true });
  } catch (err) {
    console.error('reportContent: failed', err);
    return json({ error: 'try_again', message: 'Something went wrong. Please try again, or email greggsdevelopment@gmail.com.' }, 503);
  }
});
