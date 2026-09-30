// Admin Dashboard
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  LogOut, CalendarCheck, Heart, BookOpen, ShoppingBag, Inbox, ClipboardList, Users, Ticket, Handshake,
  CalendarDays, Backpack, LayoutDashboard, Search, RefreshCw, Mail, MessageCircle, School, Landmark,
} from 'lucide-react';
import TodayTab from '@/components/admin/TodayTab';
import InboxTab from '@/components/admin/InboxTab';
import EventsTab from '@/components/admin/EventsTab';
import BookingTab from '@/components/admin/BookingTab';
import PledgesTab from '@/components/admin/PledgesTab';
import StoriesTab from '@/components/admin/StoriesTab';
import MarketplaceTab from '@/components/admin/MarketplaceTab';
import OrdersTab from '@/components/admin/OrdersTab';
import NewsletterTab from '@/components/admin/NewsletterTab';
import RaffleTab from '@/components/admin/RaffleTab';
import SponsorTab from '@/components/admin/SponsorTab';
import DonationsTab from '@/components/admin/DonationsTab';
import PeopleTab from '@/components/admin/PeopleTab';
import ChatsTab from '@/components/admin/ChatsTab';
import SchoolsTab from '@/components/admin/schools/SchoolsTab';
import BooksTab from '@/components/admin/books/BooksTab';
import CommandSearch from '@/components/admin/CommandSearch';
import { isPrayer, readLastSeen, useAdminData, useRefreshAdmin, writeLastSeen } from '@/lib/adminData';
import { isUpcoming } from '@/lib/rsvpUtils';

const trigger =
  'font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-ink data-[state=active]:text-cream gap-1.5 shrink-0';

function Badge({ n, tone = 'bg-amber-100 text-amber-700' }) {
  if (!n) return null;
  return <span className={`ml-1 rounded-full text-[10px] px-1.5 ${tone}`}>{n}</span>;
}

