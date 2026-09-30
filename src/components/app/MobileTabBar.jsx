import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, GraduationCap, HeartHandshake, Home, UserRound } from 'lucide-react';
import { NO_TABBAR, TABS, tabFor } from '@/lib/appShell';

const ICONS = { home: Home, programs: GraduationCap, events: CalendarDays, donate: HeartHandshake, account: UserRound };

// Static gradient text (the site's animated version repaints every frame, too costly on a fixed bar).
const RAINBOW_TEXT = {
  backgroundImage: 'linear-gradient(90deg, var(--rb-orange), var(--rb-yellow) 30%, var(--rb-blue) 70%, var(--rb-purple))',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
};
const RING = {
  background: 'var(--rainbow)',
  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
  mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
  opacity: 0.85,
};
const GLIDE = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Phone-only bottom tab bar. Tapping a tab opens that section's first page at
 * the top; tapping the tab you are on scrolls back to the top.
 *
 * The highlight is one element that slides sideways between the five equal
 * columns (a plain CSS transition on transform), so it always glides
 * horizontally and always lands centered on the icon.
 */
export default function MobileTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const hidden = NO_TABBAR.some((re) => re.test(pathname));
  const active = tabFor(pathname);
  const index = Math.max(0, TABS.findIndex((t) => t.key === active));

  useEffect(() => {
    const el = document.documentElement;
    if (hidden) {
      delete el.dataset.tabbar;
      return undefined;
    }
    el.dataset.tabbar = '1';
    return () => {
      delete el.dataset.tabbar;
    };
  }, [hidden]);

  if (hidden) return null;

  const go = (t) => {
    if (t.key === active && pathname === t.root) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    navigate(t.root);
  };

  return (
    <nav
      aria-label="Main"
      className="ogw-tabbar md:hidden fixed inset-x-0 bottom-0 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}
    >
      {/* Solid (no backdrop blur: blur behind a fixed bar is what makes phone scrolling stutter). */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#060607]" />
      {/* Rainbow hairline and a soft glow along the top edge, like the logo ring. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px opacity-70" style={{ background: 'var(--rainbow)' }} />
      <div aria-hidden="true" className="absolute inset-x-0 -top-6 h-6 pointer-events-none opacity-40" style={{ background: 'linear-gradient(to top, rgba(160,108,213,0.18), transparent)' }} />

      <div className="relative h-[58px]">
        {/* The sliding highlight: one column wide, moved by whole columns. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/5 pointer-events-none"
          style={{ transform: `translateX(${index * 100}%)`, transition: GLIDE, willChange: 'transform' }}
        >
          <span className="absolute top-0 left-1/2 -translate-x-1/2 block h-[3px] w-10 rounded-b-full" style={{ background: 'var(--rainbow)', boxShadow: '0 0 12px 1px rgba(160,108,213,0.55), 0 0 22px 2px rgba(74,155,232,0.25)' }} />
          <span
            className="absolute left-1/2 -translate-x-1/2 top-[9px] block w-[54px] h-[30px] rounded-full"
            style={{
              background: 'linear-gradient(120deg, rgba(239,83,80,0.26), rgba(247,201,72,0.18) 35%, rgba(74,155,232,0.24) 70%, rgba(160,108,213,0.32))',
              boxShadow: '0 6px 18px -6px rgba(160,108,213,0.7), 0 0 14px -4px rgba(239,83,80,0.35)',
            }}
          >
            <span className="absolute inset-0 rounded-full p-px" style={RING} />
          </span>
        </div>

        <ul className="relative grid grid-cols-5 h-full">
          {TABS.map((t) => {
            const Icon = ICONS[t.key];
            const on = t.key === active;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => go(t)}
                  aria-current={on ? 'page' : undefined}
                  aria-label={t.label}
                  className="ogw-tab w-full h-full flex flex-col items-center justify-center gap-[5px] active:scale-95 transition-transform duration-150"
                >
                  <span className="grid place-items-center w-[54px] h-[30px]">
                    <Icon
                      className={`w-[21px] h-[21px] transition-[color,transform] duration-300 ${on ? 'text-white -translate-y-px scale-105' : 'text-cream/45'}`}
                      strokeWidth={on ? 2.3 : 1.9}
                    />
                  </span>
                  <span
                    className={`font-barlow-condensed font-semibold text-[10.5px] uppercase tracking-[0.14em] leading-none transition-colors duration-300 ${on ? '' : 'text-cream/45'}`}
                    style={on ? RAINBOW_TEXT : undefined}
                  >
                    {t.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
