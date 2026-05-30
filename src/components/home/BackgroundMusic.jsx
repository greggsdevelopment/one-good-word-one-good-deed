import { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [ready, setReady] = useState(false);

  const VIDEO_ID = 'A8dH4cKGa6s';
  const src = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&enablejsapi=1&controls=0&mute=1&playsinline=1`;

  // Listen for YouTube iframe API ready message
  useEffect(() => {
    const onMessage = (e) => {
      if (typeof e.data === 'string') {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'onReady') setReady(true);
          // Also mark ready on any info event (player is loaded)
          if (data.event === 'infoDelivery') setReady(true);
        } catch {}
      }
    };
    window.addEventListener('message', onMessage);
    // Fallback: mark ready after 3s regardless
    const t = setTimeout(() => setReady(true), 3000);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(t);
    };
  }, []);

  const postToPlayer = (func, args) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*'
    );
  };

  const handleToggle = () => {
    if (muted) {
      postToPlayer('unMute', []);
      setMuted(false);
    } else {
      postToPlayer('mute', []);
      setMuted(true);
    }
    setShowTooltip(false);
  };

  return (
    <>
      {/* Hidden YouTube iframe */}
      <iframe
        ref={iframeRef}
        src={src}
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

      {/* Floating control button */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-2">
        {/* Tooltip */}
        {showTooltip && ready && (
          <div className="bg-ink/90 border border-white/10 text-cream text-xs font-barlow px-3 py-1.5 rounded-sm whitespace-nowrap shadow-lg">
            Click to play music 🎵
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleToggle}
          title={muted ? 'Unmute music' : 'Mute music'}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ${
            muted && showTooltip && ready ? 'animate-pulse' : ''
          }`}
          style={{ backgroundColor: '#D4A017' }}
        >
          {muted ? (
            <VolumeX className="w-5 h-5 text-ink" />
          ) : (
            <Music className="w-5 h-5 text-ink" />
          )}
        </button>
      </div>
    </>
  );
}