import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast as sonner } from 'sonner';
import { Mail, Trash2, CheckCheck, Reply, Search, HandHeart, MessageSquare, Lightbulb, Globe, Phone, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ADMIN_SOURCES, SIGNATURE, downloadCsv, isPrayer, lower, mailto, timeAgo, useAdminData } from '@/lib/adminData';

const VIEWS = [
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'prayer', label: 'Prayer Requests', icon: HandHeart },
  { key: 'suggestions', label: 'Resource Suggestions', icon: Lightbulb },
];

function replyLink(m) {
  if (isPrayer(m)) {
    return mailto(m.email, 'We are praying with you', [
      `Hi ${(m.name || '').split(' ')[0] || 'friend'},`,
      '',
      'Thank you for trusting us with this. We received your prayer request and we are lifting it up.',
      '',
      'If you ever need to talk or need help finding support, reply here or call (734) 383-3865. You are not alone in this.',
      SIGNATURE,
    ].join('\n'));
  }
  return mailto(m.email, `Re: ${m.subject || 'Your message to One Good Word...One Good Deed'}`, [
    `Hi ${(m.name || '').split(' ')[0] || 'there'},`,
    '',
    'Thanks for reaching out.',
    '',
    '',
    SIGNATURE,
    '',
    '---',
    `On ${m.created_date ? format(new Date(m.created_date), 'MMM d, yyyy') : ''} you wrote:`,
    ...(String(m.message || '').split('\n').map((l) => `> ${l}`)),
  ].join('\n'));
}

