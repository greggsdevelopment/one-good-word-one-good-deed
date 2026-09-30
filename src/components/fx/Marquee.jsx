const DOTS = ['bg-rb-red', 'bg-rb-orange', 'bg-rb-yellow', 'bg-rb-green', 'bg-rb-blue', 'bg-rb-purple'];

/**
 * An endless ticker of short phrases separated by rainbow dots. The list is
 * rendered twice so the loop never shows a gap.
 */
export default function Marquee({ items, className = '', reverse = false }) {
  const row = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((text, i) => (
        <span key={`${text}-${i}`} className="flex items-center">
          <span className="font-anton text-2xl sm:text-4xl tracking-wide text-cream/90 whitespace-nowrap px-6 sm:px-10">{text}</span>
          <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${DOTS[i % DOTS.length]}`} />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`relative overflow-hidden bg-black py-5 sm:py-7 ${className}`}>
      <div className="rainbow-rule absolute top-0 inset-x-0" aria-hidden="true" />
      <div
        className="flex w-max animate-marquee"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {row(false)}
        {row(true)}
      </div>
      <div className="rainbow-rule absolute bottom-0 inset-x-0" aria-hidden="true" />
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}
