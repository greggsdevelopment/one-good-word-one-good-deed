/**
 * A slowly turning halo in the logo's colors. Sits behind a circular element
 * (the logo) and gives it a living, glowing edge.
 */
export default function RainbowRing({ className = '', blur = 38, opacity = 0.55, thickness = 10 }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Soft glow. Still: a blur on a turning element is redrawn every frame. */}
      <div
        className="absolute -inset-[6%] rounded-full"
        style={{ background: 'var(--rainbow-conic)', filter: `blur(${blur}px)`, opacity }}
      />
      {/* Crisp ring hugging the logo edge */}
      <div
        className="absolute -inset-[3px] rounded-full animate-spin-slower"
        style={{
          background: 'var(--rainbow-conic)',
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness / 3}px), #000 calc(100% - ${thickness / 3}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness / 3}px), #000 calc(100% - ${thickness / 3}px))`,
          opacity: 0.9,
        }}
      />
    </div>
  );
}
