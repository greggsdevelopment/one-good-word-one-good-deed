import { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';

// Direct MP3 from a publicly accessible source
// This is a royalty-free gospel/inspirational track
const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

function checkInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const inIframe = checkInIframe();

  useEffect(() => {
    if (inIframe) return;
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    audio.addEventListener('canplay', () => setReady(true));
    audio.load();

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [inIframe]);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (inIframe) return null;

  return (
    <button
      onClick={handleToggle}
      title={playing ? 'Pause music' : 'Play music'}
      className="fixed bottom-6 left-6 z-[9999] w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95"
      style={{ backgroundColor: '#e6b450' }}
    >
      {playing
        ? <Music className="w-5 h-5 text-black" />
        : <VolumeX className="w-5 h-5 text-black" />
      }
    </button>
  );
}