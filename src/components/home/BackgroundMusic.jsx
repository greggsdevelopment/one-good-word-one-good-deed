import { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';

function checkInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

// YouTube iframe fallback with reliable mute toggle via src swap
const VIDEO_ID = '2ecaYj14z3M';
const buildSrc = (muted) =>
  `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&mute=${muted ? 1 : 0}&playsinline=1&rel=0&modestbranding=1`;

export default function BackgroundMusic() {
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inIframe = checkInIframe();

  useEffect(() => {
    if (inIframe) return;
    const t = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(t);
  }, [inIframe]);

  // Auto-unmute on first user interaction
  useEffect(() => {
    if (inIframe || interacted) return;
    const autoUnmute = (e) => {
      // Don't trigger from the music button itself (it handles its own click)
      if (e.target?.closest?.('[data-music-btn]')) return;
      setInteracted(true);
      setShowHint(false);
      setMuted(false);
      if (iframeRef.current) iframeRef.current.src = buildSrc(false);
    };
    window.addEventListener('click', autoUnmute, { once: true });
    window.addEventListener('keydown', autoUnmute, { once: true });
    window.addEventListener('scroll', autoUnmute, { once: true });
    return () => {
      window.removeEventListener('click', autoUnmute);
      window.removeEventListener('keydown', autoUnmute);
      window.removeEventListener('scroll', autoUnmute);
    };
  }, [inIframe, interacted]);

  const handleToggle = () => {
    const nowMuted = !muted;
    setMuted(nowMuted);
    setInteracted(true);
    setShowHint(false);
    if (iframeRef.current) iframeRef.current.src = buildSrc(nowMuted);
  };

  if (inIframe) return null;

  return (
    <>
      <iframe
        ref={iframeRef}
        src={buildSrc(true)}
        allow="autoplay; encrypted-media"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '1px',
          height: '1px',
          pointerEvents: 'none',
          border: 'none',
        }}
        title="Background Music"
      />
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-2">
        {showHint && !interacted && (
          <div className="bg-ink/90 border border-white/10 text-cream text-xs font-barlow px-3 py-1.5 rounded-sm whitespace-nowrap shadow-lg">
            Click anywhere to play music 🎵
          </div>
        )}
        <button
          data-music-btn
          onClick={handleToggle}
          title={muted ? 'Unmute music' : 'Mute music'}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ${showHint && !interacted ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: '#D4A017' }}
        >
          {muted ? <VolumeX className="w-5 h-5 text-ink" /> : <Music className="w-5 h-5 text-ink" />}
        </button>
      </div>
    </>
  );
}