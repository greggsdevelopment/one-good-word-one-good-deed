/**
 * supportChat
 *
 * Backend for the chat assistant that floats on every page of ogwogd.org.
 * Public (visitors are not logged in), so it protects itself:
 *
 * - Safety first: every visitor message is checked for self-harm, danger and
 *   abuse wording before anything else. A match always gets 911 / 988 /
 *   741741 back, even if a limit, the bot check, or the database would
 *   otherwise refuse the message. The team is emailed (capped per day).
 * - A new chat needs a Cloudflare Turnstile token (see turnstile.ts). After
 *   that, every call must carry the chat's server-generated secret ticket.
 *   Tickets stop working after 7 days.
 * - One message at a time per chat (a short lock on the record), a minimum
 *   gap between messages, 60 messages per chat, and new-chat limits per
 *   network address and site-wide.
 * - AI answers and notification emails are "reserved" by writing a ChatEvent
 *   row first and then counting rows, so parallel requests cannot spend past
 *   ChatSettings.daily_ai_limit / per_chat_ai_limit or the email caps. Past a
 *   limit the assistant falls back to built-in answers, which cost nothing.
 * - Visitor text is length-capped, cleaned, and passed to the model only as a
 *   question. Reply buttons come from a fixed list, so a reply can never link
 *   anywhere else.
 * - Only this function can read or write chats; the entities are admin-only.
 *
 * Request (POST, JSON), one of:
 *   { action: 'message', text?: string, intent?: string, page?: string,
 *     chat_id?: string, ticket?: string, turnstile_token?: string }
 *   { action: 'handoff', chat_id, ticket, name, email, phone?, note? }
 *   { action: 'rate', chat_id, ticket, message_id, value: 'up' | 'down' | null }
 *
 * Responses:
 *   200 { success: true, chat_id, ticket?, message: { id, text, actions, suggestions, handoff, crisis, source } }
 *   200 { success: true }                                  (handoff, rate)
 *   400 { error: 'invalid', field?, message }
 *   403 { error: 'closed' | 'bot_check_failed', message }
 *   404 { error: 'chat_gone', message }                     start a new chat
 *   413 { error: 'too_large' }
 *   429 { error: 'rate_limited' | 'chat_full' | 'slow_down', message }
 *   503 { error: 'try_again' | 'bot_check_unavailable', message }
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { ACTIONS, ORG } from './knowledge.ts';
import {
  AI_SCHEMA,
  INTENTS,
  INTENT_KEYS,
  MAX_BODY_BYTES,
  MAX_MESSAGES_PER_CHAT,
  type Reply,
  buildPrompt,
  cleanPage,
  cleanText,
  crisisReply,
  detectCrisis,
  fallbackReply,
  formatLive,
  intentReply,
  numSetting,
  randomHex,
  safeEqual,
  sanitizeAiReply,
  sha256Hex,
  transcript,
  validateHandoff,
  withinMinutes,
} from './logic.ts';
import { verifyHuman } from './turnstile.ts';

const NOTIFY_TO = ORG.email;
const ADMIN = 'https://ogwogd.org/admin?tab=chats';

const NEW_CHATS_PER_IP_PER_HOUR = 8;
const NEW_CHATS_SITEWIDE_PER_HOUR = 150;
const MIN_GAP_MS = 1_200;
const AI_TIMEOUT_MS = 30_000;
const LOCK_MS = 45_000;
const TICKET_DAYS = 7;
const HANDOFF_EMAILS_PER_DAY = 40;
const HANDOFF_EMAILS_PER_CHAT = 3;
const URGENT_EMAILS_PER_DAY = 25;
const URGENT_EMAILS_PER_CHAT = 3;

const DEFAULTS = {
  enabled: true,
  ai_enabled: true,
  assistant_name: 'OGWOGD Guide',
  daily_ai_limit: 300,
  per_chat_ai_limit: 25,
  extra_knowledge: '',
};

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...CORS_HEADERS } });
}

const nowIso = () => new Date().toISOString();
const TRY_AGAIN = { error: 'try_again', message: 'Something hiccuped on our end. Please try again in a minute.' };

/** Calendar day in Michigan, so the daily limits reset at local midnight. */
function detroitDay(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

function clientIp(req: Request): string {
  const direct = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip');
  if (direct) return direct.trim();
  const fwd = req.headers.get('x-forwarded-for');
  return fwd ? fwd.split(',')[0].trim() : 'unknown';
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

/* ---------------------------------------------------------------- data */

async function loadSettings(db: any) {
  try {
    const rows = await db.ChatSettings.list('-updated_date', 1);
    return { ...DEFAULTS, ...(rows?.[0] || {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

// Site facts change rarely; keep them for a minute between requests.
let liveCache: { at: number; day: string; text: string } | null = null;

async function loadLive(db: any, today: string): Promise<string> {
  if (liveCache && liveCache.day === today && Date.now() - liveCache.at < 60_000) return liveCache.text;
  const safe = async (fn: () => Promise<any>) => {
    try {
      const v = await fn();
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  };
  const [events, donation, needs, products] = await Promise.all([
    safe(() => db.Event.list('-event_date', 60)),
    safe(() => db.DonationSettings.list('-updated_date', 1)),
    safe(() => db.DonationNeed.list('sort_order', 200)),
    safe(() => db.Product.list('sort_order', 50)),
  ]);
  const text = formatLive({ events, donation: donation[0], needs, products, today });
  liveCache = { at: Date.now(), day: today, text };
  return text;
}

/** Dashboard counters. Approximate by design; the limits use ChatEvent. */
async function bumpUsage(db: any, day: string, field: 'ai_calls' | 'chats' | 'handoffs') {
  try {
    const rows = await db.ChatUsage.filter({ day }, '-created_date', 1);
    const row = rows?.[0];
    if (row) await db.ChatUsage.update(row.id, { [field]: (Number(row[field]) || 0) + 1 });
    else await db.ChatUsage.create({ day, ai_calls: 0, chats: 0, handoffs: 0, [field]: 1 });
  } catch (err) {
    console.error('supportChat: usage counter failed', err);
  }
}

/**
 * Writes a ChatEvent, then counts. Because rows are only ever added, parallel
 * requests all see each other's reservations and the ones past the limit back
 * off. A refused reservation still counts, which errs on the side of spending
 * less. Any database error refuses.
 */
async function reserve(db: any, kind: string, chatId: string, day: string, perDay: number, perChat: number): Promise<boolean> {
  if (perDay <= 0 || perChat <= 0) return false;
  try {
    const mine = await db.ChatEvent.create({ day, chat_id: chatId, kind });
    const today = await db.ChatEvent.filter({ day, kind }, 'created_date', perDay + 1);
    if (today.length > perDay && !today.slice(0, perDay).some((r: any) => r.id === mine.id)) return false;
    const chat = await db.ChatEvent.filter({ chat_id: chatId, kind }, 'created_date', perChat + 1);
    if (chat.length > perChat && !chat.slice(0, perChat).some((r: any) => r.id === mine.id)) return false;
    return true;
  } catch (err) {
    console.error('supportChat: reserve failed', kind, err);
    return false;
  }
}

async function loadChat(db: any, chatId: unknown, ticket: unknown) {
  if (typeof chatId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(chatId)) return null;
  if (typeof ticket !== 'string' || ticket.length > 100) return null;
  try {
    const rows = await db.SupportChat.filter({ id: chatId });
    const chat = rows?.[0];
    if (!chat || !safeEqual(ticket, String(chat.ticket || ''))) return null;
    if (!withinMinutes(chat.created_date, TICKET_DAYS * 24 * 60)) return null;
    return chat;
  } catch {
    return null;
  }
}

/** One request at a time per chat. Returns the fresh record, or null if busy. */
async function lockChat(db: any, chat: any): Promise<any | null> {
  if (chat.busy_until && Date.parse(chat.busy_until) > Date.now()) return null;
  const token = randomHex(8);
  try {
    await db.SupportChat.update(chat.id, { busy_token: token, busy_until: new Date(Date.now() + LOCK_MS).toISOString() });
    const rows = await db.SupportChat.filter({ id: chat.id });
    const fresh = rows?.[0];
    return fresh && fresh.busy_token === token ? fresh : null;
  } catch {
    return null;
  }
}

const UNLOCK = { busy_token: '', busy_until: null };

async function unlock(db: any, id: string) {
  try {
    await db.SupportChat.update(id, UNLOCK);
  } catch {
    // the lock expires on its own
  }
}

/* ---------------------------------------------------------------- email */

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function safeHeader(value: unknown): string {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, 150);
}

async function sendMail(base44: any, subject: string, text: string, replyTo?: string) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const reply = replyTo && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(replyTo) ? safeHeader(replyTo) : '';
  const raw = base64UrlEncode(
    `To: ${NOTIFY_TO}\r\n` +
      `Subject: ${safeHeader(subject)}\r\n` +
      (reply ? `Reply-To: ${reply}\r\n` : '') +
      'Content-Type: text/plain; charset=UTF-8\r\nMIME-Version: 1.0\r\n\r\n' +
      text,
  );
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) throw new Error(`Gmail ${res.status}: ${await res.text()}`);
}

async function urgentAlert(base44: any, db: any, chat: any, messages: any[], day: string): Promise<boolean> {
  if (!(await reserve(db, 'urgent_email', chat.id, day, URGENT_EMAILS_PER_DAY, URGENT_EMAILS_PER_CHAT))) return false;
  try {
    await sendMail(
      base44,
      'URGENT: safety message in the ogwogd.org chat',
      [
        'A visitor in the website chat wrote something that matched the safety check.',
        'The assistant already showed them 911, 988 and the Crisis Text Line.',
        'The visitor is anonymous unless they leave contact details. Review the chat and decide if any follow up is possible.',
        '',
        transcript(messages, 12),
        '',
        `Open in admin: ${ADMIN}:${chat.id}`,
      ].join('\r\n'),
    );
    return true;
  } catch (err) {
    console.error('supportChat: urgent alert email failed', err);
    return false;
  }
}

/* ---------------------------------------------------------------- actions */

function publicMessage(id: string, reply: Reply, source: string) {
  return {
    id,
    text: reply.text,
    actions: reply.actions.filter((k) => ACTIONS[k]).map((k) => ({ key: k, label: ACTIONS[k].label, href: ACTIONS[k].href })),
    suggestions: reply.suggestions,
    handoff: reply.handoff,
    crisis: reply.crisis || null,
    source,
  };
}

async function handleMessage(req: Request, base44: any, db: any, settings: any, body: any, crisis: Reply['crisis']): Promise<Response> {
  const text = cleanText(body?.text);
  const intent = typeof body?.intent === 'string' && INTENT_KEYS.includes(body.intent) ? body.intent : null;
  if (!text && !intent) return json({ error: 'invalid', field: 'text', message: 'Type a question first.' }, 400);
  const page = cleanPage(body?.page);
  const today = detroitDay();

  let chat: any;
  let isNew = false;
  if (!body?.chat_id) {
    const human = await verifyHuman(req, body?.turnstile_token, 'chat');
    if (!human.ok) return json(human.body, human.status);

    const ipHash = (await sha256Hex(`ogwogd-chat:${clientIp(req)}`)).slice(0, 32);
    try {
      const mine = await db.SupportChat.filter({ ip_hash: ipHash }, '-created_date', NEW_CHATS_PER_IP_PER_HOUR);
      if (mine.length >= NEW_CHATS_PER_IP_PER_HOUR && mine.every((c: any) => withinMinutes(c.created_date, 60))) {
        return json({ error: 'rate_limited', message: `You have started a lot of chats in the last hour. Please try again later, or call ${ORG.phone}.` }, 429);
      }
      const all = await db.SupportChat.list('-created_date', NEW_CHATS_SITEWIDE_PER_HOUR);
      if (all.length >= NEW_CHATS_SITEWIDE_PER_HOUR && all.every((c: any) => withinMinutes(c.created_date, 60))) {
        return json({ error: 'rate_limited', message: `Our chat is very busy right now. Please try again in a little while, or call ${ORG.phone}.` }, 429);
      }
      chat = await db.SupportChat.create({
        ticket: randomHex(24),
        status: 'open',
        messages: [],
        message_count: 0,
        ai_replies: 0,
        first_page: page,
        last_page: page,
        topics: [],
        urgent: false,
        rating_up: 0,
        rating_down: 0,
        ip_hash: ipHash,
        last_message_at: nowIso(),
        busy_token: 'new',
        busy_until: new Date(Date.now() + LOCK_MS).toISOString(),
      });
    } catch (err) {
      console.error('supportChat: start failed', err);
      return json(TRY_AGAIN, 503);
    }
    isNew = true;
    await bumpUsage(db, today, 'chats');
  } else {
    const found = await loadChat(db, body.chat_id, body.ticket);
    if (!found) return json({ error: 'chat_gone', message: 'That chat has ended. Starting a fresh one.' }, 404);
    chat = await lockChat(db, found);
    if (!chat) return json({ error: 'slow_down', message: 'One second, still working on your last message.' }, 429);
  }

  const messages: any[] = Array.isArray(chat.messages) ? chat.messages : [];
  if (messages.length >= MAX_MESSAGES_PER_CHAT) {
    await unlock(db, chat.id);
    return json({ error: 'chat_full', message: `This chat is full. Start a new one, or leave your details so a person can follow up. You can also call ${ORG.phone}.` }, 429);
  }
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (lastUser && Date.now() - Date.parse(lastUser.at || '') < MIN_GAP_MS) {
    await unlock(db, chat.id);
    return json({ error: 'slow_down', message: 'One second, still catching up on your last message.' }, 429);
  }

  const visitorText = text || INTENTS[intent!].label;
  const userMsg = { id: randomHex(6), role: 'user', content: visitorText, at: nowIso(), source: intent ? 'quick' : 'visitor' };
  const history = [...messages, userMsg];

  let reply: Reply;
  let source: string;
  let usedAi = false;
  const perChat = numSetting(settings.per_chat_ai_limit, DEFAULTS.per_chat_ai_limit);
  const perDay = numSetting(settings.daily_ai_limit, DEFAULTS.daily_ai_limit);

  if (crisis) {
    reply = crisisReply(crisis);
    source = 'crisis';
  } else if (intent) {
    reply = intentReply(intent, today)!;
    source = 'quick';
  } else if (settings.ai_enabled === false) {
    reply = fallbackReply(visitorText, 'off', today);
    source = 'fallback';
  } else if (!(await reserve(db, 'ai', chat.id, today, perDay, perChat))) {
    reply = fallbackReply(visitorText, 'limit', today);
    source = 'fallback';
  } else {
    usedAi = true;
    bumpUsage(db, today, 'ai_calls');
    let ai: Reply | null = null;
    try {
      const live = await loadLive(db, today);
      const prompt = buildPrompt({
        assistantName: cleanText(settings.assistant_name, 40) || DEFAULTS.assistant_name,
        live,
        adminNotes: String(settings.extra_knowledge || ''),
        history: history.map((m) => ({ role: m.role, content: m.content })),
        page,
        today,
      });
      const raw = await withTimeout(
        base44.asServiceRole.integrations.Core.InvokeLLM({ prompt, response_json_schema: AI_SCHEMA }),
        AI_TIMEOUT_MS,
      );
      ai = sanitizeAiReply(raw);
    } catch (err) {
      console.error('supportChat: AI call failed', err);
      ai = null;
    }
    if (ai) {
      reply = ai;
      source = 'ai';
    } else {
      reply = fallbackReply(visitorText, 'error', today);
      source = 'fallback';
    }
  }

  const botMsg = { id: randomHex(6), role: 'assistant', content: reply.text, at: nowIso(), source };
  const topics = [...new Set([...(Array.isArray(chat.topics) ? chat.topics : []), reply.topic].filter(Boolean))].slice(0, 12);
  const update: Record<string, unknown> = {
    messages: [...history, botMsg].slice(-MAX_MESSAGES_PER_CHAT),
    message_count: (Number(chat.message_count) || 0) + 2,
    ai_replies: (Number(chat.ai_replies) || 0) + (usedAi ? 1 : 0),
    last_page: page,
    last_message_at: botMsg.at,
    topics,
    ...UNLOCK,
  };
  if (chat.status === 'resolved') update.status = chat.handoff_at ? 'needs_reply' : 'open';
  if (crisis) {
    update.urgent = true;
    if (!chat.urgent_alert_sent_at && (await urgentAlert(base44, db, chat, update.messages as any[], today))) {
      update.urgent_alert_sent_at = nowIso();
    }
  }

  try {
    await db.SupportChat.update(chat.id, update);
  } catch (err) {
    console.error('supportChat: save failed', err);
    await unlock(db, chat.id);
    return json(TRY_AGAIN, 503);
  }

  return json({
    success: true,
    chat_id: chat.id,
    ticket: isNew ? chat.ticket : undefined,
    user_message_id: userMsg.id,
    message: publicMessage(botMsg.id, reply, source),
  });
}

async function handleHandoff(base44: any, db: any, body: any): Promise<Response> {
  const found = await loadChat(db, body?.chat_id, body?.ticket);
  if (!found) return json({ error: 'chat_gone', message: `That chat has ended. Please use the contact page or call ${ORG.phone}.` }, 404);
  const checked = validateHandoff(body);
  if (!checked.ok) return json({ error: 'invalid', field: checked.field, message: checked.message }, 400);
  const v = checked.value;
  const chat = await lockChat(db, found);
  if (!chat) return json({ error: 'slow_down', message: 'One second, still working on your last message. Try again.' }, 429);
  const today = detroitDay();
  const urgentNote = Boolean(detectCrisis(v.note));

  const messages: any[] = Array.isArray(chat.messages) ? chat.messages : [];
  const confirm = {
    id: randomHex(6),
    role: 'assistant',
    content: `Thanks, ${v.name.split(' ')[0]}. Your message is with our team and we will reply to ${v.email}, usually within two business days.`,
    at: nowIso(),
    source: 'handoff',
  };
  const update: Record<string, unknown> = {
    contact_name: v.name,
    contact_email: v.email,
    contact_phone: v.phone,
    handoff_note: v.note,
    handoff_at: nowIso(),
    status: 'needs_reply',
    messages: [...messages, confirm].slice(-MAX_MESSAGES_PER_CHAT),
    last_message_at: confirm.at,
    ...UNLOCK,
  };
  if (urgentNote) update.urgent = true;

  // A double tap or a quick correction should not send three emails.
  if (!withinMinutes(chat.notification_sent_at, 10) && (await reserve(db, 'handoff_email', chat.id, today, HANDOFF_EMAILS_PER_DAY, HANDOFF_EMAILS_PER_CHAT))) {
    try {
      await sendMail(
        base44,
        `${urgentNote || chat.urgent ? 'URGENT ' : ''}Chat: ${v.name} wants a person`,
        [
          'A visitor in the ogwogd.org chat asked for a person to follow up. Reply to this email to answer them directly.',
          urgentNote || chat.urgent ? 'SAFETY FLAG: something in this chat matched the safety check. The visitor was shown 911, 988 and 741741.' : null,
          '',
          `Name: ${v.name}`,
          `Email: ${v.email}`,
          v.phone ? `Phone: ${v.phone}` : null,
          `Started on: ${chat.first_page || '/'}`,
          v.note ? `\r\nWhat they need:\r\n${v.note}` : null,
          '',
          '--- Conversation ---',
          transcript(messages, 30) || '(no messages)',
          '',
          `Open in admin: ${ADMIN}:${chat.id}`,
        ].filter((l) => l !== null).join('\r\n'),
        v.email,
      );
      update.notification_sent_at = nowIso();
    } catch (err) {
      console.error('supportChat: handoff email failed', err);
    }
    await bumpUsage(db, today, 'handoffs');
  }

  try {
    await db.SupportChat.update(chat.id, update);
  } catch (err) {
    console.error('supportChat: handoff save failed', err);
    await unlock(db, chat.id);
    return json({ error: 'try_again', message: `Something went wrong saving that. Please call ${ORG.phone} or email ${ORG.email}.` }, 503);
  }
  const reply: Reply | null = urgentNote ? crisisReply(detectCrisis(v.note)!) : null;
  return json({ success: true, message: { id: confirm.id, text: confirm.content }, crisis: reply ? publicMessage(randomHex(6), reply, 'crisis') : undefined });
}

async function handleRate(db: any, body: any): Promise<Response> {
  const found = await loadChat(db, body?.chat_id, body?.ticket);
  if (!found) return json({ error: 'chat_gone', message: 'That chat has ended.' }, 404);
  const value = body?.value === 'up' || body?.value === 'down' ? body.value : null;
  const chat = await lockChat(db, found);
  if (!chat) return json({ error: 'slow_down', message: 'Try again in a second.' }, 429);
  const messages: any[] = Array.isArray(chat.messages) ? chat.messages : [];
  const idx = messages.findIndex((m) => m.id === body?.message_id && m.role === 'assistant');
  if (idx < 0) {
    await unlock(db, chat.id);
    return json({ error: 'invalid', message: 'Unknown message.' }, 400);
  }
  const next = messages.map((m, i) => (i === idx ? { ...m, rating: value || undefined } : m));
  try {
    await db.SupportChat.update(chat.id, {
      messages: next,
      rating_up: next.filter((m) => m.rating === 'up').length,
      rating_down: next.filter((m) => m.rating === 'down').length,
      ...UNLOCK,
    });
  } catch {
    await unlock(db, chat.id);
    return json({ error: 'try_again', message: 'Could not save that.' }, 503);
  }
  return json({ success: true });
}

/** The safety answer on its own, for when the normal path refused or failed. */
function crisisOnly(body: any, kind: NonNullable<Reply['crisis']>, reason: string): Response {
  console.error('supportChat: safety answer sent without saving', reason);
  return json({
    success: true,
    chat_id: typeof body?.chat_id === 'string' ? body.chat_id : null,
    unsaved: true,
    message: publicMessage(randomHex(6), crisisReply(kind), 'crisis'),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return json({ error: 'invalid', message: 'That request could not be read.' }, 400);
  }
  let body: any;
  try {
    body = JSON.parse(raw.slice(0, 50_000));
  } catch {
    body = null;
  }
  const action = String(body?.action || 'message');
  // Safety runs before every other check, including size and on/off.
  const crisis = action === 'message' ? detectCrisis(cleanText(body?.text)) : null;

  if (raw.length > MAX_BODY_BYTES) return crisis ? crisisOnly(body, crisis, 'too_large') : json({ error: 'too_large', message: 'That message is too long.' }, 413);
  if (!body) return json({ error: 'invalid', message: 'That request could not be read.' }, 400);

  const base44 = createClientFromRequest(req);
  const db = base44.asServiceRole.entities as any;
  const settings = await loadSettings(db);
  if (settings.enabled === false) {
    if (crisis) return crisisOnly(body, crisis, 'closed');
    return json({ error: 'closed', message: `Chat is off right now. Call ${ORG.phone} or email ${ORG.email} and we will help.` }, 403);
  }

  if (action === 'message') {
    let res: Response | null = null;
    try {
      res = await handleMessage(req, base44, db, settings, body, crisis);
    } catch (err) {
      console.error('supportChat: message failed', err);
      res = null;
    }
    if (crisis && (!res || res.status !== 200)) return crisisOnly(body, crisis, res ? String(res.status) : 'exception');
    return res || json(TRY_AGAIN, 503);
  }
  try {
    if (action === 'handoff') return await handleHandoff(base44, db, body);
    if (action === 'rate') return await handleRate(db, body);
  } catch (err) {
    console.error('supportChat: action failed', action, err);
    return json(TRY_AGAIN, 503);
  }
  return json({ error: 'invalid', message: 'Unknown action.' }, 400);
});
