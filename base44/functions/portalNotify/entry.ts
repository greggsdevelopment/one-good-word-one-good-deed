/**
 * portalNotify
 *
 * Admin only. Emails a school's portal members when the team does something
 * they should know about: a new message, invoice, schedule change, document,
 * checklist item, or an invitation to the portal.
 *
 * Request: { kind: 'message' | 'invoice' | 'schedule' | 'document' | 'task' | 'invite',
 *            school_id, member_id? (invite), ref_id?, note? }
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { isEmail, sendMail } from './mail.ts';

const SITE = 'https://ogwogd.org';
const TEAM = 'greggsdevelopment@gmail.com';
const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json', ...CORS } });
const isId = (v: unknown) => typeof v === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(v);
const one = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const money = (n: unknown) => `$${(Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const SIGN = ['', 'Cody Greggs-Dorsey', 'One Good Word...One Good Deed', '(734) 383-3865', 'ogwogd.org'];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const base44 = createClientFromRequest(req);
  let user: any = null;
  try {
    user = await base44.auth.me();
  } catch {
    user = null;
  }
  if (!user || user.role !== 'admin') return json({ error: 'unauthorized' }, 401);

  let body: any;
  try {
    body = JSON.parse((await req.text()).slice(0, 8000) || '{}');
  } catch {
    return json({ error: 'invalid' }, 400);
  }
  if (!isId(body?.school_id)) return json({ error: 'invalid', message: 'Missing school.' }, 400);
  const db = base44.asServiceRole.entities as any;
  const school = (await db.School.filter({ id: body.school_id }))?.[0];
  if (!school) return json({ error: 'invalid', message: 'School not found.' }, 400);

  const members = ((await db.SchoolMember.filter({ school_id: school.id })) || []).filter((m: any) => m.status === 'active' || m.status === 'invited');
  const note = one(body.note, 600);
  const kind = String(body.kind || '');
  let to: string[] = members.map((m: any) => m.email).filter(isEmail);
  let subject = '';
  let lines: (string | null)[] = [];
  const link = (tab: string) => `${SITE}/portal?tab=${tab}`;

  if (kind === 'invite') {
    if (!isId(body.member_id)) return json({ error: 'invalid', message: 'Missing member.' }, 400);
    const m = members.find((x: any) => x.id === body.member_id);
    if (!m) return json({ error: 'invalid', message: 'That person is not invited yet.' }, 400);
    to = [m.email];
    subject = `Your ${school.name} portal with One Good Word...One Good Deed`;
    lines = [
      `Hi ${String(m.name || '').split(' ')[0] || 'there'},`,
      '',
      `You now have access to the ${school.name} school portal on ogwogd.org. It keeps everything about your program in one place: your schedule, invoices and payments, documents like the agreement and W-9, a checklist, and a direct line to our team.`,
      '',
      `You will also get an invitation email from our website platform (Base44). Use it, or go to ${SITE}/register, and create your account with this email address: ${m.email}`,
      '',
      `After that, sign in any time at ${SITE}/login and tap Account, or go straight to ${SITE}/portal.`,
      ...SIGN,
    ];
  } else if (kind === 'message') {
    subject = `New message from One Good Word...One Good Deed`;
    lines = [`We sent you a message in the ${school.name} portal.`, note ? `\r\n"${note}"\r\n` : null, `Read and reply: ${link('messages')}`, ...SIGN];
  } else if (kind === 'invoice') {
    const inv = isId(body.ref_id) ? (await db.Invoice.filter({ id: body.ref_id }))?.[0] : null;
    if (!inv || inv.school_id !== school.id) return json({ error: 'invalid', message: 'Invoice not found.' }, 400);
    subject = `Invoice ${inv.number} from One Good Word...One Good Deed`;
    lines = [
      `Invoice ${inv.number} for ${money(inv.total)} is ready in the ${school.name} portal.`,
      inv.due_date ? `Due: ${inv.due_date}` : null,
      inv.po_number ? `PO: ${inv.po_number}` : null,
      '',
      `View or download it: ${link('billing')}`,
      '',
      'Payment by check, ACH or purchase order is welcome. Our W-9 is in the portal under Documents.',
      ...SIGN,
    ];
  } else if (kind === 'schedule') {
    subject = `${school.name}: program schedule updated`;
    lines = [`Your program schedule was updated.`, note ? `\r\n${note}\r\n` : null, `See the dates and add them to your calendar: ${link('schedule')}`, ...SIGN];
  } else if (kind === 'document') {
    subject = `${school.name}: new document in your portal`;
    lines = [`We added a document to your portal${note ? `: ${note}` : ''}.`, '', `Open it: ${link('documents')}`, ...SIGN];
  } else if (kind === 'task') {
    subject = `${school.name}: something we need from you`;
    lines = [`There is a new item on your program checklist${note ? `: ${note}` : ''}.`, '', `See the checklist: ${link('overview')}`, ...SIGN];
  } else {
    return json({ error: 'invalid', message: 'Unknown notification.' }, 400);
  }

  if (!to.length) return json({ success: true, sent: 0, message: 'No one is on this school\'s portal yet.' });
  try {
    await sendMail(base44, { to, subject, text: lines.filter((l) => l !== null).join('\r\n'), replyTo: TEAM });
  } catch (err) {
    console.error('portalNotify: email failed', err);
    return json({ error: 'email_failed', message: 'The update saved, but the email did not send. Try again, or let them know directly.' }, 502);
  }
  return json({ success: true, sent: to.length });
});
