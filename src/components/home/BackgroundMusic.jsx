import { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';

// Free, public domain, CORS-enabled audio
const AUDIO_URL = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3b/En-us-hello.ogg/En-us-hello.ogg.mp3';

// Multiple fallback sources in case one fails
const AUDIO_SOURCES = [
  'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
  'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
];

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.4;
    audio.crossOrigin = 'anonymous';
    audio.src = AUDIO_SOURCES[0];
    audioRef.current = audio;

    // Try next source if current fails to load
    let srcIndex = 0;
    audio.addEventListener('error', () => {
      srcIndex++;
      if (srcIndex < AUDIO_SOURCES.length) {
        audio.src = AUDIO_SOURCES[srcIndex];
        audio.load();
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play()
        .then(() => setPlaying(true))
        .catch((e) => {
          console.error('Audio play failed:', e);
        });
    }
  };

  return (
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
  );
}