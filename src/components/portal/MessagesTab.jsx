import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowUp, Loader2, MessageSquare } from 'lucide-react';
import { callPortal, portalKey } from '@/lib/portal';
import { Empty } from './ui';

const TOPICS = [
  ['general', 'General'],
  ['schedule', 'Schedule'],
  ['billing', 'Billing'],
  ['documents', 'Documents'],
];

function when(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function MessagesTab({ data, schoolId }) {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [text, setText] = useState(() => params.get('draft') || '');
  const [topic, setTopic] = useState(() => (TOPICS.some(([k]) => k === params.get('topic')) ? params.get('topic') : 'general'));
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const boxRef = useRef(null);
  const messages = data.messages || [];

  // Drafts from other tabs are one-time; keep the URL clean afterwards.
  useEffect(() => {
    if (params.get('draft') || params.get('topic')) {
      const next = new URLSearchParams(params);
      next.delete('draft');
      next.delete('topic');
      setParams(next, { replace: true });
      boxRef.current?.focus();
    }
     
  }, []);

  useEffect(() => {
    if (!data.viewingAsAdmin && messages.some((m) => m.author === 'ogwogd' && !m.read_by_school)) {
      callPortal('markRead', { school_id: schoolId })
        .then(() => qc.setQueryData(portalKey(schoolId), (old) => old && { ...old, messages: old.messages.map((m) => ({ ...m, read_by_school: true })) }))
        .catch(() => {});
    }
  }, [messages, schoolId, data.viewingAsAdmin, qc]);

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const send = async (e) => {
    e?.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    const key = portalKey(schoolId);
    const temp = { id: `temp-${Date.now()}`, author: data.viewingAsAdmin ? 'ogwogd' : 'school', author_name: data.me?.name || 'You', body, topic, created_date: new Date().toISOString(), pending: true };
    // Show it right away; swap in the saved copy when the server answers.
    qc.setQueryData(key, (old) => old && { ...old, messages: [...old.messages, temp] });
    setText('');
    setSending(true);
    try {
      const res = await callPortal('postMessage', { school_id: schoolId, body, topic });
      qc.setQueryData(key, (old) => old && { ...old, messages: old.messages.map((m) => (m.id === temp.id ? res.message : m)) });
    } catch (err) {
      qc.setQueryData(key, (old) => old && { ...old, messages: old.messages.filter((m) => m.id !== temp.id) });
      setText(body);
      toast.error('Message not sent', { description: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-3 pb-4">
        {messages.length === 0 && (
          <Empty icon={MessageSquare} title="Start the conversation">
            Questions about dates, billing or anything else come straight to Cody. You will get an email when we reply.
          </Empty>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const mine = data.viewingAsAdmin ? m.author === 'ogwogd' : m.author === 'school';
            return (
              <motion.div
                key={m.id}
                layout="position"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${mine ? 'bg-gold text-ink rounded-br-md' : 'bg-white/[0.06] border border-white/10 text-cream rounded-bl-md'} ${m.pending ? 'opacity-70' : ''}`}>
                  <p className={`font-barlow-condensed uppercase tracking-wider text-[11px] ${mine ? 'text-ink/60' : 'text-cream/50'}`}>
                    {m.author === 'ogwogd' ? 'OGWOGD' : m.author_name || 'School'}
                    {m.topic && m.topic !== 'general' ? ` · ${m.topic}` : ''}
                  </p>
                  <p className="font-barlow text-[15px] leading-relaxed whitespace-pre-wrap break-words mt-0.5">{m.body}</p>
                  <p className={`font-barlow text-[11px] mt-1 ${mine ? 'text-ink/50' : 'text-cream/40'}`}>{m.pending ? 'Sending...' : when(m.created_date)}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="sticky bottom-[calc(var(--tabbar-h,0px)+12px)] rounded-2xl border border-white/15 bg-[#0e0e11] p-3 shadow-2xl shadow-black/60">
        <div className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none]" data-no-ptr>
          {TOPICS.map(([k, label]) => (
            <button key={k} type="button" onClick={() => setTopic(k)} className={`shrink-0 rounded-full px-3 py-1 font-barlow-condensed uppercase tracking-wider text-[11px] border ${topic === k ? 'border-rb-yellow text-rb-yellow bg-rb-yellow/10' : 'border-white/15 text-cream/60'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <textarea
            ref={boxRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(e);
            }}
            rows={2}
            maxLength={4000}
            placeholder="Write a message"
            aria-label="Message"
            className="flex-1 resize-none bg-transparent outline-none font-barlow text-cream placeholder:text-cream/35 px-1 py-1 max-h-40"
          />
          <button type="submit" disabled={!text.trim() || sending} aria-label="Send" className="grid place-items-center w-11 h-11 rounded-xl bg-gold text-ink disabled:bg-white/[0.06] disabled:text-cream/30 shrink-0">
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" strokeWidth={2.5} />}
          </button>
        </div>
      </form>
    </div>
  );
}
