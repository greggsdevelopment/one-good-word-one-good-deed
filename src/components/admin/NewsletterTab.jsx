import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function NewsletterTab() {
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: () => base44.entities.NewsletterSubscriber.list('-created_date', 500),
  });

  if (isLoading) {
    return <div className="py-12 text-center font-barlow text-ash">Loading subscribers...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-barlow text-ash text-sm">{subscribers.length} total subscriber{subscribers.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="bg-white border border-ink/5 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 border-b border-ink/5">
            <tr>
              <th className="text-left px-4 py-3 font-barlow-condensed text-ash text-xs tracking-widest uppercase">Email</th>
              <th className="text-left px-4 py-3 font-barlow-condensed text-ash text-xs tracking-widest uppercase">Subscribe Date</th>
              <th className="text-left px-4 py-3 font-barlow-condensed text-ash text-xs tracking-widest uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center font-barlow text-ash">No subscribers yet.</td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02] transition-colors">
                  <td className="px-4 py-3 font-barlow text-ink">{sub.email}</td>
                  <td className="px-4 py-3 font-barlow text-ash">
                    {sub.created_date ? format(new Date(sub.created_date), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-green-100 text-green-700 font-barlow-condensed text-xs px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}