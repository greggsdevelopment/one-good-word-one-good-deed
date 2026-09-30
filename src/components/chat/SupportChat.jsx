import { Suspense, lazy, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  INTENT_LABELS, clearSession, flag, intentForText, loadSession, localCrisisMessage, pageContext, rateMessage, saveSession, sendChatMessage, sendHandoff, setFlag,
} from '@/lib/chat';
import ChatLauncher from './ChatLauncher';
import ChatTeaser from './ChatTeaser';

const loadPanel = () => import('./ChatPanel');
const ChatPanel = lazy(loadPanel);

// Pages where the bubble would get in the way.
const HIDDEN = [/^\/admin/, /^\/login/, /^\/register/, /^\/forgot-password/, /^\/reset-password/];

const uid = () => Math.random().toString(36).slice(2, 10);

function reducer(state, a) {
  switch (a.type) {
    case 'restore':
      return { ...state, ...a.session };
    case 'sending':
      return { ...state, sending: true, messages: state.messages.filter((m) => m.role !== 'error') };
    case 'user':
      return { ...state, sending: true, messages: [...state.messages.filter((m) => m.role !== 'error'), a.message] };
    case 'bot': {
      const messages = state.messages.map((m) => (m.id === a.localId ? { ...m, id: a.userId || m.id } : m));
      return {
        ...state,
        sending: false,
        chatId: a.chatId || state.chatId,
        ticket: a.ticket || state.ticket,
        messages: [...messages, a.message],
        unread: a.open ? 0 : state.unread + 1,
      };
    }
    case 'error':
      return { ...state, sending: false, messages: [...state.messages, { id: uid(), role: 'error', content: a.message, retry: a.retry, fresh: true }] };
    case 'handoffDone':
      return { ...state, handoffSent: true, messages: [...state.messages, a.message] };
    case 'rate':
      return { ...state, messages: state.messages.map((m) => (m.id === a.id ? { ...m, rating: a.value } : m)) };
    case 'seen':
      return state.unread ? { ...state, unread: 0 } : state;
    case 'expire':
      return { ...state, chatId: null, ticket: null };
    case 'reset':
      return { ...initial, messages: [] };
    default:
      return state;
  }
}

const initial = { chatId: null, ticket: null, messages: [], sending: false, unread: 0, handoffSent: false };

function useMediaQuery(query) {
  const [match, setMatch] = useState(() => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false));
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [query]);
  return match;
}

