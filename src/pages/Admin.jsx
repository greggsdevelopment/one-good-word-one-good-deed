import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, CalendarCheck, Heart, BookOpen, ShoppingBag, Mail, ClipboardList, Users } from 'lucide-react';
import BookingTab from '@/components/admin/BookingTab';
import PledgesTab from '@/components/admin/PledgesTab';
import StoriesTab from '@/components/admin/StoriesTab';
import MarketplaceTab from '@/components/admin/MarketplaceTab';
import MessagesTab from '@/components/admin/MessagesTab';
import OrdersTab from '@/components/admin/OrdersTab';
import NewsletterTab from '@/components/admin/NewsletterTab';
import SummaryDashboard from '@/components/admin/SummaryDashboard';

export default function Admin() {
  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => base44.entities.BookingRequest.list('-created_date', 100),
  });
  const { data: pledges = [] } = useQuery({
    queryKey: ['pledges'],
    queryFn: () => base44.entities.Pledge.list('-created_date', 200),
  });
  const { data: stories = [] } = useQuery({
    queryKey: ['stories'],
    queryFn: () => base44.entities.Story.list('-created_date', 100),
  });
  const { data: messages = [] } = useQuery({
    queryKey: ['contactMessages'],
    queryFn: () => base44.entities.ContactMessage.list('-created_date', 100),
  });
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('sort_order', 200),
  });
  const { data: events = [] } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => base44.entities.Event.list('event_date', 200),
  });
  const { data: subscribers = [] } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: () => base44.entities.NewsletterSubscriber.list('-created_date', 500),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 500),
  });

  const pendingStories = stories.filter(s => !s.approved).length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-ink text-cream px-4 sm:px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-anton text-2xl sm:text-3xl tracking-wider">ADMIN DASHBOARD</h1>
          <p className="font-barlow text-cream/40 text-sm mt-0.5">One Good Word...One Good Deed</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="font-barlow-condensed text-cream/50 hover:text-gold text-sm tracking-wider uppercase transition-colors hidden sm:block">
            View Site
          </a>
          <Button variant="outline" size="sm" onClick={() => base44.auth.logout('/')} className="text-cream border-cream/20 hover:bg-cream/10 font-barlow-condensed uppercase tracking-wider text-xs">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
           {[
            { label: 'Bookings', value: bookings.length, icon: CalendarCheck, color: 'text-blue-600' },
            { label: 'Pledges', value: pledges.length, icon: Heart, color: 'text-pink-600' },
            { label: 'Stories', value: stories.length, extra: pendingStories > 0 ? `${pendingStories} pending` : null, icon: BookOpen, color: 'text-purple-600' },
            { label: 'Messages', value: messages.length, icon: Mail, color: 'text-green-600' },
            { label: 'Products', value: products.length, icon: ShoppingBag, color: 'text-gold-dark' },
          ].map(({ label, value, extra, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-sm p-4 border border-ink/5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className={`font-anton text-3xl text-ink`}>{value}</p>
                <Icon className={`w-5 h-5 ${color} opacity-60`} />
              </div>
              <p className="font-barlow text-ash text-xs">{label}</p>
              {extra && <p className="font-barlow text-amber-500 text-xs">{extra}</p>}
            </div>
          ))}
        </div>

        {/* Summary Dashboard Chart */}
        <SummaryDashboard bookings={bookings} pledges={pledges} messages={messages} events={events} orders={orders} />

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList className="bg-white border border-ink/5 mb-6 h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="bookings" className="font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-ink data-[state=active]:text-cream gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5" /> Bookings
              {bookings.length > 0 && <span className="ml-1 bg-blue-100 text-blue-700 rounded-full text-[10px] px-1.5">{bookings.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="pledges" className="font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-ink data-[state=active]:text-cream gap-1.5">
              <Heart className="w-3.5 h-3.5" /> Pledges
            </TabsTrigger>
            <TabsTrigger value="stories" className="font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-ink data-[state=active]:text-cream gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Stories
              {pendingStories > 0 && <span className="ml-1 bg-amber-100 text-amber-700 rounded-full text-[10px] px-1.5">{pendingStories}</span>}
            </TabsTrigger>
            <TabsTrigger value="messages" className="font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-ink data-[state=active]:text-cream gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Messages
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-ink data-[state=active]:text-cream gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Marketplace
            </TabsTrigger>
            <TabsTrigger value="orders" className="font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-ink data-[state=active]:text-cream gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" /> Orders
              {bookings.length > 0 && <span className="ml-1 bg-amber-100 text-amber-700 rounded-full text-[10px] px-1.5">{bookings.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-ink data-[state=active]:text-cream gap-1.5">
              <Users className="w-3.5 h-3.5" /> Newsletter
              {subscribers.length > 0 && <span className="ml-1 bg-green-100 text-green-700 rounded-full text-[10px] px-1.5">{subscribers.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings"><BookingTab /></TabsContent>
          <TabsContent value="pledges"><PledgesTab /></TabsContent>
          <TabsContent value="stories"><StoriesTab /></TabsContent>
          <TabsContent value="messages"><MessagesTab /></TabsContent>
          <TabsContent value="marketplace"><MarketplaceTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="newsletter"><NewsletterTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}