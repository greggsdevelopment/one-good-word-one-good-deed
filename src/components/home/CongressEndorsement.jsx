import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const FULL_QUOTE = `While on the campaign trail, I come into contact with a lot of people who are working hard to make a difference in our communities. Every now and then, I meet someone whose passion and commitment to helping others truly stands out. Jason Lewis is one of those people.

Jason is leading the One Good Word... One Good Deed (OGWOGD) movement, an organization dedicated to combating bullying and racism through kindness, compassion, faith, and action. In a world where negativity often gets the most attention, Jason and his team are proving that one kind word and one good deed can create a ripple effect that changes lives.

Through community outreach, events, school engagement, and their Awareness Truck, they are taking this message directly into neighborhoods across Michigan and beyond. Their mission is simple: ensure that every person feels seen, valued, respected, and protected.

I encourage my friends, supporters, business owners, community leaders, and anyone looking to make a positive impact to learn more about what Jason Lewis and OGWOGD are doing. Whether it's volunteering, sponsoring their efforts, attending an event, or simply committing to stand against bullying and racism, every action matters.

Real change doesn't happen because of one person or one organization alone. It happens when communities come together and decide that kindness, respect, and unity are values worth fighting for.

Let's support Jason Lewis and help make his vision a reality.

One Good Word. One Good Deed. That's how we change the world.`;

export default function CongressEndorsement() {
  const [ref, inView] = useInView(0.1);

  return (
    <section
      ref={ref}
      className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(230,180,80,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block font-barlow-condensed text-xs tracking-[0.4em] uppercase text-gold border border-gold/40 px-4 py-2 mb-6">
            Congressional Endorsement
          </span>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl md:text-6xl leading-[0.95] uppercase">
            ENDORSED BY<br /><span className="text-gold">JOHN GOCI</span>
          </h2>
          <p className="font-barlow-condensed text-ash text-sm tracking-widest uppercase mt-3">
            Candidate for U.S. Congress
          </p>
        </motion.div>

        {/* Quote card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative border border-gold/30 rounded-sm p-8 md:p-12"
          style={{ background: 'linear-gradient(135deg, rgba(230,180,80,0.07) 0%, rgba(230,180,80,0.02) 100%)' }}
        >
          {/* Big decorative quote mark */}
          <div
            className="font-anton text-gold/20 leading-none select-none"
            style={{ fontSize: '120px', lineHeight: 1, marginBottom: '-24px', marginTop: '-16px' }}
          >
            "
          </div>

          <div className="space-y-5">
            {FULL_QUOTE.split('\n\n').map((paragraph, i) => (
              <p key={i} className="font-barlow text-cream/85 text-base md:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Closing quote */}
          <div
            className="font-anton text-gold/20 leading-none select-none text-right"
            style={{ fontSize: '120px', lineHeight: 1, marginTop: '-16px', marginBottom: '-24px' }}
          >
            "
          </div>

          {/* Attribution */}
          <div className="mt-10 pt-8 border-t border-gold/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
              <span className="font-anton text-gold text-lg">JG</span>
            </div>
            <div>
              <p className="font-anton text-gold text-xl uppercase tracking-wide">John Goci</p>
              <p className="font-barlow text-ash text-sm">Candidate for U.S. Congress &nbsp;·&nbsp; John Goci for Congress</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}