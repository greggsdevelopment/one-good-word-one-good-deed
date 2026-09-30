import { motion, useScroll, useSpring } from 'framer-motion';

/** Rainbow reading-progress bar pinned to the very top of the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-[var(--safe-top)] left-0 right-0 h-[3px] origin-left z-[60] pointer-events-none"
      style={{ scaleX, backgroundImage: 'var(--rainbow)' }}
    />
  );
}
