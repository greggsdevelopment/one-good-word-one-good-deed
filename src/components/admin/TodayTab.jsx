import { useMemo } from 'react';
import { format, addDays, isSameDay, parseISO, startOfDay } from 'date-fns';
import {
  AlertTriangle, ArrowRight, Backpack, MessageCircle, Flag, School, Receipt, CalendarCheck, CalendarDays, Handshake, HandHeart, Heart, Lightbulb,
  Mail, Package, BookOpen, Sparkles, CheckCircle2, Truck, DollarSign, Users,
} from 'lucide-react';
import { businessDaysSince, isPrayer, timeAgo, useAdminData } from '@/lib/adminData';
import { isLowStock } from '@/components/admin/donations/inventoryOps';
import { isUpcoming, rsvpTotals } from '@/lib/rsvpUtils';
import SummaryDashboard from '@/components/admin/SummaryDashboard';

const money = (n) => `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

/**
 * Every open item across the site, in one list, sorted by what hurts most if
 * it waits. `promise` is how many business days the site told the person to
 * expect a reply in; past that the item is flagged overdue.
 */
function buildQueue(d) {
  const q = [];
  const push = (item) => q.push({ ...item, overdue: item.promise != null && businessDaysSince(item.when) >= item.promise });

  (d.reports || []).filter((x) => (x.status || 'new') === 'new').forEach((x) => push({
    id: `rep-${x.id}`, tab: 'pledges', icon: Flag, kind: 'Report',
    title: 'A visitor reported a pledge (it is hidden)', sub: String(x.target_preview || '').slice(0, 90), when: x.created_date, promise: 1, action: 'Review',
  }));
  (d.portalMessages || []).filter((x) => x.author === 'school' && !x.read_by_ogwogd).forEach((x) => push({
    id: `pm-${x.id}`, tab: `schools:${x.school_id}`, icon: School, kind: 'School portal',
    title: `${x.author_name || 'A school'} sent a message`, sub: String(x.body || '').slice(0, 90), when: x.created_date, promise: 1, action: 'Reply',
  }));
  (d.schoolMembers || []).filter((x) => x.status === 'requested').forEach((x) => push({
    id: `sm-${x.id}`, tab: `schools:${x.school_id}`, icon: School, kind: 'Portal access',
    title: `A school asked to add ${x.name || x.email}`, sub: x.email, when: x.created_date, promise: 1, action: 'Approve',
  }));
  (d.invoices || []).filter((x) => x.status === 'sent' && x.due_date && String(x.due_date) < new Date().toISOString().slice(0, 10)).forEach((x) => {
    const paid = (d.payments || []).filter((p) => p.invoice_id === x.id).reduce((t, p) => t + (Number(p.amount) || 0), 0);
    if (paid >= (Number(x.total) || 0) - 0.004) return;
    push({
      id: `iv-${x.id}`, tab: `schools:${x.school_id}`, icon: Receipt, kind: 'Past due',
      title: `Invoice ${x.number} is past due`, sub: `${money((Number(x.total) || 0) - paid)} still owed`, when: x.due_date, promise: 0, action: 'Follow up',
    });
  });
  (d.chats || []).filter((x) => x.urgent && x.status !== 'resolved').forEach((x) => push({
    id: `chu-${x.id}`, tab: `chats:${x.id}`, icon: AlertTriangle, kind: 'Chat safety flag',
    title: `A chat visitor wrote something that matched the safety check`, sub: 'They were shown 911, 988 and 741741. Review it.',
    when: x.last_message_at || x.created_date, promise: 0, action: 'Review',
  }));
  (d.chats || []).filter((x) => x.status === 'needs_reply' && !x.urgent).forEach((x) => push({
    id: `ch-${x.id}`, tab: `chats:${x.id}`, icon: MessageCircle, kind: 'Chat',
    title: `${x.contact_name || 'A visitor'} asked for a person in the chat`, sub: String(x.handoff_note || '').slice(0, 90) || x.contact_email || '',
    when: x.handoff_at || x.created_date, promise: 2, action: 'Reply',
  }));
  d.itemDonations.filter((x) => !x.status || x.status === 'new').forEach((x) => push({
    id: `don-${x.id}`, tab: 'donations', icon: Backpack, kind: 'Item donation',
    title: `${x.donor_name} wants to donate ${(x.items || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0)} items`,
    sub: `${x.delivery_method === 'pickup' ? `Pickup, ${x.distance_miles ?? '?'} mi` : 'Drop-off'}${(x.items || []).some((i) => i.need_id === 'other') ? ' · has off-list items' : ''}`,
    when: x.created_date, promise: 2, action: 'Accept or decline',
  }));
  d.sponsors.filter((x) => !x.status || x.status === 'new').forEach((x) => push({
    id: `sp-${x.id}`, tab: 'sponsors', icon: Handshake, kind: 'Sponsor',
    title: `${x.business_name} applied to sponsor`, sub: [x.contact_person, x.sponsorship_level].filter(Boolean).join(' · '),
    when: x.created_date, promise: 2, action: 'Follow up',
  }));
  d.bookings.filter((x) => !x.status || x.status === 'new' || x.status === 'pending').forEach((x) => push({
    id: `bk-${x.id}`, tab: 'bookings', icon: CalendarCheck, kind: 'School booking',
    title: `${x.school_name || 'A school'} requested a program`, sub: [x.contact_name, x.quoted_total ? money(x.quoted_total) : null].filter(Boolean).join(' · '),
    when: x.created_date, promise: 1, action: 'Send quote', value: Number(x.quoted_total) || 0,
  }));
  d.orders.filter((x) => !x.status || x.status === 'pending' || x.status === 'processing').forEach((x) => push({
    id: `or-${x.id}`, tab: 'orders', icon: Package, kind: 'Shop order',
    title: `Ship order ${x.order_number || ''} to ${x.customer_name || 'customer'}`, sub: `${money(x.total)} · ${[x.city, x.state].filter(Boolean).join(', ')}`,
    when: x.created_date, promise: 3, action: 'Ship it',
  }));
  d.messages.filter((x) => !x.read).forEach((x) => push({
    id: `ms-${x.id}`, tab: isPrayer(x) ? 'inbox:prayer' : 'inbox', icon: isPrayer(x) ? HandHeart : Mail,
    kind: isPrayer(x) ? 'Prayer request' : 'Message',
    title: isPrayer(x) ? `Prayer request from ${x.name || 'someone'}` : `${x.name || 'Someone'}: ${x.subject || 'new message'}`,
    sub: String(x.message || '').slice(0, 90), when: x.created_date, promise: 2, action: 'Reply',
  }));
  d.suggestions.filter((x) => (x.status || 'new') === 'new').forEach((x) => push({
    id: `rs-${x.id}`, tab: 'inbox:suggestions', icon: Lightbulb, kind: 'Resource',
    title: `Resource suggested: ${x.name}`, sub: x.category || '', when: x.created_date, action: 'Review',
  }));
  d.pledges.filter((x) => !x.approved).forEach((x) => push({
    id: `pl-${x.id}`, tab: 'pledges', icon: Heart, kind: 'Pledge',
    title: `${x.first_name || 'Someone'} ${x.last_initial || ''} took the pledge`, sub: 'Approve it for the Pledge Wall', when: x.created_date, action: 'Approve',
  }));
  d.stories.filter((x) => !x.approved).forEach((x) => push({
    id: `st-${x.id}`, tab: 'stories', icon: BookOpen, kind: 'Story',
    title: `${x.name || 'Someone'} shared a story`, sub: [x.location, String(x.story || '').slice(0, 70)].filter(Boolean).join(' · '), when: x.created_date, action: 'Review',
  }));

  const weight = (i) => (i.overdue ? 0 : i.promise != null ? 1 : 2);
  return q.sort((a, b) => weight(a) - weight(b) || String(a.when).localeCompare(String(b.when)));
}

function Kpi({ icon: Icon, label, value, sub, tone = 'text-gold', onClick }) {
  return (
    <button onClick={onClick} className="text-left bg-ink border border-cream/10 hover:border-gold/40 rounded-sm p-4 flex flex-col gap-1 transition-colors">
      <div className="flex items-center justify-between">
        <p className="font-barlow-condensed text-cream/40 text-[11px] tracking-widest uppercase">{label}</p>
        <Icon className={`w-4 h-4 ${tone}`} />
      </div>
      <p className="font-anton text-gold text-3xl leading-none">{value}</p>
      {sub && <p className="font-barlow text-cream/40 text-xs">{sub}</p>}
    </button>
  );
}

export default function TodayTab({ go, lastSeen, firstName }) {
  const { data, loading } = useAdminData();
  const queue = useMemo(() => buildQueue(data), [data]);

  const agenda = useMemo(() => {
    const today = startOfDay(new Date());
    const horizon = addDays(today, 14);
    const items = [];
    data.events.filter(isUpcoming).forEach((e) => {
      const day = parseISO(e.event_date);
      if (day > horizon) return;
      const t = rsvpTotals(data.rsvps.filter((r) => r.event_id === e.id));
      items.push({ id: `ev-${e.id}`, day, icon: CalendarDays, title: e.title, sub: `${e.start_time || ''}${e.location ? ` · ${e.location}` : ''}${t.count ? ` · ${t.headcount} expected (${t.count} RSVPs)` : ''}`, tab: 'events' });
    });
    data.itemDonations.filter((x) => x.status === 'scheduled' && x.scheduled_for).forEach((x) => {
      const day = new Date(x.scheduled_for);
      if (day < today || day > horizon) return;
      items.push({ id: `pu-${x.id}`, day, icon: Truck, title: `${x.delivery_method === 'pickup' ? 'Pickup' : 'Drop-off'}: ${x.donor_name}`, sub: `${format(day, 'h:mm a')}${x.city ? ` · ${x.city}` : ''}`, tab: 'donations' });
    });
    data.bookings.filter((b) => b.status === 'scheduled' && b.preferred_date).forEach((b) => {
      const day = parseISO(b.preferred_date);
      if (day < today || day > horizon) return;
      items.push({ id: `bk-${b.id}`, day, icon: CalendarCheck, title: `Program at ${b.school_name}`, sub: b.contact_name || '', tab: 'bookings' });
    });
    return items.sort((a, b) => a.day - b.day);
  }, [data]);

  if (loading) {
    return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  }

  const overdue = queue.filter((i) => i.overdue).length;
  const isNew = (i) => Boolean(lastSeen && i.when && new Date(i.when).getTime() > lastSeen);
  const newCount = queue.filter(isNew).length;

  const now = new Date();
  const thisMonth = (x) => x.created_date && new Date(x.created_date).getMonth() === now.getMonth() && new Date(x.created_date).getFullYear() === now.getFullYear();
  const pipeline = data.bookings.filter((b) => !['paid', 'cancelled'].includes(b.status)).reduce((s, b) => s + (Number(b.quoted_total) || 0), 0);
  const monthRevenue = data.orders.filter(thisMonth).reduce((s, o) => s + (Number(o.total) || 0), 0);
  const sponsorCommitted = data.sponsors.filter((a) => a.status === 'active').reduce((s, a) => s + (Number(a.amount_committed) || 0), 0);
  const lowStock = data.inventory.filter((i) => i.active !== false && isLowStock(i)).length;
  const subscribers = new Set(data.subscribers.map((s) => String(s.email || '').toLowerCase())).size;

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-anton text-ink text-3xl tracking-wide">{greeting.toUpperCase()}{firstName ? `, ${firstName.toUpperCase()}` : ''}.</h2>
          <p className="font-barlow text-ink/60">
            {queue.length === 0
              ? 'Nothing is waiting on you. Go spread the word.'
              : `${queue.length} thing${queue.length === 1 ? '' : 's'} waiting on you${overdue ? `, ${overdue} overdue` : ''}${newCount ? `, ${newCount} new since your last visit` : ''}.`}
          </p>
        </div>
        <p className="font-barlow text-xs text-ash">{format(now, 'EEEE, MMMM d')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi icon={CalendarCheck} label="Booking pipeline" value={money(pipeline)} sub="open quotes" onClick={() => go('bookings')} />
        <Kpi icon={DollarSign} label="Shop this month" value={money(monthRevenue)} sub={`${data.orders.filter(thisMonth).length} orders`} tone="text-green-400" onClick={() => go('orders')} />
        <Kpi icon={Handshake} label="Sponsor money" value={money(sponsorCommitted)} sub={`${data.sponsors.filter((a) => a.status === 'active').length} active`} tone="text-green-400" onClick={() => go('sponsors')} />
        <Kpi icon={Backpack} label="Items on hand" value={data.inventory.reduce((s, i) => s + (Number(i.quantity_on_hand) || 0), 0).toLocaleString()} sub={lowStock ? `${lowStock} low stock` : 'stock ok'} tone={lowStock ? 'text-red-400' : 'text-gold'} onClick={() => go('donations')} />
        <Kpi icon={Heart} label="Pledges" value={data.pledges.length.toLocaleString()} sub={`${data.pledges.filter(thisMonth).length} this month`} tone="text-pink-400" onClick={() => go('pledges')} />
        <Kpi icon={Users} label="Newsletter" value={subscribers.toLocaleString()} sub="subscribers" tone="text-blue-400" onClick={() => go('newsletter')} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Action queue */}
        <section className="lg:col-span-2 space-y-2 min-w-0">
          <p className="font-barlow-condensed text-xs uppercase tracking-widest text-ash">Needs you</p>
          {queue.length === 0 ? (
            <div className="bg-white border border-ink/10 rounded-sm p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-barlow text-ink/70">All caught up.</p>
            </div>
          ) : (
            queue.slice(0, 60).map((i) => {
              const Icon = i.icon;
              return (
                <button key={i.id} onClick={() => go(i.tab)}
                  className={`w-full text-left bg-white border rounded-sm px-4 py-3 flex items-center gap-3 hover:border-gold/50 transition-colors ${i.overdue ? 'border-red-200 border-l-4 border-l-red-500' : 'border-ink/10'}`}>
                  <Icon className={`w-5 h-5 shrink-0 ${i.overdue ? 'text-red-500' : 'text-gold-dark'}`} />
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-barlow font-semibold text-ink truncate">{i.title}</span>
                      {i.overdue && <span className="inline-flex items-center gap-1 text-[10px] font-barlow-condensed uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-100 text-red-700"><AlertTriangle className="w-3 h-3" /> overdue</span>}
                      {isNew(i) && <span className="inline-flex items-center gap-1 text-[10px] font-barlow-condensed uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gold/20 text-gold-dark"><Sparkles className="w-3 h-3" /> new</span>}
                    </span>
                    <span className="block font-barlow text-xs text-ash truncate">{i.kind} · {timeAgo(i.when)}{i.sub ? ` · ${i.sub}` : ''}</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 font-barlow-condensed text-xs uppercase tracking-wider text-gold-dark shrink-0">{i.action} <ArrowRight className="w-3.5 h-3.5" /></span>
                </button>
              );
            })
          )}
          {queue.length > 60 && <p className="font-barlow text-xs text-ash">Showing the 60 most urgent of {queue.length}.</p>}
        </section>

        {/* Next 14 days */}
        <section className="space-y-2 min-w-0">
          <p className="font-barlow-condensed text-xs uppercase tracking-widest text-ash">Next 14 days</p>
          {agenda.length === 0 ? (
            <div className="bg-white border border-ink/10 rounded-sm p-6 text-center font-barlow text-sm text-ash">Nothing scheduled.</div>
          ) : (
            <div className="bg-white border border-ink/10 rounded-sm divide-y divide-ink/5">
              {agenda.map((a) => {
                const Icon = a.icon;
                const today = isSameDay(a.day, now);
                return (
                  <button key={a.id} onClick={() => go(a.tab)} className="w-full text-left px-4 py-3 flex gap-3 hover:bg-ink/[0.02]">
                    <div className={`w-12 shrink-0 text-center rounded-sm py-1 ${today ? 'bg-gold text-ink' : 'bg-ink/5 text-ink'}`}>
                      <p className="font-barlow-condensed text-[10px] uppercase tracking-wider">{today ? 'Today' : format(a.day, 'EEE')}</p>
                      <p className="font-anton text-lg leading-none">{format(a.day, 'd')}</p>
                    </div>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 font-barlow font-semibold text-ink text-sm"><Icon className="w-3.5 h-3.5 text-gold-dark shrink-0" /> <span className="truncate">{a.title}</span></span>
                      <span className="block font-barlow text-xs text-ash">{a.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <details className="group">
        <summary className="font-barlow-condensed text-xs uppercase tracking-widest text-ash cursor-pointer select-none">Activity chart and recent bookings</summary>
        <div className="mt-3">
          <SummaryDashboard bookings={data.bookings} pledges={data.pledges} messages={data.messages} events={data.events} orders={data.orders} rsvps={data.rsvps} />
        </div>
      </details>
    </div>
  );
}
