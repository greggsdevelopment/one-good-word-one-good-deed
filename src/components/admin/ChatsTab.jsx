import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';
import {
  AlertTriangle, ArrowLeft, Bot, CheckCircle2, Download, Lightbulb, Mail, MessageCircle, Phone, RotateCcw, Search, Settings2,
  Sparkles, ThumbsDown, ThumbsUp, UserRound, Zap,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ADMIN_SOURCES, SIGNATURE, downloadCsv, lower, mailto, timeAgo, useAdminData } from '@/lib/adminData';
import { INTENT_LABELS } from '@/lib/chat';

const label = 'font-barlow-condensed text-xs uppercase tracking-wider text-ash block mb-1';
const SETTINGS_KEY = ['chat-settings'];
const USAGE_KEY = ['admin-chat-usage'];
const INTENT_TEXTS = new Set(Object.values(INTENT_LABELS).map((l) => l.toLowerCase()));

const SOURCE = {
  ai: { text: 'AI', cls: 'bg-violet-100 text-violet-700' },
  quick: { text: 'Quick answer', cls: 'bg-sky-100 text-sky-700' },
  fallback: { text: 'Built-in answer', cls: 'bg-amber-100 text-amber-700' },
  crisis: { text: 'Safety answer', cls: 'bg-red-100 text-red-700' },
  handoff: { text: 'Handoff', cls: 'bg-emerald-100 text-emerald-700' },
};

