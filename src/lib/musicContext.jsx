import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MusicContext = createContext(null);

export const useMusic = () => useContext(MusicContext);

const VIDEO_ID = 'u-4QARnU77A';

export function MusicProvider({ children }) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const location = useLocation();

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
            setReady(true);
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

  // Suppress background music on the /drayke memorial page only.
  useEffect(() => {
    if (location.pathname === '/drayke' && playerRef.current && ready) {
      playerRef.current.pauseVideo();
      setPlaying(false);
    }
  }, [location.pathname, ready]);

  const toggle = () => {
    const player = playerRef.current;
    if (!player || !ready) return;
    if (playing) {
      player.pauseVideo();
      setPlaying(false);
    } else {
      player.playVideo();
      setPlaying(true);
    }
  };

  return (
    <MusicContext.Provider value={{ playing, ready, toggle }}>
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
      {children}
    </MusicContext.Provider>
  );
}