import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ChevronLeft, ChevronRight, MapPin, Calendar, Filter } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

const CATEGORIES = ['All', 'School Visit', 'Community Event', 'Workshop', 'Speaking Engagement', 'Other'];

// Fallback sample photos for when no data exists yet
const SAMPLE_PHOTOS = [
  {
    id: 'sample-1',
    title: 'Assembly at Lincoln High School',
    description: 'Students engaged and inspired during our anti-bullying assembly.',
    image_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80',
    category: 'School Visit',
    location: 'Detroit, MI',
    event_date: '2025-03-15',
    featured: true,
  },
  {
    id: 'sample-2',
    title: 'Community Walk for Kindness',
    description: 'Hundreds gathered to walk together and spread positivity.',
    image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    category: 'Community Event',
    location: 'Troy, MI',
    event_date: '2025-04-20',
    featured: true,
  },
  {
    id: 'sample-3',
    title: 'Workshop with Middle Schoolers',
    description: 'Interactive workshop on the power of words and actions.',
    image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    category: 'Workshop',
    location: 'Warren, MI',
    event_date: '2025-02-10',
    featured: false,
  },
  {
    id: 'sample-4',
    title: 'Youth Leadership Panel',
    description: 'Young leaders sharing their stories of overcoming bullying.',
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    category: 'Speaking Engagement',
    location: 'Southfield, MI',
    event_date: '2025-01-28',
    featured: false,
  },
  {
    id: 'sample-5',
    title: 'Pledge Wall Signing Event',
    description: 'Students signing the pledge to spread one good word and one good deed.',
    image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    category: 'School Visit',
    location: 'Sterling Heights, MI',
    event_date: '2025-03-05',
    featured: false,
  },
  {
    id: 'sample-6',
    title: 'Faith & Community Forum',
    description: 'Bringing together faith communities to unite against racism.',
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    category: 'Community Event',
    location: 'Pontiac, MI',
    event_date: '2024-11-12',
    featured: true,
  },
];

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.GalleryPhoto.list('-event_date', 200);
      setPhotos(data.length > 0 ? data : SAMPLE_PHOTOS);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = activeCategory === 'All'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  const openLightbox = (photo) => {
    const idx = filtered.findIndex(p => p.id === photo.id);
    setLightboxIndex(idx);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const prev = () => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length);
  const next = () => setLightboxIndex(i => (i + 1) % filtered.length);

  useEffect(() => {
    const handler = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, filtered.length]);

  const lightboxPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors font-barlow-condensed text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Logo" className="h-8 w-8 rounded-full object-cover ring-2 ring-gold/40" />
            <p className="font-anton text-cream text-lg tracking-wider hidden sm:block">IMPACT GALLERY</p>
          </div>
          <Link to="/programs" className="font-barlow-condensed text-sm text-cream/50 hover:text-gold uppercase tracking-wider transition-colors">
            Book a Visit
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero text */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
          >
            Real Moments. Real Impact.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-anton text-cream text-5xl sm:text-7xl leading-[0.92] mb-6"
          >
            IMPACT<br />GALLERY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-barlow text-cream/60 text-lg max-w-xl mx-auto"
          >
            Every photo tells a story of change — from the hearts we've touched in schools and communities across Michigan and beyond.
          </motion.p>
        </div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 font-barlow-condensed text-sm tracking-wider uppercase rounded-sm border transition-all duration-300 ${
                activeCategory === cat
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/10 text-cream/40 hover:border-white/25 hover:text-cream/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-barlow-condensed text-cream/30 text-xl uppercase tracking-wider">No photos in this category yet.</p>
          </div>
        ) : (
          <>
            {/* Featured row */}
            {featured.length > 0 && (
              <div className="mb-4">
                <p className="font-barlow-condensed text-cream/25 text-xs tracking-[0.3em] uppercase mb-4">Featured</p>
                <div className={`grid gap-4 ${featured.length === 1 ? 'grid-cols-1' : featured.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                  {featured.map((photo, i) => (
                    <PhotoCard key={photo.id} photo={photo} index={i} featured onClick={() => openLightbox(photo)} />
                  ))}
                </div>
              </div>
            )}

            {/* Rest of photos */}
            {rest.length > 0 && (
              <div className={featured.length > 0 ? 'mt-4' : ''}>
                {featured.length > 0 && <p className="font-barlow-condensed text-cream/25 text-xs tracking-[0.3em] uppercase mb-4">All Photos</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {rest.map((photo, i) => (
                    <PhotoCard key={photo.id} photo={photo} index={i} onClick={() => openLightbox(photo)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center border border-white/[0.07] rounded-sm px-8 py-14 bg-white/[0.02]"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4">Be Part of the Story</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl mb-6 leading-tight">
            BRING THIS MOVEMENT<br />TO YOUR SCHOOL
          </h2>
          <p className="font-barlow text-cream/50 max-w-lg mx-auto mb-8">
            Join the growing list of schools and communities making a real difference. Your photos could be featured here next.
          </p>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
          >
            Book a School Visit
          </Link>
        </motion.div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/97 backdrop-blur-lg flex items-center justify-center px-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-cream/50 hover:text-cream transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 sm:left-8 text-cream/40 hover:text-gold transition-colors p-3"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.image_url}
                alt={lightboxPhoto.title}
                className="w-full max-h-[65vh] object-cover rounded-sm"
              />
              <div className="mt-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-barlow-condensed text-gold text-xs tracking-widest uppercase mb-1">{lightboxPhoto.category}</p>
                    <h3 className="font-anton text-cream text-2xl sm:text-3xl leading-tight">{lightboxPhoto.title}</h3>
                    {lightboxPhoto.description && (
                      <p className="font-barlow text-cream/50 mt-2 text-sm">{lightboxPhoto.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-right shrink-0">
                    {lightboxPhoto.location && (
                      <span className="flex items-center gap-1.5 text-cream/40 font-barlow text-xs justify-end">
                        <MapPin className="w-3 h-3" /> {lightboxPhoto.location}
                      </span>
                    )}
                    {lightboxPhoto.event_date && (
                      <span className="flex items-center gap-1.5 text-cream/40 font-barlow text-xs justify-end">
                        <Calendar className="w-3 h-3" /> {format(new Date(lightboxPhoto.event_date), 'MMMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-cream/20 font-barlow text-xs mt-4 text-center">
                  {lightboxIndex + 1} / {filtered.length} — use arrow keys or buttons to navigate
                </p>
              </div>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 sm:right-8 text-cream/40 hover:text-gold transition-colors p-3"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhotoCard({ photo, index, featured, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-sm cursor-pointer border border-white/[0.06] hover:border-gold/25 transition-all duration-400 ${featured ? 'aspect-[4/3]' : 'aspect-square'}`}
    >
      <img
        src={photo.image_url}
        alt={photo.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
        <p className="font-barlow-condensed text-gold text-xs tracking-widest uppercase mb-1">{photo.category}</p>
        <h3 className="font-anton text-cream text-lg leading-tight">{photo.title}</h3>
        {photo.location && (
          <p className="flex items-center gap-1 text-cream/50 font-barlow text-xs mt-1">
            <MapPin className="w-3 h-3" /> {photo.location}
          </p>
        )}
      </div>
      {photo.featured && (
        <div className="absolute top-3 left-3 px-2 py-1 bg-gold/90 text-ink font-barlow-condensed text-xs font-bold uppercase tracking-wider rounded-sm">
          Featured
        </div>
      )}
    </motion.div>
  );
}