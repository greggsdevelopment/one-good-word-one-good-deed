import { motion } from 'framer-motion';

const ITEMS = [
  '500+ Students Impacted',
  '50+ Schools Visited',
  '2000+ Wristbands',
  '98% Would Recommend',
  'Troy MI Based',
  'Southeast Michigan',
];

const TickerContent = () => (
  <div className="flex items-center gap-0 shrink-0">
    {ITEMS.map((item, i) => (
      <span key={i} className="flex items-center">
        <span className="font-barlow-condensed text-gold font-semibold text-sm sm:text-base tracking-[0.2em] uppercase whitespace-nowrap px-8">
          {item}
        </span>
        <span className="text-gold/40 text-lg">◆</span>
      </span>
    ))}
  </div>
);

export default function MarqueeTicker() {
  return (
    <div className="bg-ink border-y border-gold/20 py-3 overflow-hidden relative">
      <div className="flex" style={{ animation: 'marquee 28s linear infinite' }}>
        <TickerContent />
        <TickerContent />
        <TickerContent />
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}