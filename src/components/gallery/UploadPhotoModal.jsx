import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, ImagePlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['School Visit', 'Community Event', 'Workshop', 'Speaking Engagement', 'Other'];

const inputClass = "w-full bg-white/[0.06] border border-white/10 rounded-sm px-4 py-3 text-cream placeholder:text-cream/30 font-barlow text-sm focus:outline-none focus:border-gold/50 transition-colors";

export default function UploadPhotoModal({ open, onClose, onUploaded }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'School Visit' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !form.title.trim()) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.GalleryPhoto.create({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      image_url: file_url,
    });
    setUploading(false);
    setSubmitted(true);
    onUploaded();
  };

  const handleClose = () => {
    setForm({ title: '', description: '', category: 'School Visit' });
    setFile(null);
    setPreview(null);
    setSubmitted(false);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-lg bg-[#0f0f12] border border-cream/10 rounded-sm shadow-2xl p-8"
        >
          <button onClick={handleClose} className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors">
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle className="w-14 h-14 text-gold mx-auto mb-4" />
              <h3 className="font-anton text-cream text-2xl mb-2">PHOTO UPLOADED!</h3>
              <p className="font-barlow text-cream/50 text-sm mb-6">Your photo has been added to the gallery.</p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-1">Gallery</p>
                <h2 className="font-anton text-cream text-2xl">UPLOAD A PHOTO</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* File picker */}
                <label className="block cursor-pointer">
                  <div className={`border-2 border-dashed rounded-sm flex flex-col items-center justify-center py-8 transition-colors ${preview ? 'border-gold/40' : 'border-white/10 hover:border-gold/30'}`}>
                    {preview ? (
                      <img src={preview} alt="Preview" className="max-h-40 object-contain rounded-sm" />
                    ) : (
                      <>
                        <ImagePlus className="w-8 h-8 text-cream/20 mb-2" />
                        <p className="font-barlow-condensed text-cream/40 text-sm uppercase tracking-wider">Click to select image</p>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" required />
                </label>

                <input required placeholder="Photo Title *" value={form.title} onChange={set('title')} className={inputClass} />
                <textarea placeholder="Description (optional)" value={form.description} onChange={set('description')} rows={2} className={`${inputClass} resize-none`} />
                <select value={form.category} onChange={set('category')} className={`${inputClass} appearance-none`}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <button
                  type="submit"
                  disabled={uploading || !file || !form.title.trim()}
                  className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}