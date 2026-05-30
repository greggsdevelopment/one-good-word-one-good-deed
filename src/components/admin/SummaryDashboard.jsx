import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SummaryDashboard({ bookings = [], pledges = [] }) {
  const data = [
    {
      name: 'Totals',
      pledges: pledges.length,
      bookings: bookings.length,
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pledges Card */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="font-barlow-condensed text-cream/50 text-xs tracking-wider uppercase mb-2">Total</p>
          <p className="font-anton text-gold text-5xl mb-2">{pledges.length}</p>
          <p className="font-barlow text-cream/70 text-sm">Pledges Collected</p>
        </div>

        {/* Bookings Card */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="font-barlow-condensed text-cream/50 text-xs tracking-wider uppercase mb-2">Total</p>
          <p className="font-anton text-gold text-5xl mb-2">{bookings.length}</p>
          <p className="font-barlow text-cream/70 text-sm">Booking Requests</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <p className="font-barlow-condensed text-cream/70 text-sm tracking-wider uppercase mb-6">Summary Overview</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0b0b0d', 
                border: '1px solid rgba(230, 180, 80, 0.3)',
                borderRadius: '4px'
              }}
              labelStyle={{ color: '#f5f1e8' }}
            />
            <Legend />
            <Bar dataKey="pledges" fill="#e6b450" name="Pledges" />
            <Bar dataKey="bookings" fill="#c9922f" name="Booking Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}