import { useState, useEffect, useRef } from 'react';
import { Music, VolumeX } from 'lucide-react';

const VIDEO_ID = 'u-4QARnU77A';

export default function BackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    // Load YouTube IFrame API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            playerRef.current.setVolume(50);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const handleToggle = () => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    if (playing) {
      player.pauseVideo();
      setPlaying(false);
    } else {
      player.playVideo();
      setPlaying(true);
    }
  };

  return (
    <>
      {/* Hidden YouTube player container */}
      <div
        style={{
          position: 'fixed',
          width: '1px',
          height: '1px',
          bottom: 0,
          left: 0,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div ref={containerRef} />
      </div>

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