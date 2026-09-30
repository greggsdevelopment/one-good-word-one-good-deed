import { useEffect, useMemo } from 'react';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Backpack, CalendarCheck, CalendarDays, ExternalLink, HandHeart, Handshake, LayoutDashboard, Mail, Package, User,
} from 'lucide-react';
import { isPrayer, useAdminData } from '@/lib/adminData';
import { buildPeople } from '@/components/admin/PeopleTab';

const CAP = 150;

// Every word typed must appear somewhere in the item. The default fuzzy match
// lets "papa" hit "Mia Park", which is useless for names and order numbers.
function wordFilter(value, search) {
  const hay = String(value || '').toLowerCase();
  const words = String(search || '').toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return 1;
  if (!words.every((w) => hay.includes(w))) return 0;
  // Rank "go to" items and exact starts a little higher.
  return hay.startsWith('go ') || words.some((w) => hay.includes(` ${w}`)) ? 1 : 0.8;
}

/**
 * Ctrl+K / Cmd+K from anywhere in admin. Finds people and records across the
 * whole site and jumps to the right tab. Also works as a quick menu.
 */
export default function CommandSearch({ open, setOpen, tabs, go }) {
  const { data } = useAdminData();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  const people = useMemo(() => (open ? buildPeople(data) : []), [open, data]);

  const pick = (tab) => {
    setOpen(false);
    go(tab);
  };
  const external = (url) => {
    setOpen(false);
    window.open(url, '_blank', 'noopener');
  };

  const groups = open
    ? [
        {
          heading: 'Orders',
          icon: Package,
          rows: data.orders.map((o) => ({ id: o.id, tab: 'orders', label: `${o.order_number || 'Order'} · ${o.customer_name || ''}`, hint: `$${Number(o.total || 0).toFixed(2)} · ${o.status || 'pending'}`, text: [o.order_number, o.customer_name, o.email, o.city, o.tracking_number].join(' ') })),
        },
        {
          heading: 'School bookings',
          icon: CalendarCheck,
          rows: data.bookings.map((b) => ({ id: b.id, tab: 'bookings', label: b.school_name || 'Booking', hint: `${b.contact_name || ''} · ${b.status || 'new'}`, text: [b.school_name, b.contact_name, b.email, b.district, b.reference].join(' ') })),
        },
        {
          heading: 'Sponsors',
          icon: Handshake,
          rows: data.sponsors.map((a) => ({ id: a.id, tab: 'sponsors', label: a.business_name || 'Sponsor', hint: `${a.contact_person || ''} · ${a.status || 'new'}`, text: [a.business_name, a.contact_person, a.email, a.city].join(' ') })),
        },
        {
          heading: 'Item donations',
          icon: Backpack,
          rows: data.itemDonations.map((d) => ({ id: d.id, tab: 'donations', label: d.donor_name || 'Donor', hint: `${d.delivery_method || ''} · ${d.status || 'new'}`, text: [d.donor_name, d.email, d.city, (d.items || []).map((i) => i.name || i.category).join(' ')].join(' ') })),
        },
        {
          heading: 'Messages',
          icon: Mail,
          rows: data.messages.map((m) => ({ id: m.id, tab: isPrayer(m) ? 'inbox:prayer' : 'inbox', label: `${m.name || 'Anonymous'} · ${isPrayer(m) ? 'Prayer request' : m.subject || 'Message'}`, hint: m.read ? '' : 'unread', text: [m.name, m.email, m.subject, m.message].join(' '), icon: isPrayer(m) ? HandHeart : Mail })),
        },
        {
          heading: 'Events',
          icon: CalendarDays,
          rows: data.events.map((e) => ({ id: e.id, tab: 'events', label: e.title || 'Event', hint: e.event_date || '', text: [e.title, e.location, e.event_date].join(' ') })),
        },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 max-w-xl">
      <DialogTitle className="sr-only">Search everything</DialogTitle>
      <Command filter={wordFilter} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-2.5">
      <CommandInput placeholder="Search people, orders, schools, sponsors, messages... or jump to a tab" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>No match.</CommandEmpty>

        <CommandGroup heading="Go to">
          {tabs.map((t) => {
            const Icon = t.icon || LayoutDashboard;
            return (
              <CommandItem key={t.value} value={`go ${t.label}`} onSelect={() => pick(t.value)}>
                <Icon className="mr-2 h-4 w-4" /> {t.label}
              </CommandItem>
            );
          })}
          <CommandItem value="open live site ogwogd.org" onSelect={() => external('/')}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open the live site
          </CommandItem>
          <CommandItem value="open donate page public" onSelect={() => external('/donate')}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open the public donate page
          </CommandItem>
        </CommandGroup>

        {open && people.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="People">
              {people.slice(0, CAP).map((p) => (
                <CommandItem key={p.email} value={`person ${p.name} ${p.email} ${p.phone}`} onSelect={() => pick('people')}>
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate">{p.name || p.email}</span>
                  <span className="ml-auto text-xs text-muted-foreground truncate pl-3">{p.email}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {groups.filter((g) => g.rows.length).map((g) => (
          <CommandGroup key={g.heading} heading={g.heading}>
            {g.rows.slice(0, CAP).map((r) => {
              const Icon = r.icon || g.icon;
              return (
                <CommandItem key={`${g.heading}-${r.id}`} value={`${g.heading} ${r.text} ${r.id}`} onSelect={() => pick(r.tab)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span className="truncate">{r.label}</span>
                  {r.hint && <span className="ml-auto text-xs text-muted-foreground truncate pl-3">{r.hint}</span>}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
      </Command>
      </DialogContent>
    </Dialog>
  );
}
