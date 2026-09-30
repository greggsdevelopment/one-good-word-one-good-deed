import { Loader2 } from 'lucide-react';

export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#0e0e11] ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ icon: Icon, children, right }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <h3 className="flex items-center gap-2 font-barlow-condensed font-bold uppercase tracking-wider text-sm text-cream/80">
        {Icon && <Icon className="w-4 h-4 text-rb-yellow" />}
        {children}
      </h3>
      {right}
    </div>
  );
}

export function Chip({ tone = 'bg-white/10 text-cream/70', children }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-barlow-condensed uppercase tracking-wider text-[11px] ${tone}`}>{children}</span>;
}

export function Empty({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
      {Icon && <Icon className="w-8 h-8 mx-auto text-cream/30" />}
      <p className="mt-3 font-barlow-condensed font-bold uppercase tracking-wider text-cream/70">{title}</p>
      {children && <div className="mt-1 font-barlow text-sm text-cream/50">{children}</div>}
    </div>
  );
}

export const inputCls =
  'w-full rounded-xl bg-black/40 border border-white/15 focus:border-rb-blue/70 focus:ring-2 focus:ring-rb-blue/20 outline-none px-4 py-3 font-barlow text-cream placeholder:text-cream/30 transition-colors';

export function Field({ label, error, children, hint }) {
  return (
    <label className="block">
      <span className="block font-barlow-condensed uppercase tracking-wider text-xs text-cream/55 mb-1.5">{label}</span>
      {children}
      {hint && !error && <span className="block mt-1 font-barlow text-xs text-cream/40">{hint}</span>}
      {error && <span role="alert" className="block mt-1 font-barlow text-xs text-rb-red">{error}</span>}
    </label>
  );
}

export function PrimaryButton({ busy, children, className = '', ...rest }) {
  return (
    <button
      type="submit"
      {...rest}
      disabled={busy || rest.disabled}
      className={`min-h-[48px] px-5 rounded-xl bg-gold text-ink font-barlow-condensed font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    >
      {busy && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function GhostButton({ children, className = '', ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={`min-h-[44px] px-4 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/[0.04] font-barlow-condensed uppercase tracking-wider text-xs text-cream/85 inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
