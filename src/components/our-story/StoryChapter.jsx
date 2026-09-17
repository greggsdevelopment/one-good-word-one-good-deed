import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

export default function StoryChapter({ chapter, index, photoUrl, isAdmin, onUploaded }) {
  const [ref, inView] = useInView(0.15);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const odd = index % 2 === 1;
  const num = String(index + 1).padStart(2, '0');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      const existing = await base44.entities.StoryPhoto.filter({ chapter: chapter.key });
      if (existing.length) {
        await base44.entities.StoryPhoto.update(existing[0].id, { image_url: file_url });
      } else {
        await base44.entities.StoryPhoto.create({ chapter: chapter.key, image_url: file_url });
      }
      onUploaded?.();
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="relative md:grid md:grid-cols-2 md:gap-16 md:items-center" ref={ref}>
      {/* Gold diamond marker on the timeline */}
      <span
        className="absolute left-4 md:left-1/2 top-10 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 rotate-45 w-3 h-3 bg-gold shadow-[0_0_10px_rgba(230,180,80,0.6)] z-10"
        aria-hidden="true"
      />

      {/* Photo / placeholder */}
      <motion.div
        initial={{ opacity: 0, x: odd ? 24 : -24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`relative pl-12 md:pl-0 ${odd ? 'md:order-2 md:pl-16' : 'md:order-1 md:pr-16'}`}
      >
        <div className="relative aspect-[4/3] border border-gold/25 bg-black/40 overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt={chapter.heading} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gold/40">
              <Camera className="w-8 h-8" strokeWidth={1.2} />
              <span className="font-barlow-condensed text-xs tracking-[0.3em] uppercase">
                Photo — Chapter {num}
              </span>
            </div>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-ink/80 border border-gold/40 text-gold hover:bg-gold hover:text-ink font-barlow-condensed text-xs uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading ? 'Uploading' : photoUrl ? 'Replace' : 'Upload'}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        className={`pl-12 md:pl-0 mt-8 md:mt-0 ${odd ? 'md:order-1 md:pr-16' : 'md:order-2 md:pl-16'}`}
      >
        <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-3">
          Chapter {num}
        </p>
        <h2 className="text-cream text-3xl md:text-4xl mb-5 leading-tight" style={{ ...SERIF, fontWeight: 600 }}>
          {chapter.heading}
        </h2>
        <p className="font-barlow text-cream/65 text-lg leading-relaxed max-w-md">{chapter.body}</p>
      </motion.div>
    </div>
  );
}