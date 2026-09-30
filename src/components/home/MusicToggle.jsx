import { Loader2, Volume2, VolumeX } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMusic } from '@/lib/musicContext';

export default function MusicToggle() {
  const { playing, loading, toggle } = useMusic();
  const { pathname } = useLocation();

  // Suppress the toggle on the /drayke memorial page only.
  if (pathname === '/drayke') return null;

  return (
    <button
      onClick={toggle}
      title="Background music"
      aria-label={loading ? 'Loading background music' : playing ? 'Pause background music' : 'Play background music'}
      aria-pressed={playing}
      className="flex items-center justify-center w-9 h-9 rounded-full border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold transition-all duration-300 hover:shadow-[0_0_12px_rgba(247,201,72,0.4)]"
    >
      {loading ? <Loader2 size={16} strokeWidth={1.5} className="animate-spin" /> : playing ? <Volume2 size={16} strokeWidth={1.5} /> : <VolumeX size={16} strokeWidth={1.5} />}
    </button>
  );
}