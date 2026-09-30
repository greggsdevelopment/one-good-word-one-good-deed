import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, GraduationCap, HeartHandshake, Home, UserRound } from 'lucide-react';
import { NO_TABBAR, TABS, lastPathForTab, tabFor } from '@/lib/appShell';

const ICONS = { home: Home, programs: GraduationCap, events: CalendarDays, donate: HeartHandshake, account: UserRound };

/**
 * Phone-only bottom tab bar. Each tab keeps its own place: leaving Events on a
 * detail page and coming back returns to that page, scrolled where you were.
 * Tapping the tab you are already on goes to its first screen, then to the top.
 */
export default function MobileTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const hidden = NO_TABBAR.some((re) => re.test(pathname));
  const active = tabFor(pathname);

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
    if (t.key === active) {
      if (pathname === t.root) window.scrollTo({ top: 0, behavior: 'smooth' });
      else navigate(t.root);
      return;
    }
    navigate(lastPathForTab(t.key), { state: { restoreScroll: true } });
  };

  return (
    <nav
      aria-label="Main"
      className="ogw-tabbar md:hidden fixed inset-x-0 bottom-0 z-40 bg-[#070708] border-t border-white/[0.08]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}
    >
      <ul className="grid grid-cols-5 h-[58px]">
        {TABS.map((t) => {
          const Icon = ICONS[t.key];
          const on = t.key === active;
          return (
            <li key={t.key} className="relative">
              <motion.button
                type="button"
                onClick={() => go(t)}
                whileTap={{ scale: 0.88 }}
                aria-current={on ? 'page' : undefined}
                aria-label={t.label}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-colors ${on ? 'text-cream' : 'text-cream/45'}`}
              >
                {on && (
                  <motion.span
                    layoutId="ogw-tab-pill"
                    aria-hidden="true"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-9 rounded-b-full"
                    style={{ background: 'var(--rainbow)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <Icon className={`w-[22px] h-[22px] transition-transform duration-300 ${on ? 'scale-110' : ''}`} strokeWidth={on ? 2.4 : 2} />
                <span className="font-barlow-condensed text-[11px] uppercase tracking-wider leading-none">{t.label}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
