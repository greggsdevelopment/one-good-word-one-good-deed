import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { subMonths, format, parseISO, isSameMonth } from 'date-fns';
import { DollarSign, CalendarCheck, Heart, Mail, CalendarDays, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div className="bg-ink border border-cream/10 rounded-sm p-5 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <p className="font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase">{label}</p>
      <Icon className={`w-4 h-4 ${accent || 'text-gold'}`} />
    </div>
    <p className="font-anton text-gold text-4xl leading-none">{value}</p>
    {sub && <p className="font-barlow text-cream/40 text-xs">{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink border border-gold/20 rounded-sm px-3 py-2">
      <p className="font-barlow-condensed text-cream/60 text-xs uppercase tracking-wider mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-barlow text-cream text-sm">
          {p.name}: <span className="text-gold font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function SummaryDashboard({ bookings = [], pledges = [], messages = [], events = [] }) {
  // Last 6 months booking counts
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i));
    return months.map((month) => ({
      name: format(month, 'MMM'),
      Bookings: bookings.filter((b) =>
        b.created_date && isSameMonth(parseISO(b.created_date), month)
      ).length,
      Pledges: pledges.filter((p) =>
        p.created_date && isSameMonth(parseISO(p.created_date), month)
      ).length,
    }));
  }, [bookings, pledges]);

  const upcomingEvents = events.filter(
    (e) => e.event_date && new Date(e.event_date) >= new Date()
  ).length;

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => !b.status || b.status === 'pending').length;

  // Recent bookings (last 5)
  const recentBookings = [...bookings].slice(0, 5);

  return (
    <div className="mb-8 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard icon={CalendarCheck} label="Total Bookings" value={bookings.length} sub={`${confirmedBookings} confirmed · ${pendingBookings} pending`} />
        <StatCard icon={Heart} label="Pledges" value={pledges.length} accent="text-pink-400" />
        <StatCard icon={Mail} label="Messages" value={messages.length} accent="text-blue-400" />
        <StatCard icon={CalendarDays} label="Upcoming Events" value={upcomingEvents} accent="text-teal-400" />
        <StatCard icon={TrendingUp} label="This Month" value={monthlyData[5]?.Bookings ?? 0} sub="new bookings" accent="text-purple-400" />
      </div>

      {/* Monthly bar chart */}
      <div className="bg-ink border border-cream/10 rounded-sm p-6">
        <p className="font-barlow-condensed text-cream/50 text-xs tracking-widest uppercase mb-6">Activity — Last 6 Months</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" stroke="rgba(245,241,232,0.3)" tick={{ fontSize: 11, fontFamily: 'var(--font-barlow-condensed)' }} />
            <YAxis stroke="rgba(245,241,232,0.3)" tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230,180,80,0.05)' }} />
            <Bar dataKey="Bookings" fill="#e6b450" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Pledges" fill="#c9922f" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent bookings */}
      {recentBookings.length > 0 && (
        <div className="bg-ink border border-cream/10 rounded-sm p-6">
          <p className="font-barlow-condensed text-cream/50 text-xs tracking-widest uppercase mb-4">Recent Bookings</p>
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-cream/[0.06] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-barlow text-cream/80 text-sm truncate">{b.school_name}</p>
                  <p className="font-barlow text-cream/30 text-xs">{b.contact_name} · {b.email}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  {b.preferred_date && (
                    <p className="font-barlow-condensed text-cream/40 text-xs">{format(new Date(b.preferred_date), 'MMM d, yyyy')}</p>
                  )}
                  <span className={`inline-block mt-0.5 text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full
                    ${b.status === 'confirmed' ? 'bg-teal-500/20 text-teal-300' :
                      b.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                      'bg-gold/10 text-gold/80'}`}>
                    {b.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}