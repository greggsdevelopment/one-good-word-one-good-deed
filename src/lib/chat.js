import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { getHumanToken } from '@/lib/turnstile';
// Same safety rules the server uses, so help still shows if the network fails.
import { crisisReply, detectCrisis } from '../../base44/functions/supportChat/safety.ts';

/* ------------------------------------------------------------------ API */

/** Error with a message that is safe to show in the chat. */
function chatError(err) {
  const data = err?.response?.data || err?.data || null;
  const e = new Error(
    data?.message ||
      (err?.humanCheck ? err.message : '') ||
      'We could not reach the chat just now. Check your connection and try again.',
  );
  e.code = data?.error || (err?.humanCheck ? 'bot_check' : 'network');
  e.status = err?.response?.status || err?.status || 0;
  e.field = data?.field || null;
  return e;
}

async function call(payload) {
  let res;
  try {
    res = await base44.functions.invoke('supportChat', payload);
  } catch (err) {
    throw chatError(err);
  }
  const data = res?.data ?? res;
  if (!data?.success) throw chatError({ data });
  return data;
}

/**
 * Sends a visitor message (text) or a quick action (intent). Starts a chat,
 * with Cloudflare's bot check, when there is no chat yet.
 */
export async function sendChatMessage({ chatId, ticket, text, intent, page }) {
  const payload = { action: 'message', text, intent, page };
  if (chatId) {
    payload.chat_id = chatId;
    payload.ticket = ticket;
  } else {
    try {
      payload.turnstile_token = await getHumanToken('chat');
    } catch (err) {
      throw chatError(err);
    }
  }
  return call(payload);
}

export const sendHandoff = (session, form) => call({ action: 'handoff', chat_id: session.chatId, ticket: session.ticket, ...form });

export const rateMessage = (session, messageId, value) =>
  call({ action: 'rate', chat_id: session.chatId, ticket: session.ticket, message_id: messageId, value });

/* ------------------------------------------------------------------ safety */

const SAFETY_ACTIONS = {
  call_988: { label: 'Call or text 988', href: 'tel:988' },
  text_741741: { label: 'Text HOME to 741741', href: 'sms:741741?&body=HOME' },
  call_911: { label: 'Call 911', href: 'tel:911' },
  resources: { label: 'Help and resources', href: '/resources' },
};

/** A crisis answer built in the browser, or null when the text is not a crisis. */
export function localCrisisMessage(text) {
  const kind = detectCrisis(String(text || ''));
  if (!kind) return null;
  const r = crisisReply(kind);
  return {
    id: `local-${Math.random().toString(36).slice(2, 10)}`,
    role: 'assistant',
    content: r.text,
    actions: r.actions.filter((k) => SAFETY_ACTIONS[k]).map((k) => ({ key: k, ...SAFETY_ACTIONS[k] })),
    suggestions: [],
    handoff: false,
    crisis: kind,
    source: 'crisis',
    local: true,
  };
}

/* ------------------------------------------------------------------ session */

const KEY = 'ogw-chat-v1';

export function loadSession() {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : null;
    if (!v || !Array.isArray(v.messages)) return null;
    return v;
  } catch {
    return null;
  }
}

export function saveSession(s) {
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({
        chatId: s.chatId || null,
        ticket: s.ticket || null,
        handoffSent: Boolean(s.handoffSent),
        // Restored messages never replay their entrance animation.
        messages: (s.messages || []).slice(-40).map(({ fresh, ...m }) => m),
      }),
    );
  } catch {
    // private mode or blocked storage: the chat still works for this page view
  }
}

export function clearSession() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function flag(name) {
  try {
    return window.sessionStorage.getItem(`ogw-chat-${name}`) === '1';
  } catch {
    return false;
  }
}

export function setFlag(name) {
  try {
    window.sessionStorage.setItem(`ogw-chat-${name}`, '1');
  } catch {
    // ignore
  }
}

/* ------------------------------------------------------------------ copy */

/** Must match the labels of INTENTS in base44/functions/supportChat/logic.ts. */
export const INTENT_LABELS = {
  book: 'Book a school program',
  donate_items: 'Donate items',
  donate_funds: 'Donate funds',
  tax: 'Tax deductible?',
  pledge: 'Take the pledge',
  events: 'Upcoming events',
  drayke: 'Who was Drayke?',
  sponsor: 'Become a sponsor',
  shop: 'Shop and orders',
  bullied: 'I am being bullied',
  help_now: 'I need help now',
  about: 'Who are you?',
  talk_person: 'Talk to a person',
};

const LABEL_TO_INTENT = Object.fromEntries(Object.entries(INTENT_LABELS).map(([k, v]) => [v.toLowerCase(), k]));

export const intentForText = (text) => LABEL_TO_INTENT[String(text || '').trim().toLowerCase()] || null;

/** What the teaser bubble says, and which quick actions come first, per page. */
export function pageContext(pathname = '/') {
  const p = pathname.toLowerCase();
  if (p.startsWith('/programs')) return { teaser: 'Planning for your school? I can walk you through programs and pricing in seconds.', chips: ['book', 'talk_person'], first: 'book' };
  if (p.startsWith('/donate')) return { teaser: 'Not sure if we can take something? Ask me before you pack it up.', chips: ['donate_items', 'tax'], first: 'donate_items' };
  if (p.startsWith('/events') || p.startsWith('/rsvp')) return { teaser: 'Coming to A Night For Drayke? Ask me anything about it.', chips: ['events', 'talk_person'], first: 'events' };
  if (p.startsWith('/shop') || p.startsWith('/checkout')) return { teaser: 'Question about sizes, shipping or an order? I can help.', chips: ['shop', 'talk_person'], first: 'shop' };
  if (p.startsWith('/sponsorship') || p.startsWith('/hall-of-fame')) return { teaser: 'Thinking about sponsoring? I can break down every level.', chips: ['sponsor', 'talk_person'], first: 'sponsor' };
  if (p.startsWith('/resources')) return { teaser: 'Looking for someone to talk to? I can point you to free help, day or night.', chips: ['help_now', 'bullied'], first: 'help_now' };
  if (p.startsWith('/pledge')) return { teaser: 'Ready to take the pledge? I can tell you how it works.', chips: ['pledge', 'about'], first: 'pledge' };
  if (p.startsWith('/drayke')) return { teaser: null, chips: ['drayke', 'events'], first: 'events' };
  return { teaser: 'Hi there. Questions about One Good Word? I answer in seconds.', chips: ['book', 'donate_items'], first: 'book' };
}

/* ------------------------------------------------------------------ visibility */

/**
 * Lets any overlay (cart drawer, mobile menu) hide the chat bubble while it is
 * open, so the bubble never covers a checkout button or a menu item.
 */
export function useHideChatWhile(active) {
  useEffect(() => {
    if (!active) return undefined;
    const el = document.documentElement;
    el.dataset.chatHide = String((Number(el.dataset.chatHide) || 0) + 1);
    return () => {
      const n = (Number(el.dataset.chatHide) || 1) - 1;
      if (n <= 0) delete el.dataset.chatHide;
      else el.dataset.chatHide = String(n);
    };
  }, [active]);
}

/** Raises the chat bubble while a bottom bar (like the shop cart bar) is showing. */
export function useLiftChatWhile(active, px = 76) {
  useEffect(() => {
    if (!active) return undefined;
    const el = document.documentElement;
    el.style.setProperty('--chat-lift', `${px}px`);
    return () => el.style.removeProperty('--chat-lift');
  }, [active, px]);
}
