import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { MotionConfig, motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import MobileTabBar from '@/components/app/MobileTabBar';
import PullToRefresh from '@/components/app/PullToRefresh';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import SupportChat from '@/components/chat/SupportChat';
import { MusicProvider } from '@/lib/musicContext';
import Home from '@/pages/Home';

// Home ships in the first download. Every other page is its own small file,
// fetched when it is visited, so the landing page is not waiting on 30 pages
// and the admin (with its charts) it never shows.
const NotFound = lazy(() => import('@/pages/NotFound'));
const Account = lazy(() => import('@/pages/Account'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Portal = lazy(() => import('@/pages/Portal'));
const RememberDrayke = lazy(() => import('@/pages/RememberDrayke'));
const Shop = lazy(() => import('@/pages/Shop'));
const About = lazy(() => import('@/pages/About'));
const AboutCody = lazy(() => import('@/pages/AboutCody'));
const Programs = lazy(() => import('@/pages/Programs'));
const Donate = lazy(() => import('@/pages/Donate'));
const PledgeWall = lazy(() => import('@/pages/PledgeWall'));
const Admin = lazy(() => import('@/pages/Admin'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Stories = lazy(() => import('@/pages/Stories'));
const Resources = lazy(() => import('@/pages/Resources'));
const Events = lazy(() => import('@/pages/Events'));
const NightForDraykeRSVP = lazy(() => import('@/pages/NightForDraykeRSVP'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Contact = lazy(() => import('@/pages/Contact'));
const WristbandBros = lazy(() => import('@/pages/WristbandBros'));
const GooseheadInsurance = lazy(() => import('@/pages/GooseheadInsurance'));
const DogNSuds = lazy(() => import('@/pages/DogNSuds'));
const TDKeleman = lazy(() => import('@/pages/TDKeleman'));
const SubwayTaylor = lazy(() => import('@/pages/SubwayTaylor'));
const PapasPizza = lazy(() => import('@/pages/PapasPizza'));
const PlymouthsAutoRepair = lazy(() => import('@/pages/PlymouthsAutoRepair'));
const FullyPromoted = lazy(() => import('@/pages/FullyPromoted'));
const LivRiteRecovery = lazy(() => import('@/pages/LivRiteRecovery'));
const ClassicStateWayne = lazy(() => import('@/pages/ClassicStateWayne'));
const TreeFortBikes = lazy(() => import('@/pages/TreeFortBikes'));
const HallOfFame = lazy(() => import('@/pages/HallOfFame'));
const Sponsorship = lazy(() => import('@/pages/Sponsorship'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

// After the first page settles, quietly fetch the public pages so clicking
// around still feels instant. Admin and sign-in pages load only on demand.
const PREFETCH = [
  () => import('@/pages/Account'),
  () => import('@/pages/Privacy'),
  () => import('@/pages/Terms'),
  () => import('@/pages/RememberDrayke'),
  () => import('@/pages/Shop'),
  () => import('@/pages/About'),
  () => import('@/pages/AboutCody'),
  () => import('@/pages/Programs'),
  () => import('@/pages/Donate'),
  () => import('@/pages/PledgeWall'),
  () => import('@/pages/Gallery'),
  () => import('@/pages/Stories'),
  () => import('@/pages/Resources'),
  () => import('@/pages/Events'),
  () => import('@/pages/NightForDraykeRSVP'),
  () => import('@/pages/Checkout'),
  () => import('@/pages/Contact'),
  () => import('@/pages/WristbandBros'),
  () => import('@/pages/GooseheadInsurance'),
  () => import('@/pages/DogNSuds'),
  () => import('@/pages/TDKeleman'),
  () => import('@/pages/SubwayTaylor'),
  () => import('@/pages/PapasPizza'),
  () => import('@/pages/PlymouthsAutoRepair'),
  () => import('@/pages/FullyPromoted'),
  () => import('@/pages/LivRiteRecovery'),
  () => import('@/pages/ClassicStateWayne'),
  () => import('@/pages/TreeFortBikes'),
  () => import('@/pages/HallOfFame'),
  () => import('@/pages/Sponsorship'),
];
function usePrefetchPages() {
  useEffect(() => {
    let cancelled = false;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const run = async () => {
      for (const load of PREFETCH) {
        if (cancelled) return;
        try {
          await load();
        } catch {
          // offline or a deploy in progress; the page loads when visited
        }
        await new Promise((r) => idle(r));
      }
    };
    const t = setTimeout(run, 3000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);
}

function PageFallback() {
  return <div className="min-h-screen bg-black" aria-busy="true" />;
}

// Pages whose state lives in the page itself (forms, checkout, sign-in).
const KEEP_ON_REFRESH = /^\/(login|register|forgot-password|reset-password|checkout|donate|sponsorship|rsvp|contact|pledge-wall|portal|account|admin)(\/|$)/i;
const hasTypedInput = () =>
  [...document.querySelectorAll('input, textarea')].some((el) => {
    const type = (el.getAttribute('type') || 'text').toLowerCase();
    if (['hidden', 'checkbox', 'radio', 'submit', 'button', 'range', 'file'].includes(type)) return false;
    // React keeps defaultValue in sync with controlled inputs, so any text counts.
    return Boolean(el.value && el.value.trim());
  });

const AuthenticatedApp = () => {
  const { authError } = useAuth();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  // Pull to refresh: refetch data and remount the current page.
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(async () => {
    // Never wipe something the visitor is typing or paying for: on those
    // pages, or with any field filled in, only the data is refreshed.
    if (!KEEP_ON_REFRESH.test(window.location.pathname) && !hasTypedInput()) setRefreshKey((k) => k + 1);
    await queryClient.invalidateQueries();
  }, [queryClient]);

  // Public pages draw right away. The app settings and login check finish in
  // the background; only the admin area waits for them (see ProtectedRoute).

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <>
    <PullToRefresh onRefresh={refresh} />
    <Suspense fallback={<PageFallback />}>
    {/* A quick fade on every screen change. Opacity only: a transform here
        would break the fixed headers and bars inside each page. */}
    <motion.div key={`${pathname}:${refreshKey}`} initial={{ opacity: 0.35 }} animate={{ opacity: 1 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/drayke" element={<RememberDrayke />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/about-cody" element={<AboutCody />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/pledge-wall" element={<PledgeWall />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/events" element={<Events />} />
      <Route path="/rsvp/night-for-drayke" element={<NightForDraykeRSVP />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/wristband-bros" element={<WristbandBros />} />
      <Route path="/goosehead-insurance" element={<GooseheadInsurance />} />
      <Route path="/dog-n-suds" element={<DogNSuds />} />
      <Route path="/td-keleman-trucking" element={<TDKeleman />} />
      <Route path="/subway-taylor" element={<SubwayTaylor />} />
      <Route path="/papas-pizza" element={<PapasPizza />} />
      <Route path="/plymouths-auto-repair" element={<PlymouthsAutoRepair />} />
      <Route path="/fully-promoted" element={<FullyPromoted />} />
      <Route path="/liv-rite-recovery" element={<LivRiteRecovery />} />
      <Route path="/classic-state-wayne" element={<ClassicStateWayne />} />
      <Route path="/tree-fort-bikes" element={<TreeFortBikes />} />
      <Route path="/hall-of-fame" element={<HallOfFame />} />
      <Route path="/sponsorship" element={<Sponsorship />} />
      <Route path="/sponsors" element={<Navigate to="/hall-of-fame" replace />} />
      <Route path="/become-a-sponsor" element={<Navigate to="/sponsorship" replace />} />
      <Route path="/pledge" element={<Navigate to="/pledge-wall" replace />} />

      {/* Auth pages */}
      <Route path="/account" element={<Account />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected admin */}
      <Route element={<ProtectedRoute requireAdmin unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/admin" element={<Admin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </motion.div>
    </Suspense>
    </>
  );
};

function App() {
  usePrefetchPages();
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <MusicProvider>
            {/* Honors the device's reduce-motion setting for every animation. */}
            <MotionConfig reducedMotion="user">
              {/* Covers the phone status bar area when the app runs full screen. */}
              <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[90] bg-black pointer-events-none" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
              <AuthenticatedApp />
              {/* Support assistant bubble, on every public page */}
              <SupportChat />
              <MobileTabBar />
            </MotionConfig>
          </MusicProvider>
        </Router>
        <Toaster />
        <SonnerToaster
          position="bottom-center"
          richColors
          closeButton
          duration={5000}
          offset={{ bottom: 'calc(16px + var(--tabbar-h, 0px))' }}
          mobileOffset={{ bottom: 'calc(12px + var(--tabbar-h, 0px))' }}
        />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App