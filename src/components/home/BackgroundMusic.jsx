import { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';

// Royalty-free gospel/inspirational MP3
const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
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
      audio.play().then(() => setPlaying(true)).catch((e) => console.error('Audio play failed:', e));
    }
  };

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