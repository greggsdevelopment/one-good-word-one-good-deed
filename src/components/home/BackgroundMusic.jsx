import { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';

function checkInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

export default function BackgroundMusic() {
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const inIframe = checkInIframe();

  const VIDEO_ID = '2ecaYj14z3M';
  const src = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&enablejsapi=1&controls=0&mute=1&playsinline=1&rel=0&modestbranding=1&version=3`;

  useEffect(() => {
    if (inIframe) return;
    const onMessage = (e) => {
      if (typeof e.data === 'string') {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'onReady' || data.event === 'infoDelivery') setReady(true);
        } catch {}
      }
    };
    window.addEventListener('message', onMessage);
    const t = setTimeout(() => setReady(true), 3000);
    return () => { window.removeEventListener('message', onMessage); clearTimeout(t); };
  }, [inIframe]);

  useEffect(() => {
    if (inIframe || interacted || !ready) return;
    const autoUnmute = () => {
      setInteracted(true);
      setMuted(false);
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*'
      );
    };
    window.addEventListener('click', autoUnmute, { once: true });
    window.addEventListener('keydown', autoUnmute, { once: true });
    window.addEventListener('scroll', autoUnmute, { once: true });
    return () => {
      window.removeEventListener('click', autoUnmute);
      window.removeEventListener('keydown', autoUnmute);
      window.removeEventListener('scroll', autoUnmute);
    };
  }, [inIframe, ready, interacted]);

  const postToPlayer = (func, args) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }), '*'
    );
  };

  const handleToggle = () => {
    setInteracted(true);
    if (muted) { postToPlayer('unMute', []); setMuted(false); }
    else { postToPlayer('mute', []); setMuted(true); }
  };

  if (inIframe) return null;

  return (
    <>
      <iframe
        ref={iframeRef}
        src={src}
        allow="autoplay; encrypted-media"
        style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '1px', height: '1px', pointerEvents: 'none', border: 'none' }}
        title="Background Music"
      />
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-2">
        {ready && !interacted && (
          <div className="bg-ink/90 border border-white/10 text-cream text-xs font-barlow px-3 py-1.5 rounded-sm whitespace-nowrap shadow-lg">
            Click anywhere to play music 🎵
          </div>
        )}
        <button
          onClick={handleToggle}
          title={muted ? 'Unmute music' : 'Mute music'}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ${ready && !interacted ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: '#D4A017' }}
        >
          {muted ? <VolumeX className="w-5 h-5 text-ink" /> : <Music className="w-5 h-5 text-ink" />}
        </button>
      </div>
    </>
  );
}