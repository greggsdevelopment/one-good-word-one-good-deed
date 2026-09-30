import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MusicContext = createContext(null);

const SAFE_MUSIC = { playing: false, ready: false, loading: false, toggle: () => {} };
export const useMusic = () => useContext(MusicContext) ?? SAFE_MUSIC;

const VIDEO_ID = 'u-4QARnU77A';

// The track has roughly two seconds of silence at the start.
// Skip it on the first play and every loop wrap.
const START_OFFSET_SECONDS = 2;

// The YouTube player is heavy (about a megabyte of script, and on iPhones it
// runs on the same thread as the page). It is only loaded when it can be used:
// on phones when the visitor taps the music button, on computers once the page
// has settled.
const isComputer = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

export function MusicProvider({ children }) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [wanted, setWanted] = useState(false);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const location = useLocation();
  const playingRef = useRef(false);
  const pausedForDraykeRef = useRef(false);
  const prevPathRef = useRef(location.pathname);
  const firstPlayRef = useRef(true);
  const playOnReadyRef = useRef(false);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Computers: warm the player up quietly once the page is idle.
  useEffect(() => {
    if (!isComputer()) return undefined;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const t = setTimeout(() => idle(() => setWanted(true), { timeout: 4000 }), 5000);
    return () => clearTimeout(t);
  }, []);

  const startPlaying = () => {
    const player = playerRef.current;
    if (!player) return;
    // On the very first play, skip the leading silence.
    if (firstPlayRef.current) {
      player.seekTo(START_OFFSET_SECONDS, true);
      firstPlayRef.current = false;
    }
    player.playVideo();
    setPlaying(true);
  };

  useEffect(() => {
    if (!wanted) return undefined;
    let cancelled = false;
    // Load YouTube IFrame API script if not already loaded
    if (!window.YT && !document.querySelector('script[data-yt-api]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.dataset.ytApi = '1';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (cancelled || !containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            setReady(true);
            setLoading(false);
            playerRef.current.setVolume(50);
            if (playOnReadyRef.current) {
              playOnReadyRef.current = false;
              startPlaying();
              // Some phones only allow sound from a direct tap. If it did not
              // start, show it as paused so the next tap plays it.
              setTimeout(() => {
                const state = playerRef.current?.getPlayerState?.();
                if (state !== 1 && state !== 3) setPlaying(false);
              }, 2500);
            }
          },
          // Handle the loop wrap ourselves instead of relying on the
          // loop attribute: when the track ends, seek past the leading
          // silence and play again.
          onStateChange: (e) => {
            if (e.data === 0) {
              const p = playerRef.current;
              if (p) {
                p.seekTo(START_OFFSET_SECONDS, true);
                p.playVideo();
              }
            }
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
      cancelled = true;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [wanted]);

  // Suppress background music on the /drayke memorial page only:
  // stop and mute on entry, never autoplay or resume while there,
  // and restore the visitor's previous preference when they leave.
  useEffect(() => {
    const onDrayke = location.pathname === '/drayke';
    const wasOnDrayke = prevPathRef.current === '/drayke';
    if (onDrayke === wasOnDrayke) {
      prevPathRef.current = location.pathname;
      return;
    }
    if (onDrayke) {
      if (playingRef.current && playerRef.current && ready) {
        pausedForDraykeRef.current = true;
        playerRef.current.pauseVideo();
        setPlaying(false);
      }
    } else if (ready && playerRef.current && pausedForDraykeRef.current) {
      playerRef.current.playVideo();
      setPlaying(true);
    }
    pausedForDraykeRef.current = false;
    prevPathRef.current = location.pathname;
  }, [location.pathname, ready]);

  const toggle = () => {
    const player = playerRef.current;
    if (!player || !ready) {
      // First tap on a phone: load the player, then play as soon as it is ready.
      if (loading) {
        playOnReadyRef.current = false;
        setLoading(false);
        return;
      }
      playOnReadyRef.current = true;
      setLoading(true);
      setWanted(true);
      // YouTube blocked or offline: stop the spinner instead of spinning forever.
      setTimeout(() => {
        if (!playerRef.current?.getPlayerState) {
          playOnReadyRef.current = false;
          setLoading(false);
        }
      }, 15000);
      return;
    }
    if (playing) {
      player.pauseVideo();
      setPlaying(false);
    } else {
      startPlaying();
    }
  };

  return (
    <MusicContext.Provider value={{ playing, ready, loading, toggle }}>
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