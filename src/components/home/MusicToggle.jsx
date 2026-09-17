import { Volume2, VolumeX } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMusic } from '@/lib/musicContext';

export default function MusicToggle() {
  const { playing, toggle } = useMusic();
  const { pathname } = useLocation();

  // Suppress the toggle on the /drayke memorial page only.
  if (pathname === '/drayke') return null;

  return (
    <button
      onClick={toggle}
      title="Background music"
      aria-label="Background music"
      className="flex items-center justify-center w-9 h-9 rounded-full border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold transition-all duration-300 hover:shadow-[0_0_12px_rgba(230,180,80,0.4)]"
    >
      {playing ? <Volume2 size={16} strokeWidth={1.5} /> : <VolumeX size={16} strokeWidth={1.5} />}
    </button>
  );
}