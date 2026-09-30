import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Goes back one screen when there is somewhere in the app to go back to,
 * otherwise to a sensible parent page. Mirrors a native back button.
 */
export default function BackButton({ fallback = '/', label = 'Back', className = '' }) {
  const navigate = useNavigate();
  const onClick = () => {
    const idx = typeof window !== 'undefined' ? window.history.state?.idx : 0;
    if (typeof idx === 'number' && idx > 0) navigate(-1);
    else navigate(fallback);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label || 'Back'}
      className={`flex items-center gap-2 min-h-[44px] -ml-1 pl-1 pr-2 text-cream/70 hover:text-gold transition-colors font-barlow-condensed text-sm tracking-wider uppercase ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
