import { useState, useRef } from 'react';
import { Music, VolumeX } from 'lucide-react';

// Your song: https://youtu.be/u-4QARnU77A
const VIDEO_ID = 'u-4QARnU77A';

export default function BackgroundMusic() {
  const iframeRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handleToggle = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (playing) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*'
      );
      setPlaying(false);
    } else {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*'
      );
      setPlaying(true);
    }
  };

  return (
    <>
      {/* Hidden YouTube iframe player */}
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${VIDEO_ID}?enablejsapi=1&autoplay=0&loop=1&playlist=${VIDEO_ID}&controls=0&mute=0`}
        allow="autoplay"
        style={{
          position: 'fixed',
          width: '1px',
          height: '1px',
          bottom: 0,
          left: 0,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        title="background-music"
      />

      {/* Gold music toggle button */}
      <button
        onClick={handleToggle}
        title={playing ? 'Pause music' : 'Play music'}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 99999,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#e6b450',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {playing
          ? <Music size={22} color="#000" />
          : <VolumeX size={22} color="#000" />
        }
      </button>
    </>
  );
}