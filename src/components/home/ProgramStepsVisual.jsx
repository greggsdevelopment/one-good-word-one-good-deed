const STEPS = [
  'One Good Word Assembly',
  'The 10 Second Lab',
  'Group Chat Check',
  'Student Ambassadors',
  'Staff PD & Family Night',
];

/**
 * Stands in for a photograph on the School Programs band: the five steps of the
 * school-year program, set as a numbered gold sequence inside the same frame.
 */
export default function ProgramStepsVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 py-8 bg-gradient-to-br from-black/60 via-ink to-black/70">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 75% 15%, rgba(230,180,80,0.14) 0%, rgba(11,11,13,0) 60%)',
        }}
      />

      <p className="relative font-barlow-condensed text-gold text-[10px] tracking-[0.35em] uppercase mb-7">
        Five Steps, One School Year
      </p>

      <ol className="relative space-y-4 sm:space-y-5">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-3 sm:gap-4 group/step">
            <span className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gold/40 flex items-center justify-center font-anton text-gold text-xs sm:text-sm transition-colors duration-500 group-hover:border-gold group-hover:bg-gold/10">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-barlow-condensed text-cream text-base sm:text-xl tracking-wide leading-tight">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <div className="relative mt-8 pt-6 border-t border-gold/15">
        <p className="font-barlow text-cream/45 text-sm leading-relaxed">
          Grades K through 12. Flat rates, no travel charges anywhere in metro Detroit.
        </p>
      </div>
    </div>
  );
}