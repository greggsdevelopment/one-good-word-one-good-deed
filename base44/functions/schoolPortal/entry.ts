/**
 * schoolPortal
 *
 * Everything a school administrator does in the portal goes through here.
 * The school tables are admin-only, so this function is the only way in:
 *
 * - The caller must be signed in. Their email must belong to an invited or
 *   active SchoolMember of the school they ask about (team admins may open
 *   any school, for "view as school").
 * - Only whitelisted fields ever leave the server (see logic.ts): no private
 *   notes, no draft invoices, no hidden documents, no file locations.
 * - Files open through 5-minute signed links.
 * - New school messages, uploads and teammate requests email the team.
 *
 * Request (POST, JSON): { action, school_id?, ... } where action is one of
 *   me | overview | documentUrl | addDocument | postMessage | markRead |
 *   updateSchool | updateMe | completeTask | requestTeammate
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sendMail } from './mail.ts';
import {
  BOOKING_PUBLIC, DOC_PUBLIC, INVOICE_PUBLIC, MEMBER_PUBLIC, MESSAGE_PUBLIC, PAYMENT_PUBLIC, SCHOOL_DOC_KINDS,
  SCHOOL_PUBLIC, SESSION_PUBLIC, TASK_PUBLIC, clean, invoiceWithBalance, isEmail, isFileUri, isId, oneLine, pick, schoolPatch,
} from './logic.ts';

const TEAM = 'greggsdevelopment@gmail.com';
const SITE = 'https://ogwogd.org';
const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json', ...CORS } });
const nowIso = () => new Date().toISOString();
const detroitDay = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

class Denied extends Error {}

async function notifyTeam(base44: any, subject: string, lines: (string | null)[], replyTo?: string) {
  try {
    await sendMail(base44, { to: TEAM, subject, text: lines.filter((l) => l !== null).join('\r\n'), replyTo });
  } catch (err) {
    console.error('schoolPortal: team email failed', err);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let body: any;
  try {
    const raw = await req.text();
    if (raw.length > 20_000) return json({ error: 'too_large', message: 'That is too much text for one request.' }, 413);
    body = JSON.parse(raw || '{}');
  } catch {
    return json({ error: 'invalid', message: 'That request could not be read.' }, 400);
  }

  const base44 = createClientFromRequest(req);
  let user: any = null;
  try {
    user = await base44.auth.me();
  } catch {
    user = null;
  }
  if (!user?.email) return json({ error: 'unauthorized', message: 'Please sign in.' }, 401);

  const db = base44.asServiceRole.entities as any;
  const isAdmin = user.role === 'admin';
  const emails = [...new Set([String(user.email), String(user.email).toLowerCase()])];

  /** The caller's live memberships. */
  const myMemberships = async () => {
    const seen = new Map<string, any>();
    for (const e of emails) {
      for (const m of (await db.SchoolMember.filter({ email: e })) || []) {
        if (m.status === 'invited' || m.status === 'active') seen.set(m.id, m);
      }
    }
    return [...seen.values()];
  };

  /** Loads a school the caller may see, or throws Denied. */
  const authorize = async (schoolId: unknown) => {
    if (!isId(schoolId)) throw new Denied();
    const school = (await db.School.filter({ id: schoolId }))?.[0];
    if (!school) throw new Denied();
    if (isAdmin) return { school, member: null };
    const member = (await myMemberships()).find((m) => m.school_id === schoolId);
    if (!member) throw new Denied();
    return { school, member };
  };

  const action = String(body?.action || '');
  const today = detroitDay();

  try {
    if (action === 'me') {
      const memberships = await myMemberships();
      // First sign-in turns an invite into an active membership. Otherwise only
      // touch last_seen_at once an hour, so refreshes do not write constantly.
      for (const m of memberships) {
        const stale = !m.last_seen_at || Date.now() - Date.parse(m.last_seen_at) > 3600_000;
        if (m.status === 'invited' || stale) await db.SchoolMember.update(m.id, { status: 'active', last_seen_at: nowIso() }).catch(() => null);
      }
      const schools = [];
      for (const m of memberships) {
        const s = (await db.School.filter({ id: m.school_id }))?.[0];
        if (s) schools.push({ id: s.id, name: s.name, district: s.district || '', title: m.title || '' });
      }
      return json({
        success: true,
        user: { name: user.full_name || '', email: user.email, role: user.role || 'user' },
        isAdmin,
        schools,
      });
    }

    if (action === 'overview') {
      const { school, member } = await authorize(body.school_id);
      const sid = school.id;
      const [members, bookings, sessions, invoices, payments, docs, tasks, messages] = await Promise.all([
        db.SchoolMember.filter({ school_id: sid }, 'created_date', 200),
        db.BookingRequest.filter({ school_id: sid }, '-created_date', 50),
        db.ProgramSession.filter({ school_id: sid }, 'date', 200),
        db.Invoice.filter({ school_id: sid }, '-issue_date', 200),
        db.Payment.filter({ school_id: sid }, '-received_date', 500),
        db.SchoolDocument.filter({ school_id: sid }, '-created_date', 200),
        db.SchoolTask.filter({ school_id: sid }, 'due_date', 200),
        db.PortalMessage.filter({ school_id: sid }, '-created_date', 150),
      ]);
      if (member && (!member.last_seen_at || Date.now() - Date.parse(member.last_seen_at) > 3600_000)) {
        await db.SchoolMember.update(member.id, { last_seen_at: nowIso(), status: 'active' }).catch(() => null);
      }
      const publicPayments = (payments || []).map((p: any) => pick(p, PAYMENT_PUBLIC));
      return json({
        success: true,
        school: pick(school, SCHOOL_PUBLIC),
        me: member ? pick(member, MEMBER_PUBLIC) : { name: user.full_name || 'OGWOGD team', title: 'Viewing as admin', email: user.email },
        viewingAsAdmin: !member,
        members: (members || []).filter((m: any) => m.status !== 'removed').map((m: any) => pick(m, MEMBER_PUBLIC)),
        bookings: (bookings || []).map((b: any) => pick(b, BOOKING_PUBLIC)),
        sessions: (sessions || []).map((x: any) => pick(x, SESSION_PUBLIC)),
        invoices: (invoices || [])
          .filter((i: any) => i.status && i.status !== 'draft')
          .map((i: any) => invoiceWithBalance(pick(i, INVOICE_PUBLIC), publicPayments, today)),
        documents: (docs || []).filter((d: any) => d.visible_to_school !== false).map((d: any) => pick(d, DOC_PUBLIC)),
        tasks: (tasks || []).map((t: any) => pick(t, TASK_PUBLIC)),
        messages: (messages || []).reverse().map((m: any) => pick(m, MESSAGE_PUBLIC)),
        today,
      });
    }

    if (action === 'documentUrl') {
      const { school } = await authorize(body.school_id);
      if (!isId(body.doc_id)) throw new Denied();
      const doc = (await db.SchoolDocument.filter({ id: body.doc_id }))?.[0];
      if (!doc || doc.school_id !== school.id || (!isAdmin && doc.visible_to_school === false)) throw new Denied();
      const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: doc.file_uri, expires_in: 300 });
      return json({ success: true, url: signed_url });
    }

    if (action === 'addDocument') {
      const { school, member } = await authorize(body.school_id);
      const title = oneLine(body.title, 120);
      const kind = SCHOOL_DOC_KINDS.includes(body.kind) ? body.kind : 'other';
      if (!title) return json({ error: 'invalid', field: 'title', message: 'Give the file a name.' }, 400);
      if (!isFileUri(body.file_uri)) return json({ error: 'invalid', field: 'file', message: 'That upload did not finish. Try again.' }, 400);
      const recent = await db.SchoolDocument.filter({ school_id: school.id }, '-created_date', 30);
      if (recent.filter((d: any) => d.uploaded_by === 'school' && Date.now() - Date.parse(d.created_date) < 3600_000).length >= 20) {
        return json({ error: 'rate_limited', message: 'That is a lot of uploads in one hour. Please try again later.' }, 429);
      }
      const doc = await db.SchoolDocument.create({
        school_id: school.id,
        booking_id: isId(body.booking_id) ? body.booking_id : '',
        title,
        kind,
        file_uri: body.file_uri,
        file_name: oneLine(body.file_name, 160),
        uploaded_by: member ? 'school' : 'ogwogd',
        uploader_email: user.email,
        visible_to_school: true,
      });
      if (member) {
        await notifyTeam(base44, `${school.name} uploaded: ${title}`, [
          `${member.name || user.email} uploaded a file to the ${school.name} portal.`,
          `Title: ${title}`,
          `Type: ${kind.replace('_', ' ')}`,
          '',
          `Open: ${SITE}/admin?tab=schools:${school.id}`,
        ], user.email);
      }
      return json({ success: true, document: pick(doc, DOC_PUBLIC) });
    }

    if (action === 'postMessage') {
      const { school, member } = await authorize(body.school_id);
      const text = clean(body.body, 4000);
      if (text.length < 1) return json({ error: 'invalid', field: 'body', message: 'Type a message first.' }, 400);
      const topic = ['general', 'schedule', 'billing', 'documents'].includes(body.topic) ? body.topic : 'general';
      const recent = await db.PortalMessage.filter({ school_id: school.id }, '-created_date', 30);
      if (recent.filter((m: any) => m.author_email === user.email && Date.now() - Date.parse(m.created_date) < 3600_000).length >= 30) {
        return json({ error: 'rate_limited', message: 'That is a lot of messages in one hour. Please call (734) 383-3865 if it is urgent.' }, 429);
      }
      const fromSchool = Boolean(member);
      const msg = await db.PortalMessage.create({
        school_id: school.id,
        author: fromSchool ? 'school' : 'ogwogd',
        author_name: fromSchool ? member.name || user.full_name || user.email : user.full_name || 'OGWOGD',
        author_email: user.email,
        body: text,
        topic,
        read_by_ogwogd: !fromSchool,
        read_by_school: fromSchool,
      });
      if (fromSchool) {
        await notifyTeam(base44, `Portal message from ${school.name}${topic !== 'general' ? ` (${topic})` : ''}`, [
          `${member.name || user.email}${member.title ? `, ${member.title}` : ''} at ${school.name} wrote:`,
          '',
          text,
          '',
          `Reply in the portal: ${SITE}/admin?tab=schools:${school.id}`,
          'Replying to this email goes straight to them.',
        ], user.email);
      }
      return json({ success: true, message: pick(msg, MESSAGE_PUBLIC) });
    }

    if (action === 'markRead') {
      const { school, member } = await authorize(body.school_id);
      if (!member) return json({ success: true });
      const unread = (await db.PortalMessage.filter({ school_id: school.id, author: 'ogwogd' }, '-created_date', 100)).filter((m: any) => !m.read_by_school);
      for (const m of unread) await db.PortalMessage.update(m.id, { read_by_school: true });
      return json({ success: true, marked: unread.length });
    }

    if (action === 'updateSchool') {
      const { school, member } = await authorize(body.school_id);
      const checked = schoolPatch(body.patch || {});
      if (!checked.ok) return json({ error: 'invalid', field: checked.field, message: checked.message }, 400);
      if (!Object.keys(checked.patch).length) return json({ success: true, school: pick(school, SCHOOL_PUBLIC) });
      const updated = await db.School.update(school.id, checked.patch);
      if (member) {
        await notifyTeam(base44, `${school.name} updated its school details`, [
          `${member.name || user.email} changed: ${Object.keys(checked.patch).join(', ').replace(/_/g, ' ')}.`,
          `Open: ${SITE}/admin?tab=schools:${school.id}`,
        ]);
      }
      return json({ success: true, school: pick({ ...school, ...checked.patch, ...(updated || {}) }, SCHOOL_PUBLIC) });
    }

    if (action === 'updateMe') {
      const { member } = await authorize(body.school_id);
      if (!member) return json({ error: 'invalid', message: 'Admins edit staff from the admin screen.' }, 400);
      const patch: Record<string, unknown> = {};
      if (body.name !== undefined) {
        const v = oneLine(body.name, 100);
        if (v.length < 2) return json({ error: 'invalid', field: 'name', message: 'Please add your name.' }, 400);
        patch.name = v;
      }
      if (body.title !== undefined) patch.title = oneLine(body.title, 100);
      if (body.phone !== undefined) {
        const v = oneLine(body.phone, 30);
        if (v && !/^[0-9+().\-\s]{7,30}$/.test(v)) return json({ error: 'invalid', field: 'phone', message: 'That phone number does not look right.' }, 400);
        patch.phone = v;
      }
      const updated = await db.SchoolMember.update(member.id, patch);
      return json({ success: true, me: pick({ ...member, ...patch, ...(updated || {}) }, MEMBER_PUBLIC) });
    }

    if (action === 'completeTask') {
      const { school, member } = await authorize(body.school_id);
      if (!isId(body.task_id)) throw new Denied();
      const task = (await db.SchoolTask.filter({ id: body.task_id }))?.[0];
      if (!task || task.school_id !== school.id) throw new Denied();
      if (member && task.owner !== 'school') return json({ error: 'invalid', message: 'Our team checks that one off.' }, 400);
      const done = body.done === true;
      await db.SchoolTask.update(task.id, { done, done_at: done ? nowIso() : null, done_by: done ? member?.name || user.email : '' });
      if (member && done) {
        await notifyTeam(base44, `${school.name} finished: ${task.title}`, [
          `${member.name || user.email} checked off "${task.title}" in the ${school.name} portal.`,
          `Open: ${SITE}/admin?tab=schools:${school.id}`,
        ]);
      }
      return json({ success: true });
    }

    if (action === 'requestTeammate') {
      const { school, member } = await authorize(body.school_id);
      const email = oneLine(body.email, 120).toLowerCase();
      const name = oneLine(body.name, 100);
      if (name.length < 2) return json({ error: 'invalid', field: 'name', message: 'Add their name.' }, 400);
      if (!isEmail(email)) return json({ error: 'invalid', field: 'email', message: 'Add their work email.' }, 400);
      const existing = (await db.SchoolMember.filter({ school_id: school.id, email })) || [];
      if (existing.some((m: any) => m.status !== 'removed')) return json({ error: 'invalid', field: 'email', message: 'That person is already on your team list.' }, 400);
      const pending = (await db.SchoolMember.filter({ school_id: school.id, status: 'requested' })) || [];
      if (pending.length >= 10) return json({ error: 'rate_limited', message: 'You have several requests waiting. We will get to them soon.' }, 429);
      const m = await db.SchoolMember.create({ school_id: school.id, email, name, title: oneLine(body.title, 100), status: 'requested', is_primary: false });
      await notifyTeam(base44, `${school.name} asked to add ${name}`, [
        `${member?.name || user.email} asked to give ${name} (${email}) access to the ${school.name} portal.`,
        body.title ? `Title: ${oneLine(body.title, 100)}` : null,
        '',
        `Approve and send the invite: ${SITE}/admin?tab=schools:${school.id}`,
      ], user.email);
      return json({ success: true, member: pick(m, MEMBER_PUBLIC) });
    }

    return json({ error: 'invalid', message: 'Unknown action.' }, 400);
  } catch (err) {
    if (err instanceof Denied) return json({ error: 'forbidden', message: 'You do not have access to that school. If this is a mistake, contact us.' }, 403);
    console.error('schoolPortal:', action, err);
    return json({ error: 'try_again', message: 'Something went wrong. Please try again in a minute.' }, 503);
  }
});