function detroitDay(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

const firstQuestion = (c) => (c.messages || []).find((m) => m.role === 'user')?.content || '';
const who = (c) => c.contact_name || 'Anonymous visitor';

/* ------------------------------------------------------------------ settings */

function Toggle({ checked, onChange, title, body }) {
  return (
    <label className="flex items-start justify-between gap-4 bg-white border border-ink/10 rounded-sm p-4 cursor-pointer">
      <span>
        <span className="block font-barlow-condensed font-bold text-ink tracking-wide">{title}</span>
        <span className="block font-barlow text-ash text-sm">{body}</span>
      </span>
      <span className="flex items-center gap-2 shrink-0">
        <span className={`font-barlow-condensed text-xs uppercase tracking-wider ${checked ? 'text-green-700' : 'text-red-600'}`}>{checked ? 'On' : 'Off'}</span>
        <Switch checked={checked} onCheckedChange={onChange} />
      </span>
    </label>
  );
}

function SettingsPanel({ settings, teach, onTaught }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const savedKey = JSON.stringify(settings);
  useEffect(() => setForm(settings), [savedKey]);  

  // "Teach the assistant" from an unanswered question drops a template here.
  useEffect(() => {
    if (!teach) return;
    setForm((f) => ({ ...f, extra_knowledge: `${f.extra_knowledge ? `${f.extra_knowledge.trim()}\n` : ''}Q: ${teach}\nA: ` }));
    onTaught?.();
    setTimeout(() => {
      const el = document.getElementById('chat-knowledge');
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (el) el.selectionStart = el.selectionEnd = el.value.length;
    }, 50);
  }, [teach]);  

  const persist = async (next) => {
    const data = {
      enabled: next.enabled !== false,
      ai_enabled: next.ai_enabled !== false,
      teaser_enabled: next.teaser_enabled !== false,
      assistant_name: String(next.assistant_name || 'OGWOGD Guide').slice(0, 40),
      greeting: String(next.greeting || '').slice(0, 300),
      daily_ai_limit: next.daily_ai_limit === '' || next.daily_ai_limit == null ? 300 : Math.min(5000, Math.max(0, Math.round(Number(next.daily_ai_limit) || 0))),
      per_chat_ai_limit: next.per_chat_ai_limit === '' || next.per_chat_ai_limit == null ? 25 : Math.min(100, Math.max(0, Math.round(Number(next.per_chat_ai_limit) || 0))),
      extra_knowledge: String(next.extra_knowledge || '').slice(0, 4000),
    };
    if (settings.id) await base44.entities.ChatSettings.update(settings.id, data);
    else await base44.entities.ChatSettings.create(data);
    await qc.invalidateQueries({ queryKey: SETTINGS_KEY });
  };

  const flip = (key) => async (value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    try {
      await persist(next);
      sonner.success('Saved', { description: 'The chat on the site is updated.' });
    } catch (err) {
      setForm(form);
      sonner.error('Could not save', { description: err?.message || 'Try again.' });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await persist(form);
      sonner.success('Chat settings saved');
    } catch (err) {
      sonner.error('Could not save', { description: err?.message || 'Try again.' });
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const knowledgeLeft = 4000 - String(form.extra_knowledge || '').length;

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <Toggle checked={form.enabled !== false} onChange={flip('enabled')} title="Chat on the site" body="Off hides the bubble on every page." />
        <Toggle checked={form.ai_enabled !== false} onChange={flip('ai_enabled')} title="AI answers" body="Off uses built-in answers only. No AI credits." />
        <Toggle checked={form.teaser_enabled !== false} onChange={flip('teaser_enabled')} title="Pop-up nudge" body="Small hello next to the bubble, once per visit." />
      </div>
      <form onSubmit={save} className="bg-white border border-ink/10 rounded-sm p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className={label}>Assistant name</span>
            <Input value={form.assistant_name || ''} onChange={set('assistant_name')} placeholder="OGWOGD Guide" maxLength={40} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>AI answers per day</span>
              <Input type="number" min={0} max={5000} value={form.daily_ai_limit ?? 300} onChange={set('daily_ai_limit')} />
            </div>
            <div>
              <span className={label}>AI answers per chat</span>
              <Input type="number" min={0} max={100} value={form.per_chat_ai_limit ?? 25} onChange={set('per_chat_ai_limit')} />
            </div>
          </div>
        </div>
        <div>
          <span className={label}>Greeting (first thing visitors read)</span>
          <Textarea rows={2} value={form.greeting || ''} onChange={set('greeting')} maxLength={300} placeholder="Ask about school programs, donating, events or anything on this site. I answer in seconds, and a real person is always one tap away." />
        </div>
        <div>
          <span className={label}>Teach the assistant (extra facts it can share)</span>
          <Textarea
            id="chat-knowledge"
            rows={6}
            value={form.extra_knowledge || ''}
            onChange={set('extra_knowledge')}
            maxLength={4000}
            placeholder={'Q: Do you need volunteers for A Night For Drayke?\nA: Yes. Email greggsdevelopment@gmail.com with your name and what you can help with.'}
            className="font-mono text-[13px]"
          />
          <p className="font-barlow text-xs text-ash mt-1 flex justify-between gap-3">
            <span>Public info only. The assistant repeats this to visitors, and anyone can read this setting.</span>
            <span className={knowledgeLeft < 200 ? 'text-red-600' : ''}>{knowledgeLeft} left</span>
          </p>
        </div>
        <p className="font-barlow text-xs text-ash">
          Each AI answer uses about 1 Base44 integration credit on the default model. When the daily limit is reached, the assistant keeps working with built-in answers until midnight.
        </p>
        <Button type="submit" disabled={saving} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
          {saving ? 'Saving...' : 'Save chat settings'}
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ transcript */

function Transcript({ chat, onBack }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState(chat.admin_notes || '');
  useEffect(() => setNotes(chat.admin_notes || ''), [chat.id, chat.admin_notes]);

  const update = async (patch, msg) => {
    try {
      await base44.entities.SupportChat.update(chat.id, patch);
      await qc.invalidateQueries({ queryKey: ADMIN_SOURCES.chats.key });
      if (msg) sonner.success(msg);
    } catch (err) {
      sonner.error('Could not save', { description: err?.message || 'Try again.' });
    }
  };

  const q = chat.handoff_note || firstQuestion(chat);
  const reply = chat.contact_email
    ? mailto(chat.contact_email, 'Your question to One Good Word...One Good Deed', `Hi ${String(chat.contact_name || '').split(' ')[0] || 'there'},\n\nThanks for reaching out on our website.\n\n> ${q}\n\n${SIGNATURE}`)
    : null;

  return (
    <div className="bg-white border border-ink/10 rounded-sm flex flex-col min-h-[480px] min-w-0">
      <div className="p-4 border-b border-ink/10 space-y-3">
        <div className="flex items-start gap-3">
          <button type="button" onClick={onBack} className="lg:hidden grid place-items-center w-8 h-8 rounded-sm border border-ink/10" aria-label="Back to list">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-barlow-condensed font-bold text-lg text-ink tracking-wide truncate">{who(chat)}</p>
            <p className="font-barlow text-xs text-ash">
              Started {timeAgo(chat.created_date)} on {chat.first_page || '/'} · {chat.message_count || 0} messages · {chat.ai_replies || 0} AI answers
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-barlow-condensed uppercase tracking-wider ${chat.status === 'needs_reply' ? 'bg-amber-100 text-amber-800' : chat.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ash'}`}>
            {chat.status === 'needs_reply' ? 'Needs reply' : chat.status === 'resolved' ? 'Resolved' : 'Open'}
          </span>
        </div>
        {chat.urgent && (
          <p className="flex items-start gap-2 rounded-sm bg-red-50 border border-red-200 px-3 py-2 font-barlow text-sm text-red-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> A message matched the safety check. The visitor was shown 911, 988 and the Crisis Text Line.
          </p>
        )}
        {(chat.contact_email || chat.contact_phone) && (
          <div className="flex flex-wrap gap-2">
            {reply && (
              <a href={reply} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm bg-ink text-cream font-barlow-condensed uppercase tracking-wider text-xs hover:bg-ink/90">
                <Mail className="w-3.5 h-3.5" /> Reply to {chat.contact_email}
              </a>
            )}
            {chat.contact_phone && (
              <a href={`tel:${chat.contact_phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-ink/15 font-barlow-condensed uppercase tracking-wider text-xs hover:border-ink/40">
                <Phone className="w-3.5 h-3.5" /> {chat.contact_phone}
              </a>
            )}
          </div>
        )}
        {chat.handoff_note && <p className="font-barlow text-sm text-ink bg-amber-50 border border-amber-200 rounded-sm px-3 py-2"><span className="font-semibold">They need: </span>{chat.handoff_note}</p>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream/40 max-h-[560px]">
        {(chat.messages || []).map((m) => (
          <div key={m.id || m.at} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 font-barlow text-sm whitespace-pre-wrap break-words ${m.role === 'user' ? 'bg-ink text-cream' : 'bg-white border border-ink/10 text-ink'}`}>
              {m.content}
              <div className={`mt-1 flex flex-wrap items-center gap-1.5 text-[10px] ${m.role === 'user' ? 'text-cream/50' : 'text-ash'}`}>
                {m.at && <span>{new Date(m.at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>}
                {m.role === 'assistant' && SOURCE[m.source] && <span className={`rounded-full px-1.5 ${SOURCE[m.source].cls}`}>{SOURCE[m.source].text}</span>}
                {m.role === 'user' && m.source === 'quick' && <span>tapped a button</span>}
                {m.rating === 'up' && <ThumbsUp className="w-3 h-3 text-green-600" />}
                {m.rating === 'down' && <ThumbsDown className="w-3 h-3 text-red-600" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-ink/10 space-y-3">
        <div>
          <span className={label}>Private notes</span>
          <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== (chat.admin_notes || '') && update({ admin_notes: notes }, 'Notes saved')} placeholder="Only admins see this." />
        </div>
        <div className="flex flex-wrap gap-2">
          {chat.status !== 'resolved' ? (
            <Button size="sm" onClick={() => update({ status: 'resolved' }, 'Marked resolved')} className="bg-green-700 hover:bg-green-800 text-white font-barlow-condensed uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Mark resolved
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => update({ status: chat.handoff_at ? 'needs_reply' : 'open' }, 'Reopened')} className="font-barlow-condensed uppercase tracking-wider">
              <RotateCcw className="w-4 h-4 mr-1" /> Reopen
            </Button>
          )}
          {chat.urgent && (
            <Button size="sm" variant="outline" onClick={() => update({ urgent: false, urgent_alert_sent_at: null }, 'Safety flag cleared')} className="font-barlow-condensed uppercase tracking-wider">
              Clear safety flag
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ tab */

const FILTERS = [
  { key: 'needs', text: 'Needs reply', test: (c) => c.status === 'needs_reply' },
  { key: 'urgent', text: 'Safety flag', test: (c) => c.urgent && c.status !== 'resolved' },
  { key: 'all', text: 'All chats', test: () => true },
  { key: 'resolved', text: 'Resolved', test: (c) => c.status === 'resolved' },
];

export default function ChatsTab({ initialChat = '' }) {
  const { data } = useAdminData();
  const chats = data.chats;
  const [filter, setFilter] = useState(() => (initialChat ? 'all' : chats.some((c) => c.status === 'needs_reply') ? 'needs' : 'all'));
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(initialChat || null);
  const [showSettings, setShowSettings] = useState(false);
  const [teach, setTeach] = useState(null);

  const { data: settings = {} } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => (await base44.entities.ChatSettings.list('-updated_date', 1))?.[0] || {},
  });
  const { data: usage = [] } = useQuery({
    queryKey: USAGE_KEY,
    queryFn: async () => {
      try {
        return (await base44.entities.ChatUsage.list('-day', 60)) || [];
      } catch {
        return [];
      }
    },
    refetchInterval: 60_000,
  });

  const today = detroitDay();
  const todayUsage = usage.find((u) => u.day === today) || {};
  const limit = Number(settings.daily_ai_limit ?? 300) || 0;
  const aiToday = Number(todayUsage.ai_calls) || 0;
  const monthAi = usage.slice(0, 30).reduce((s, u) => s + (Number(u.ai_calls) || 0), 0);
  const up = chats.reduce((s, c) => s + (Number(c.rating_up) || 0), 0);
  const down = chats.reduce((s, c) => s + (Number(c.rating_down) || 0), 0);

  const insights = useMemo(() => {
    const counts = new Map();
    const unanswered = [];
    for (const c of chats) {
      const msgs = c.messages || [];
      msgs.forEach((m, i) => {
        if (m.role !== 'user' || m.source === 'quick' || INTENT_TEXTS.has(lower(m.content))) return;
        // Safety messages stay in their own chat, never in a popularity list.
        if (msgs[i + 1]?.source === 'crisis') return;
        const k = lower(m.content).replace(/[?.!]+$/, '');
        if (k.length < 4) return;
        counts.set(k, { text: m.content, n: (counts.get(k)?.n || 0) + 1 });
        const next = msgs[i + 1];
        if (next && next.role === 'assistant' && (next.source === 'fallback' || next.rating === 'down')) unanswered.push({ q: m.content, why: next.rating === 'down' ? 'Thumbs down' : 'No answer', chat: c.id, at: m.at });
      });
    }
    return {
      top: [...counts.values()].sort((a, b) => b.n - a.n).slice(0, 8),
      unanswered: unanswered.sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 8),
    };
  }, [chats]);

  const f = FILTERS.find((x) => x.key === filter) || FILTERS[2];
  const shown = chats
    .filter(f.test)
    .filter((c) => {
      if (!query.trim()) return true;
      const hay = lower([c.contact_name, c.contact_email, c.contact_phone, c.handoff_note, c.first_page, ...(c.messages || []).map((m) => m.content)].join(' '));
      return lower(query).split(/\s+/).every((w) => hay.includes(w));
    })
    .sort((a, b) => String(b.last_message_at || b.created_date).localeCompare(String(a.last_message_at || a.created_date)));
  const current = chats.find((c) => c.id === selected);

  const exportCsv = () =>
    downloadCsv(`chats-${today}.csv`, [
      { label: 'Started', value: 'created_date' },
      { label: 'Status', value: 'status' },
      { label: 'Name', value: 'contact_name' },
      { label: 'Email', value: 'contact_email' },
      { label: 'Phone', value: 'contact_phone' },
      { label: 'Needs', value: 'handoff_note' },
      { label: 'First question', value: firstQuestion },
      { label: 'Messages', value: 'message_count' },
      { label: 'AI answers', value: 'ai_replies' },
      { label: 'Thumbs up', value: 'rating_up' },
      { label: 'Thumbs down', value: 'rating_down' },
      { label: 'Safety flag', value: (c) => (c.urgent ? 'yes' : '') },
      { label: 'First page', value: 'first_page' },
    ], shown);

  const Stat = ({ icon: Icon, n, text, sub, tone = 'text-ink' }) => (
    <div className="bg-white border border-ink/10 rounded-sm p-4 min-w-0">
      <div className="flex items-center gap-2 text-ash">
        <Icon className="w-4 h-4" />
        <span className="font-barlow-condensed uppercase tracking-wider text-xs">{text}</span>
      </div>
      <p className={`font-anton text-3xl mt-1 ${tone}`}>{n}</p>
      {sub && <p className="font-barlow text-xs text-ash mt-0.5">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-anton text-2xl text-ink tracking-wide">WEBSITE CHAT</h2>
          <p className="font-barlow text-sm text-ash">
            Every conversation with the assistant on ogwogd.org. Chat is{' '}
            <span className={settings.enabled === false ? 'text-red-600 font-semibold' : 'text-green-700 font-semibold'}>{settings.enabled === false ? 'off' : 'on'}</span>
            {settings.enabled !== false && <> with AI answers <span className="font-semibold">{settings.ai_enabled === false ? 'off' : 'on'}</span></>}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv} className="font-barlow-condensed uppercase tracking-wider">
            <Download className="w-4 h-4 mr-1" /> CSV
          </Button>
          <Button size="sm" onClick={() => setShowSettings((s) => !s)} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
            <Settings2 className="w-4 h-4 mr-1" /> {showSettings ? 'Hide settings' : 'Settings'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={MessageCircle} n={Number(todayUsage.chats) || 0} text="Chats today" sub={`${chats.length} on record`} />
        <Stat icon={UserRound} n={chats.filter((c) => c.status === 'needs_reply').length} text="Waiting on you" sub="Asked for a person" tone={chats.some((c) => c.status === 'needs_reply') ? 'text-amber-600' : 'text-ink'} />
        <div className="bg-white border border-ink/10 rounded-sm p-4 min-w-0">
          <div className="flex items-center gap-2 text-ash">
            <Zap className="w-4 h-4" />
            <span className="font-barlow-condensed uppercase tracking-wider text-xs">AI answers today</span>
          </div>
          <p className="font-anton text-3xl mt-1 text-ink">
            {aiToday}
            <span className="text-base text-ash"> / {limit}</span>
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-ink/5 overflow-hidden">
            <div className="h-full rounded-full bg-gold" style={{ width: `${limit ? Math.min(100, (aiToday / limit) * 100) : 100}%` }} />
          </div>
          <p className="font-barlow text-xs text-ash mt-1">{monthAi} in the last 30 days</p>
        </div>
        <Stat icon={ThumbsUp} n={up + down ? `${Math.round((up / (up + down)) * 100)}%` : '--'} text="Helpful" sub={`${up} up · ${down} down`} tone={up + down && up / (up + down) < 0.7 ? 'text-amber-600' : 'text-ink'} />
      </div>

      {showSettings && <SettingsPanel settings={settings} teach={teach} onTaught={() => setTeach(null)} />}

      {(insights.top.length > 0 || insights.unanswered.length > 0) && (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-white border border-ink/10 rounded-sm p-4">
            <p className="flex items-center gap-2 font-barlow-condensed font-bold uppercase tracking-wider text-sm text-ink"><Sparkles className="w-4 h-4 text-violet-600" /> What people ask most</p>
            <ol className="mt-2 space-y-1.5">
              {insights.top.map((t) => (
                <li key={t.text} className="flex items-start justify-between gap-3 font-barlow text-sm text-ink">
                  <span className="min-w-0 break-words">{t.text}</span>
                  <span className="shrink-0 rounded-full bg-ink/5 px-2 text-xs text-ash">{t.n}</span>
                </li>
              ))}
              {!insights.top.length && <li className="font-barlow text-sm text-ash">Nothing typed yet.</li>}
            </ol>
          </div>
          <div className="bg-white border border-ink/10 rounded-sm p-4">
            <p className="flex items-center gap-2 font-barlow-condensed font-bold uppercase tracking-wider text-sm text-ink"><Lightbulb className="w-4 h-4 text-amber-500" /> Questions it could not answer</p>
            <ul className="mt-2 space-y-2">
              {insights.unanswered.map((u, i) => (
                <li key={`${u.chat}-${i}`} className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => { setSelected(u.chat); setFilter('all'); }} className="min-w-0 text-left font-barlow text-sm text-ink hover:underline break-words">
                    {u.q} <span className="text-xs text-ash">({u.why})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowSettings(true); setTeach(u.q); }}
                    className="shrink-0 rounded-sm border border-ink/15 hover:border-ink/40 px-2 py-1 font-barlow-condensed uppercase tracking-wider text-[11px] text-ink"
                  >
                    Teach it
                  </button>
                </li>
              ))}
              {!insights.unanswered.length && <li className="font-barlow text-sm text-ash">None so far. Nice.</li>}
            </ul>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-4 items-start">
        <div className={`space-y-3 min-w-0 ${current ? 'hidden lg:block' : ''}`}>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((x) => {
              const n = chats.filter(x.test).length;
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => setFilter(x.key)}
                  className={`rounded-full px-3 py-1 font-barlow-condensed uppercase tracking-wider text-xs border transition-colors ${filter === x.key ? 'bg-ink text-cream border-ink' : 'bg-white text-ink border-ink/15 hover:border-ink/40'}`}
                >
                  {x.text} {n > 0 && <span className="opacity-60">{n}</span>}
                </button>
              );
            })}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-ash absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chats" className="pl-9 bg-white" />
          </div>
          <div className="space-y-2">
            {shown.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className={`w-full text-left bg-white border rounded-sm p-3 transition-colors ${selected === c.id ? 'border-ink' : 'border-ink/10 hover:border-ink/30'}`}
              >
                <div className="flex items-center gap-2">
                  {c.urgent && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
                  <span className="font-barlow-condensed font-bold text-ink tracking-wide truncate">{who(c)}</span>
                  <span className="ml-auto shrink-0 font-barlow text-[11px] text-ash">{timeAgo(c.last_message_at || c.created_date)}</span>
                </div>
                <p className="font-barlow text-sm text-ink/80 line-clamp-2 mt-0.5 break-words">{c.handoff_note || firstQuestion(c) || '(no messages)'}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px] font-barlow-condensed uppercase tracking-wider">
                  {c.status === 'needs_reply' && <span className="rounded-full bg-amber-100 text-amber-800 px-1.5">Needs reply</span>}
                  {c.status === 'resolved' && <span className="rounded-full bg-green-100 text-green-700 px-1.5">Resolved</span>}
                  <span className="rounded-full bg-ink/5 text-ash px-1.5">{c.first_page || '/'}</span>
                  {Number(c.ai_replies) > 0 && <span className="rounded-full bg-violet-100 text-violet-700 px-1.5 inline-flex items-center gap-0.5"><Bot className="w-3 h-3" />{c.ai_replies}</span>}
                  {Number(c.rating_down) > 0 && <span className="rounded-full bg-red-50 text-red-700 px-1.5 inline-flex items-center gap-0.5"><ThumbsDown className="w-3 h-3" />{c.rating_down}</span>}
                </div>
              </button>
            ))}
            {!shown.length && (
              <p className="font-barlow text-sm text-ash bg-white border border-dashed border-ink/15 rounded-sm p-6 text-center">
                {chats.length ? 'Nothing here.' : 'No chats yet. They show up here the moment a visitor asks something.'}
              </p>
            )}
          </div>
        </div>

        {current ? (
          <Transcript key={current.id} chat={current} onBack={() => setSelected(null)} />
        ) : (
          <div className="hidden lg:grid place-items-center bg-white border border-dashed border-ink/15 rounded-sm min-h-[320px] font-barlow text-ash text-sm">
            Pick a chat to read it.
          </div>
        )}
      </div>
    </div>
  );
}