export default function SupportChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPhone = useMediaQuery('(max-width: 639px)');
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initial);
  const [teaser, setTeaser] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;
  const stateRef = useRef(state);
  stateRef.current = state;
  // Bumped by "new chat" so a reply still in flight cannot land in the new chat.
  const generation = useRef(0);

  const { data: settings } = useQuery({
    queryKey: ['chat-settings'],
    queryFn: async () => {
      try {
        const rows = await base44.entities.ChatSettings.list('-updated_date', 1);
        return rows?.[0] || {};
      } catch {
        return {};
      }
    },
    staleTime: 5 * 60_000,
  });
  const enabled = settings ? settings.enabled !== false : false;
  const hidden = HIDDEN.some((re) => re.test(location.pathname));
  const ctx = useMemo(() => ({ ...pageContext(location.pathname), page: location.pathname }), [location.pathname]);

  // Bring back this tab's conversation after a reload.
  useEffect(() => {
    const s = loadSession();
    if (s) dispatch({ type: 'restore', session: { chatId: s.chatId, ticket: s.ticket, messages: s.messages, handoffSent: s.handoffSent } });
  }, []);

  useEffect(() => {
    if (state.messages.length || state.chatId) saveSession(state);
  }, [state]);

  // Load the panel code in the background once the page settles.
  useEffect(() => {
    if (!enabled || hidden) return undefined;
    const t = setTimeout(() => loadPanel().catch(() => {}), 3500);
    return () => clearTimeout(t);
  }, [enabled, hidden]);

  // The nudge: once per visit, after the visitor has had a moment on the page.
  useEffect(() => {
    setTeaser(false);
    if (!enabled || hidden || open || settings?.teaser_enabled === false || !ctx.teaser) return undefined;
    if (flag('teased') || flag('opened') || state.messages.length) return undefined;
    const show = setTimeout(() => {
      if (openRef.current) return;
      setTeaser(true);
      setFlag('teased');
    }, 9000);
    return () => clearTimeout(show);
     
  }, [location.pathname, enabled, hidden, settings?.teaser_enabled]);

  useEffect(() => {
    if (!teaser) return undefined;
    const t = setTimeout(() => setTeaser(false), 16000);
    return () => clearTimeout(t);
  }, [teaser]);

  const openChat = useCallback(() => {
    setOpen(true);
    setEverOpened(true);
    setTeaser(false);
    setFlag('opened');
    dispatch({ type: 'seen' });
  }, []);
  const closeChat = useCallback(() => {
    // Hand keyboard focus back to the bubble instead of dropping it on the page.
    const a = document.activeElement;
    const fromChat = !a || a === document.body || Boolean(a.closest?.('section[role=dialog]'));
    setOpen(false);
    if (fromChat) setTimeout(() => document.querySelector('.ogw-chat-launcher button')?.focus({ preventScroll: true }), 80);
  }, []);

  // Keep the page from scrolling behind the full-screen chat on phones.
  useEffect(() => {
    if (!(open && isPhone)) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isPhone]);

  const send = useCallback(
    async (input, { retried = false, resend = false } = {}) => {
      const s = stateRef.current;
      if (s.sending) return;
      const intent = input.intent || intentForText(input.text);
      const text = intent ? '' : String(input.text || '').trim();
      if (!intent && !text) return;
      const localId = uid();
      const gen = generation.current;
      if (!retried && !resend) {
        dispatch({
          type: 'user',
          message: { id: localId, role: 'user', content: intent ? input.label || INTENT_LABELS[intent] || 'Help' : text, at: new Date().toISOString(), fresh: true },
        });
      } else {
        dispatch({ type: 'sending' });
      }
      try {
        const res = await sendChatMessage({ chatId: s.chatId, ticket: s.ticket, text, intent, page: location.pathname + location.hash });
        if (gen !== generation.current) return undefined;
        dispatch({
          type: 'bot',
          localId,
          userId: res.user_message_id,
          chatId: res.chat_id,
          ticket: res.ticket,
          open: openRef.current,
          message: { ...res.message, role: 'assistant', content: res.message.text, at: new Date().toISOString(), fresh: true },
        });
      } catch (err) {
        if (gen !== generation.current) return undefined;
        if (err.code === 'chat_gone' && !retried) {
          // The saved chat expired or was removed: start a fresh one with the same question.
          dispatch({ type: 'expire' });
          stateRef.current = { ...stateRef.current, chatId: null, ticket: null, sending: false };
          return send(input, { retried: true });
        }
        // Whatever went wrong, someone in crisis still gets help lines.
        const help = localCrisisMessage(text);
        if (help) {
          dispatch({ type: 'bot', localId, open: openRef.current, message: { ...help, at: new Date().toISOString(), fresh: true } });
          return undefined;
        }
        dispatch({ type: 'error', message: err.message, retry: err.code === 'chat_full' || err.code === 'closed' ? null : input });
      }
      return undefined;
    },
    [location.pathname, location.hash],
  );

  const handoff = useCallback(async (form) => {
    const res = await sendHandoff(stateRef.current, form);
    dispatch({ type: 'handoffDone', message: { id: res.message?.id || uid(), role: 'assistant', content: res.message?.text || 'Thanks. Our team will be in touch.', source: 'handoff', at: new Date().toISOString(), fresh: true } });
    if (res.crisis) {
      dispatch({ type: 'bot', localId: null, open: openRef.current, message: { ...res.crisis, role: 'assistant', content: res.crisis.text, at: new Date().toISOString(), fresh: true } });
    }
    return res;
  }, []);

  const rate = useCallback((id, value) => {
    dispatch({ type: 'rate', id, value });
    rateMessage(stateRef.current, id, value).catch(() => {});
  }, []);

  const reset = useCallback(() => {
    generation.current += 1;
    clearSession();
    dispatch({ type: 'reset' });
  }, []);

  const go = useCallback(
    (href) => {
      if (!href) return;
      if (/^(tel:|sms:|mailto:)/.test(href)) {
        window.location.href = href;
        return;
      }
      if (/^https?:/.test(href)) {
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }
      navigate(href);
      // On a phone the chat covers the page, so step out of the way.
      if (isPhone) setOpen(false);
    },
    [navigate, isPhone],
  );

  if (!enabled || hidden) return null;

  return (
    <>
      <ChatTeaser
        show={teaser && !open}
        text={ctx.teaser}
        chips={ctx.chips}
        onOpen={openChat}
        onChip={(intent) => {
          openChat();
          send({ intent });
        }}
        onClose={() => setTeaser(false)}
      />
      <ChatLauncher open={open} unread={state.unread} attention={teaser} hideOnPhone={open && isPhone} onToggle={open ? closeChat : openChat} onIntent={() => loadPanel().catch(() => {})} />
      <Suspense fallback={null}>
        {(open || everOpened) && (
          <ChatPanel
            open={open}
            isPhone={isPhone}
            settings={settings || {}}
            ctx={ctx}
            state={state}
            onClose={closeChat}
            onSend={send}
            onHandoff={handoff}
            onRate={rate}
            onReset={reset}
            onNavigate={go}
          />
        )}
      </Suspense>
    </>
  );
}