export default function Admin() {
  const { user } = useAuth();
  const { data, fetching, updatedAt } = useAdminData();
  const refreshAll = useRefreshAdmin();
  const [params, setParams] = useSearchParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastSeen] = useState(() => readLastSeen());
  const [, setTick] = useState(0);

  // Remember this visit so the next one can flag what is new since now.
  useEffect(() => {
    writeLastSeen();
    const t = setInterval(() => setTick((x) => x + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const raw = params.get('tab') || 'today';
  const [tab, sub] = raw.split(':');
  const go = (value) => {
    const next = new URLSearchParams(params);
    next.set('tab', value);
    setParams(next, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const counts = useMemo(() => {
    const open = (s) => !s || s === 'new';
    return {
      inbox: data.messages.filter((m) => !m.read).length + data.suggestions.filter((s) => (s.status || 'new') === 'new').length,
      prayer: data.messages.filter((m) => isPrayer(m) && !m.read).length,
      bookings: data.bookings.filter((b) => open(b.status) || b.status === 'pending').length,
      orders: data.orders.filter((o) => !o.status || o.status === 'pending' || o.status === 'processing').length,
      donations: data.itemDonations.filter((d) => open(d.status)).length,
      sponsors: data.sponsors.filter((a) => open(a.status)).length,
      events: data.events.filter(isUpcoming).length,
      pledges: data.pledges.filter((p) => !p.approved).length,
      stories: data.stories.filter((s) => !s.approved).length,
      schools: data.portalMessages.filter((m) => m.author === 'school' && !m.read_by_ogwogd).length + data.schoolMembers.filter((m) => m.status === 'requested').length,
      reports: data.reports.filter((r) => (r.status || 'new') === 'new').length,
      chats: data.chats.filter((c) => c.status === 'needs_reply' || (c.urgent && c.status !== 'resolved')).length,
    };
  }, [data]);
  const todayCount = counts.schools + counts.chats + counts.inbox + counts.bookings + counts.orders + counts.donations + counts.sponsors + counts.pledges + counts.stories;

  const tabs = [
    { value: 'today', label: 'Today', icon: LayoutDashboard, n: todayCount, tone: 'bg-gold text-ink' },
    { value: 'inbox', label: 'Inbox', icon: Inbox, n: counts.inbox },
    { value: 'chats', label: 'Chats', icon: MessageCircle, n: counts.chats, tone: 'bg-violet-100 text-violet-700' },
    { value: 'bookings', label: 'Bookings', icon: CalendarCheck, n: counts.bookings, tone: 'bg-blue-100 text-blue-700' },
    { value: 'schools', label: 'Schools', icon: School, n: counts.schools, tone: 'bg-violet-100 text-violet-700' },
    { value: 'books', label: 'Books', icon: Landmark },
    { value: 'orders', label: 'Orders', icon: ClipboardList, n: counts.orders },
    { value: 'donations', label: 'Donations', icon: Backpack, n: counts.donations },
    { value: 'sponsors', label: 'Sponsors', icon: Handshake, n: counts.sponsors },
    { value: 'events', label: 'Events', icon: CalendarDays, n: counts.events, tone: 'bg-teal-100 text-teal-700' },
    { value: 'people', label: 'People', icon: Users },
    { value: 'newsletter', label: 'Newsletter', icon: Mail },
    { value: 'pledges', label: 'Pledges', icon: Heart, n: counts.pledges + counts.reports, tone: counts.reports ? 'bg-red-100 text-red-700' : undefined },
    { value: 'stories', label: 'Stories', icon: BookOpen, n: counts.stories },
    { value: 'marketplace', label: 'Shop Products', icon: ShoppingBag },
    { value: 'raffle', label: 'Raffle', icon: Ticket },
  ];

  const secondsAgo = updatedAt ? Math.max(0, Math.round((Date.now() - updatedAt) / 1000)) : null;
  const firstName = String(user?.full_name || user?.name || '').split(' ')[0];

  return (
    <div className="min-h-screen bg-cream select-text">

      {/* Header */}
      <div className="bg-ink text-cream px-4 sm:px-8 py-4 flex items-center justify-between gap-3 sticky top-0 sticky-safe z-40">
        <div className="min-w-0">
          <h1 className="font-anton text-xl sm:text-2xl tracking-wider">ADMIN</h1>
          <p className="font-barlow text-cream/40 text-xs truncate">
            One Good Word...One Good Deed
            {secondsAgo != null && (
              <span className="hidden sm:inline"> · {fetching ? 'refreshing...' : `updated ${secondsAgo < 60 ? 'just now' : `${Math.round(secondsAgo / 60)}m ago`}`}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 h-9 px-3 rounded-sm border border-cream/15 hover:border-gold/50 text-cream/70 hover:text-cream font-barlow text-sm"
            aria-label="Search everything"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Search everything</span>
            <kbd className="hidden md:inline font-barlow-condensed text-[10px] border border-cream/20 rounded px-1.5 py-0.5 text-cream/50">Ctrl K</kbd>
          </button>
          <button onClick={refreshAll} className="h-9 w-9 flex items-center justify-center rounded-sm border border-cream/15 hover:border-gold/50" aria-label="Refresh">
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin text-gold' : 'text-cream/70'}`} />
          </button>
          <Link to="/" className="font-barlow-condensed text-cream/50 hover:text-gold text-sm tracking-wider uppercase transition-colors hidden sm:block">
            View Site
          </Link>
          <Button variant="outline" size="sm" onClick={() => base44.auth.logout('/')} className="text-cream bg-transparent border-cream/20 hover:bg-cream/10 font-barlow-condensed uppercase tracking-wider text-xs">
            <LogOut className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <Tabs value={tab} onValueChange={go}>
          <TabsList className="bg-white border border-ink/5 mb-6 h-auto w-full justify-start flex-nowrap sm:flex-wrap overflow-x-auto gap-1 p-1">
            {tabs.map(({ value, label, icon: Icon, n, tone }) => (
              <TabsTrigger key={value} value={value} className={trigger}>
                <Icon className="w-3.5 h-3.5" /> {label}
                <Badge n={n} tone={tone} />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="today"><TodayTab go={go} lastSeen={lastSeen} firstName={firstName} /></TabsContent>
          <TabsContent value="chats"><ChatsTab key={sub || 'list'} initialChat={sub || ''} /></TabsContent>
          <TabsContent value="inbox"><InboxTab key={sub || 'messages'} initialView={sub || 'messages'} /></TabsContent>
          <TabsContent value="bookings"><BookingTab /></TabsContent>
          <TabsContent value="schools"><SchoolsTab key={sub || 'list'} initialSchool={sub || ''} /></TabsContent>
          <TabsContent value="books"><BooksTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="donations"><DonationsTab /></TabsContent>
          <TabsContent value="sponsors"><SponsorTab /></TabsContent>
          <TabsContent value="events"><EventsTab /></TabsContent>
          <TabsContent value="people"><PeopleTab /></TabsContent>
          <TabsContent value="newsletter"><NewsletterTab /></TabsContent>
          <TabsContent value="pledges"><PledgesTab /></TabsContent>
          <TabsContent value="stories"><StoriesTab /></TabsContent>
          <TabsContent value="marketplace"><MarketplaceTab /></TabsContent>
          <TabsContent value="raffle"><RaffleTab /></TabsContent>
        </Tabs>
      </div>

      <CommandSearch open={searchOpen} setOpen={setSearchOpen} tabs={tabs} go={go} />
    </div>
  );
}
