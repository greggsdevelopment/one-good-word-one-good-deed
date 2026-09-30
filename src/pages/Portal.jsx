import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, CalendarDays, FileText, LayoutGrid, Loader2, LogIn, MessageSquare, Receipt, School as SchoolIcon, Shield } from 'lucide-react';
import { callPortal, portalKey } from '@/lib/portal';
import OverviewTab from '@/components/portal/OverviewTab';
import ScheduleTab from '@/components/portal/ScheduleTab';
import BillingTab from '@/components/portal/BillingTab';
import DocumentsTab from '@/components/portal/DocumentsTab';
import MessagesTab from '@/components/portal/MessagesTab';
import SchoolTab from '@/components/portal/SchoolTab';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays },
  { key: 'billing', label: 'Billing', icon: Receipt },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'school', label: 'School', icon: Building2 },
];

function Center({ children }) {
  return <div className="min-h-[70vh] grid place-items-center px-6 text-center">{children}</div>;
}

export default function Portal() {
  const [params, setParams] = useSearchParams();
  const qc = useQueryClient();

  const me = useQuery({
    queryKey: ['portal-me'],
    queryFn: () => callPortal('me'),
    retry: false,
    staleTime: 60_000,
  });

  const schools = me.data?.schools || [];
  const requested = params.get('school');
  const schoolId = requested || schools[0]?.id || null;
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'overview';

  const data = useQuery({
    queryKey: portalKey(schoolId),
    queryFn: () => callPortal('overview', { school_id: schoolId }),
    enabled: Boolean(schoolId) && me.isSuccess,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    document.title = data.data?.school?.name ? `${data.data.school.name} | School Portal` : 'School Portal | One Good Word One Good Deed';
  }, [data.data?.school?.name]);

  const unread = useMemo(() => (data.data?.messages || []).filter((m) => m.author === 'ogwogd' && !m.read_by_school).length, [data.data]);

  const go = (key, extra = {}) => {
    const next = new URLSearchParams(params);
    next.set('tab', key);
    if (schoolId) next.set('school', schoolId);
    Object.entries(extra).forEach(([k, v]) => next.set(k, v));
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (me.isLoading) {
    return (
      <div className="min-h-screen bg-black text-cream">
        <Center><Loader2 className="w-7 h-7 animate-spin text-cream/50" /></Center>
      </div>
    );
  }

  if (me.isError) {
    const signedOut = me.error?.status === 401 || me.error?.code === 'unauthorized';
    return (
      <div className="min-h-screen bg-black text-cream">
        <Center>
          <div className="max-w-sm">
            <SchoolIcon className="w-10 h-10 mx-auto text-cream/40" />
            <h1 className="font-anton text-3xl tracking-wide mt-4">SCHOOL PORTAL</h1>
            <p className="font-barlow text-cream/65 mt-2">
              {signedOut ? 'Sign in with the email your invitation went to.' : me.error?.message}
            </p>
            <Link to="/login" className="mt-6 min-h-[48px] px-6 rounded-xl bg-gold text-ink font-barlow-condensed font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Sign in
            </Link>
          </div>
        </Center>
      </div>
    );
  }

  if (!schoolId) {
    return (
      <div className="min-h-screen bg-black text-cream">
        <Center>
          <div className="max-w-sm">
            <SchoolIcon className="w-10 h-10 mx-auto text-cream/40" />
            <h1 className="font-anton text-3xl tracking-wide mt-4">NO SCHOOL YET</h1>
            <p className="font-barlow text-cream/65 mt-2">
              {me.data?.isAdmin
                ? 'Open a school from Admin > Schools to see its portal.'
                : 'Your account is not linked to a school. Make sure you signed up with the email your invitation went to, or contact us.'}
            </p>
            <Link to={me.data?.isAdmin ? '/admin?tab=schools' : '/contact'} className="mt-6 min-h-[48px] px-6 rounded-xl border border-white/15 font-barlow-condensed uppercase tracking-wider inline-flex items-center justify-center">
              {me.data?.isAdmin ? 'Go to Schools' : 'Contact us'}
            </Link>
          </div>
        </Center>
      </div>
    );
  }

  const d = data.data;
  const props = { data: d, schoolId, go, refresh: () => qc.invalidateQueries({ queryKey: portalKey(schoolId) }) };

  return (
    <div className="min-h-screen bg-black text-cream">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-25" style={{ background: 'radial-gradient(closest-side, var(--rb-purple), transparent)' }} />
          <div className="absolute -top-24 right-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(closest-side, var(--rb-blue), transparent)' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 pt-7 pb-5">
          {d?.viewingAsAdmin && (
            <Link to={`/admin?tab=schools:${schoolId}`} className="mb-3 inline-flex items-center gap-2 rounded-full bg-rb-yellow/15 text-rb-yellow px-3 py-1 font-barlow-condensed uppercase tracking-wider text-xs">
              <Shield className="w-3.5 h-3.5" /> Viewing as admin. Back to admin
            </Link>
          )}
          <p className="font-barlow-condensed uppercase tracking-[0.3em] text-xs text-cream/50">School Portal</p>
          <h1 className="font-anton text-3xl sm:text-4xl tracking-wide mt-1 truncate">{(d?.school?.name || schools.find((s) => s.id === schoolId)?.name || 'Your school').toUpperCase()}</h1>
          {d?.me?.name && !d.viewingAsAdmin && <p className="font-barlow text-cream/60 mt-1">Hi {String(d.me.name).split(' ')[0]}. Everything for your program is here.</p>}
          {schools.length > 1 && (
            <select
              value={schoolId}
              onChange={(e) => setParams(new URLSearchParams({ school: e.target.value, tab }))}
              aria-label="Switch school"
              className="mt-3 rounded-xl bg-black/40 border border-white/15 px-3 py-2 font-barlow text-cream"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Section tabs */}
      <nav aria-label="Portal sections" className="sticky top-0 sticky-safe z-30 bg-black/95 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-3 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-no-ptr>
          {TABS.map(({ key, label, icon: Icon }) => {
            const on = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => go(key)}
                aria-current={on ? 'page' : undefined}
                className={`relative shrink-0 flex items-center gap-1.5 px-3.5 h-12 font-barlow-condensed uppercase tracking-wider text-sm transition-colors ${on ? 'text-cream' : 'text-cream/50 hover:text-cream/80'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {key === 'messages' && unread > 0 && (
                  <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rb-red text-white text-[10px] grid place-items-center">{unread}</span>
                )}
                {on && <motion.span layoutId="portal-tab" className="absolute left-2 right-2 bottom-0 h-[3px] rounded-t-full" style={{ background: 'var(--rainbow)' }} />}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-5 py-6 pb-16 select-text">
        {data.isLoading ? (
          <Center><Loader2 className="w-7 h-7 animate-spin text-cream/50" /></Center>
        ) : data.isError ? (
          <Center>
            <div>
              <p className="font-barlow text-cream/70">{data.error?.message}</p>
              <button type="button" onClick={() => data.refetch()} className="mt-4 min-h-[44px] px-5 rounded-xl border border-white/15 font-barlow-condensed uppercase tracking-wider text-sm">Try again</button>
            </div>
          </Center>
        ) : (
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {tab === 'overview' && <OverviewTab {...props} />}
            {tab === 'schedule' && <ScheduleTab {...props} />}
            {tab === 'billing' && <BillingTab {...props} />}
            {tab === 'documents' && <DocumentsTab {...props} />}
            {tab === 'messages' && <MessagesTab {...props} />}
            {tab === 'school' && <SchoolTab {...props} />}
          </motion.div>
        )}
      </main>
    </div>
  );
}
