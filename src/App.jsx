import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import BackgroundMusic from '@/components/home/BackgroundMusic';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import About from '@/pages/About';
import Programs from '@/pages/Programs';
import Donate from '@/pages/Donate';
import PledgeWall from '@/pages/PledgeWall';
import Admin from '@/pages/Admin';
import Gallery from '@/pages/Gallery';
import Stories from '@/pages/Stories';
import Resources from '@/pages/Resources';
import Events from '@/pages/Events';
import Checkout from '@/pages/Checkout';
import Contact from '@/pages/Contact';
import WristbandBros from '@/pages/WristbandBros';
import GooseheadInsurance from '@/pages/GooseheadInsurance';
import DogNSuds from '@/pages/DogNSuds';
import TDKeleman from '@/pages/TDKeleman';
import SubwayTaylor from '@/pages/SubwayTaylor';
import PapasPizza from '@/pages/PapasPizza';
import PlymouthsAutoRepair from '@/pages/PlymouthsAutoRepair';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-ink">
        <div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/pledge-wall" element={<PledgeWall />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/events" element={<Events />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/wristband-bros" element={<WristbandBros />} />
      <Route path="/goosehead-insurance" element={<GooseheadInsurance />} />
      <Route path="/dog-n-suds" element={<DogNSuds />} />
      <Route path="/td-keleman-trucking" element={<TDKeleman />} />
      <Route path="/subway-taylor" element={<SubwayTaylor />} />
      <Route path="/papas-pizza" element={<PapasPizza />} />
      <Route path="/plymouths-auto-repair" element={<PlymouthsAutoRepair />} />
      <Route path="/pledge" element={<Navigate to="/pledge-wall" replace />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected admin */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/admin" element={<Admin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <BackgroundMusic />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App