function MessageCard({ m, onSaved }) {
  const [busy, setBusy] = useState(false);
  const save = async (patch) => {
    setBusy(true);
    try {
      await base44.entities.ContactMessage.update(m.id, patch);
      onSaved();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!window.confirm('Delete this message?')) return;
    await base44.entities.ContactMessage.delete(m.id);
    onSaved();
  };
  const prayer = isPrayer(m);
  return (
    <div className={`rounded-sm border p-5 ${m.read ? 'bg-white/70 border-ink/5' : 'bg-white border-gold/20 border-l-4 border-l-gold'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-barlow font-semibold text-ink">{m.name || 'Anonymous'}</p>
            {!prayer && m.subject && <span className="font-barlow text-ink/60 text-sm">· {m.subject}</span>}
            {m.replied && <span className="text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-800">replied</span>}
          </div>
          {m.email && <a href={`mailto:${m.email}`} className="font-barlow text-sm text-gold-dark hover:underline">{m.email}</a>}
        </div>
        <p className="font-barlow text-ash text-xs">{m.created_date ? format(new Date(m.created_date), 'MMM d, h:mm a') : ''} · {timeAgo(m.created_date)}</p>
      </div>
      <p className="font-barlow text-ink/80 text-sm leading-relaxed mt-3 whitespace-pre-line">{m.message}</p>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {m.email && (
          <a href={replyLink(m)} onClick={() => save({ replied: true, read: true })}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink text-cream font-barlow-condensed uppercase tracking-wider text-xs hover:bg-ink/90">
            <Reply className="w-3.5 h-3.5" /> {prayer ? 'Reply with care' : 'Reply'}
          </a>
        )}
        {!m.read && (
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => save({ read: true })} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5 h-8">
            <CheckCheck className="w-3.5 h-3.5" /> Mark read
          </Button>
        )}
        {m.read && !m.replied && (
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => save({ read: false })} className="font-barlow-condensed uppercase tracking-wider text-xs h-8">Mark unread</Button>
        )}
        <Button size="icon" variant="ghost" onClick={remove} className="text-ash hover:text-red-500 ml-auto h-8 w-8" aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

function SuggestionCard({ s, onSaved }) {
  const status = s.status || 'new';
  const save = async (patch, msg) => {
    try {
      await base44.entities.ResourceSuggestion.update(s.id, patch);
      if (msg) sonner.success(msg);
      onSaved();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    }
  };
  return (
    <div className={`rounded-sm border p-5 ${status === 'new' ? 'bg-white border-gold/20 border-l-4 border-l-gold' : 'bg-white/70 border-ink/5'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-barlow font-semibold text-ink">{s.name}</p>
          {s.category && <p className="font-barlow text-sm text-ink/60">{s.category}</p>}
        </div>
        <div className="text-right">
          <span className={`text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full ${status === 'added' ? 'bg-green-100 text-green-800' : status === 'dismissed' ? 'bg-ink/10 text-ash' : 'bg-amber-100 text-amber-800'}`}>{status}</span>
          <p className="font-barlow text-ash text-xs mt-1">{timeAgo(s.created_date)}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm font-barlow mt-2">
        {s.phone && <a href={`tel:${s.phone}`} className="flex items-center gap-1 text-gold-dark hover:underline"><Phone className="w-3.5 h-3.5" /> {s.phone}</a>}
        {s.website && <a href={/^https?:/.test(s.website) ? s.website : `https://${s.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold-dark hover:underline"><Globe className="w-3.5 h-3.5" /> {s.website}</a>}
      </div>
      {s.notes && <p className="font-barlow text-sm text-ink/70 mt-2">{s.notes}</p>}
      <div className="flex gap-2 mt-4">
        {status !== 'added' && <Button size="sm" onClick={() => save({ status: 'added' }, 'Marked added')} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider text-xs h-8">Added to Resources</Button>}
        {status !== 'dismissed' && <Button size="sm" variant="outline" onClick={() => save({ status: 'dismissed' }, 'Dismissed')} className="font-barlow-condensed uppercase tracking-wider text-xs h-8">Dismiss</Button>}
        {status !== 'new' && <Button size="sm" variant="ghost" onClick={() => save({ status: 'new' })} className="font-barlow-condensed uppercase tracking-wider text-xs h-8">Reopen</Button>}
      </div>
    </div>
  );
}

export default function InboxTab({ initialView = 'messages' }) {
  const qc = useQueryClient();
  const { data, loading } = useAdminData();
  const [view, setView] = useState(initialView);
  const [search, setSearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const refreshMessages = () => qc.invalidateQueries({ queryKey: ADMIN_SOURCES.messages.key });
  const refreshSuggestions = () => qc.invalidateQueries({ queryKey: ADMIN_SOURCES.suggestions.key });

  const messages = data.messages.filter((m) => !isPrayer(m));
  const prayers = data.messages.filter(isPrayer);
  const suggestions = data.suggestions;

  const unreadCount = {
    messages: messages.filter((m) => !m.read).length,
    prayer: prayers.filter((m) => !m.read).length,
    suggestions: suggestions.filter((s) => (s.status || 'new') === 'new').length,
  };

  const list = useMemo(() => {
    const q = lower(search);
    const src = view === 'messages' ? messages : view === 'prayer' ? prayers : suggestions;
    return src
      .filter((r) => !unreadOnly || (view === 'suggestions' ? (r.status || 'new') === 'new' : !r.read))
      .filter((r) => !q || [r.name, r.email, r.subject, r.message, r.notes, r.category].some((v) => lower(v).includes(q)));
  }, [view, search, unreadOnly, data.messages, data.suggestions]);

  const markAllRead = async () => {
    const targets = (view === 'messages' ? messages : prayers).filter((m) => !m.read);
    await Promise.all(targets.map((m) => base44.entities.ContactMessage.update(m.id, { read: true })));
    sonner.success(`Marked ${targets.length} read`);
    refreshMessages();
  };

  if (loading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {VIEWS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setView(key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-sm font-barlow-condensed text-xs uppercase tracking-wider ${view === key ? 'bg-ink text-cream' : 'bg-white border border-ink/10 text-ink/60 hover:text-ink'}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
            {unreadCount[key] > 0 && <span className="ml-1 bg-gold text-ink rounded-full text-[10px] px-1.5">{unreadCount[key]}</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, text" className="pl-9 bg-white h-9" />
        </div>
        <label className="flex items-center gap-1.5 font-barlow text-sm text-ink/70">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} /> {view === 'suggestions' ? 'New only' : 'Unread only'}
        </label>
        {view !== 'suggestions' && unreadCount[view] > 0 && (
          <Button size="sm" variant="outline" onClick={markAllRead} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5 h-9">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </Button>
        )}
        <Button size="sm" variant="outline" disabled={!list.length} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5 h-9"
          onClick={() => downloadCsv(`ogwogd-${view}-${format(new Date(), 'yyyy-MM-dd')}.csv`,
            view === 'suggestions'
              ? [{ label: 'Date', value: 'created_date' }, { label: 'Resource', value: 'name' }, { label: 'Category', value: 'category' }, { label: 'Phone', value: 'phone' }, { label: 'Website', value: 'website' }, { label: 'Notes', value: 'notes' }, { label: 'Status', value: 'status' }]
              : [{ label: 'Date', value: 'created_date' }, { label: 'Name', value: 'name' }, { label: 'Email', value: 'email' }, { label: 'Subject', value: 'subject' }, { label: 'Message', value: 'message' }, { label: 'Read', value: (r) => (r.read ? 'yes' : '') }, { label: 'Replied', value: (r) => (r.replied ? 'yes' : '') }],
            list)}>
          <Download className="w-3.5 h-3.5" /> CSV
        </Button>
      </div>

      {view === 'prayer' && (
        <p className="font-barlow text-xs text-ash">Prayer requests are private. They never show on the public site.</p>
      )}

      {list.length === 0 ? (
        <p className="font-barlow text-ash text-center py-12"><Mail className="w-5 h-5 inline mr-1" /> Nothing here.</p>
      ) : view === 'suggestions' ? (
        list.map((s) => <SuggestionCard key={s.id} s={s} onSaved={refreshSuggestions} />)
      ) : (
        list.map((m) => <MessageCard key={m.id} m={m} onSaved={refreshMessages} />)
      )}
    </div>
  );
}
