import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const SAMPLE_DONORS = [
  { name: 'Marcus T.', amount: 100, time: '2 hours ago' },
  { name: 'Denise W.', amount: 25, time: '5 hours ago' },
  { name: 'James R.', amount: 50, time: 'Yesterday' },
  { name: 'Tanya M.', amount: 10, time: 'Yesterday' },
  { name: 'Kevin B.', amount: 250, time: '2 days ago' },
  { name: 'Alicia F.', amount: 25, time: '3 days ago' },
  { name: 'Robert J.', amount: 100, time: '4 days ago' },
  { name: 'Simone P.', amount: 500, time: '5 days ago' },
];

export default function DonorWall() {
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-6 bg-black/20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Recent Generosity</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide">DONOR WALL</h2>
          <p className="font-barlow text-cream/40 mt-3">Thank you to everyone who has given.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SAMPLE_DONORS.map((donor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white/[0.03] border border-cream/10 hover:border-gold/20 rounded-sm p-5 flex flex-col gap-3 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Heart className="w-4 h-4 text-gold fill-gold/30" />
                <span className="font-anton text-gold text-xl">${donor.amount}</span>
              </div>
              <div>
                <p className="font-barlow-condensed text-cream font-bold text-sm tracking-wide">{donor.name}</p>
                <p className="font-barlow text-cream/30 text-xs mt-0.5">{donor.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}