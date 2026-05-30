const STATS = [
  { value: '500+', label: 'Students Reached' },
  { value: '12+', label: 'Schools Visited' },
  { value: '2,000+', label: 'Wristbands Distributed' },
  { value: '100%', label: 'Free Programs' },
];

export default function ImpactCounters() {
  return (
    <section className="relative bg-ink py-20 md:py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="w-16 h-1 bg-gold mb-10 mx-auto" />
        <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-12 text-center">
          Our Impact
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-sm overflow-hidden">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-ink flex flex-col items-center justify-center py-12 px-6 text-center gap-3 hover:bg-white/[0.03] transition-colors"
            >
              <span className="font-anton text-5xl sm:text-6xl leading-none" style={{ color: '#D4A017' }}>
                {stat.value}
              </span>
              <p className="font-barlow-condensed text-cream/50 text-sm tracking-wider uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}