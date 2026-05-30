import { X, Ruler } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const SIZE_CHART = [
  { size: 'S',   chest: '34–36"', waist: '28–30"', hip: '34–36"' },
  { size: 'M',   chest: '38–40"', waist: '32–34"', hip: '38–40"' },
  { size: 'L',   chest: '42–44"', waist: '36–38"', hip: '42–44"' },
  { size: 'XL',  chest: '46–48"', waist: '40–42"', hip: '46–48"' },
  { size: '2XL', chest: '50–52"', waist: '44–46"', hip: '50–52"' },
];

export default function SizeGuideModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0f0f12] border border-cream/10 rounded-sm shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gold" />
                <h3 className="font-anton text-cream text-xl tracking-wide">SIZE GUIDE</h3>
              </div>
              <button onClick={onClose} className="text-cream/30 hover:text-cream transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-barlow text-cream/30 text-xs mb-4">Measurements in inches. When between sizes, size up.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream/10">
                  {['Size', 'Chest', 'Waist', 'Hip'].map((h) => (
                    <th key={h} className="font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase text-left pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row, i) => (
                  <tr key={row.size} className={`border-b border-cream/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="font-barlow-condensed text-gold font-bold py-3 pr-4">{row.size}</td>
                    <td className="font-barlow text-cream/60 py-3 pr-4">{row.chest}</td>
                    <td className="font-barlow text-cream/60 py-3 pr-4">{row.waist}</td>
                    <td className="font-barlow text-cream/60 py-3">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}