/**
 * deleteMyAccount
 *
 * In-app account deletion (Apple 5.1.1(v), Google Play account deletion).
 * Signed-in users only; the account deleted is always the caller's own.
 *
 * Removes: school portal access, chat conversations, newsletter signup,
 * event RSVPs, contact messages, item donation offers, sponsorship
 * applications, partner inquiries and raffle entries sent with the account's
 * email (the email was proven at sign-up).
 * Keeps, with the person's name and contact details removed: messages in a
 * school's portal thread, bookings and documents (they belong to the school),
 * invoices and payments (tax records), and shop orders (tax records; the
 * email is removed, the shipping name and address are kept).
 * Finally deletes the account record itself. If any step fails, the team is
 * emailed to finish by hand and the user is told it will be done within 7 days.
 *
 * Team admins are refused so the site can never lose its last admin; they are
 * removed from the Base44 dashboard instead.
 *
 * Request: { confirm: 'DELETE' }
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sendMail } from './mail.ts';

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json', ...CORS } });
const REMOVED = 'Removed at their request';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  let body: any = {};
  try {
    body = JSON.parse((await req.text()).slice(0, 2000) || '{}');
  } catch {
    body = {};
  }
  if (body?.confirm !== 'DELETE') return json({ error: 'invalid', message: 'Type DELETE to confirm.' }, 400);

  const base44 = createClientFromRequest(req);
  let user: any = null;
  try {
    user = await base44.auth.me();
  } catch {
    user = null;
  }
  if (!user?.id || !user?.email) return json({ error: 'unauthorized', message: 'Please sign in again, then try once more.' }, 401);
  if (user.role === 'admin') {
    return json({ error: 'admin', message: 'Team admin accounts are removed by the site owner in the Base44 dashboard, so the site always keeps an admin. Email greggsdevelopment@gmail.com.' }, 403);
  }

  const db = base44.asServiceRole.entities as any;
  // Placeholder addresses shared by anonymous submissions are never matched.
  const PLACEHOLDERS = ['prayer@request.org'];
  if (PLACEHOLDERS.includes(String(user.email).toLowerCase())) {
    return json({ error: 'invalid', message: 'This account cannot be deleted here. Email greggsdevelopment@gmail.com.' }, 400);
  }
  const emails = [...new Set([String(user.email), String(user.email).toLowerCase()])];
  const done: string[] = [];
  const failed: string[] = [];

  const step = async (label: string, fn: () => Promise<number>) => {
    try {
      const n = await fn();
      if (n) done.push(`${label}: ${n}`);
    } catch (err) {
      console.error('deleteMyAccount:', label, err);
      failed.push(label);
    }
  };
  const byEmail = async (entity: string, field: string) => {
    const seen = new Map<string, any>();
    for (const e of emails) {
      const rows = (await db[entity].filter({ [field]: e })) || [];
      rows.forEach((r: any) => seen.set(r.id, r));
    }
    // Exact-match filters miss addresses typed with different capitals or
    // spaces, so also scan the most recent rows case-insensitively.
    const want = String(user.email).trim().toLowerCase();
    const recent = (await db[entity].list('-created_date', 2000)) || [];
    recent.forEach((r: any) => {
      if (String(r?.[field] ?? '').trim().toLowerCase() === want) seen.set(r.id, r);
    });
    return [...seen.values()];
  };
  const remove = (entity: string, field: string) => async () => {
    const rows = await byEmail(entity, field);
    for (const r of rows) await db[entity].delete(r.id);
    return rows.length;
  };
  const scrub = (entity: string, field: string, patch: Record<string, unknown>) => async () => {
    const rows = await byEmail(entity, field);
    for (const r of rows) await db[entity].update(r.id, patch);
    return rows.length;
  };

  await step('School portal access', remove('SchoolMember', 'email'));
  await step('Chat conversations', remove('SupportChat', 'contact_email'));
  await step('Newsletter signup', remove('NewsletterSubscriber', 'email'));
  await step('Event RSVPs', remove('EventRSVP', 'email'));
  await step('Contact messages', remove('ContactMessage', 'email'));
  await step('Item donation offers', remove('ItemDonation', 'email'));
  await step('Sponsorship applications', remove('SponsorshipApplication', 'email'));
  await step('Partner inquiries', remove('PartnerInquiry', 'email'));
  await step('Raffle entries', remove('RaffleEntry', 'email'));
  await step('Shop orders (email removed)', scrub('Order', 'email', { email: '' }));
  await step('Portal messages (name removed)', scrub('PortalMessage', 'author_email', { author_name: 'Former school staff', author_email: '' }));
  await step('Documents (uploader removed)', scrub('SchoolDocument', 'uploader_email', { uploader_email: '' }));
  await step('Bookings (contact removed)', scrub('BookingRequest', 'email', { contact_name: REMOVED, email: '', phone: '' }));
  await step('Bookings (billing contact removed)', scrub('BookingRequest', 'billing_contact_email', { billing_contact_name: REMOVED, billing_contact_email: '' }));

  let accountRemoved = false;
  try {
    await db.User.delete(user.id);
    accountRemoved = true;
  } catch (err) {
    console.error('deleteMyAccount: account record delete failed', err);
    failed.push('Account record');
  }

  try {
    await sendMail(base44, {
      to: 'greggsdevelopment@gmail.com',
      subject: failed.length ? `ACTION NEEDED: finish deleting ${user.email}` : `Account deleted: ${user.email}`,
      text: [
        `${user.full_name || 'A user'} (${user.email}) deleted their account from the app or site.`,
        '',
        done.length ? `Removed: ${done.join('; ')}` : 'No linked records were found.',
        failed.length
          ? `\r\nThese steps did not finish and must be done by hand within 7 days (Apple requires it): ${failed.join('; ')}.\r\nIn Base44: Dashboard > Users > Remove user, then check the tables above for their email.`
          : '',
      ].join('\r\n'),
    });
  } catch (err) {
    console.error('deleteMyAccount: email failed', err);
  }

  return json({
    success: true,
    account_removed: accountRemoved && failed.length === 0,
    message:
      accountRemoved && failed.length === 0
        ? 'Your account and personal details have been deleted.'
        : 'Your personal details are being deleted. A few items need our team to finish by hand; that will be done within 7 days, and we will email you when it is complete.',
  });
});
