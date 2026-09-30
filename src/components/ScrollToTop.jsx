import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { rememberTabPath, saveScroll, scrollForEntry, scrollForPath } from "@/lib/appShell";

const getHashId = (hash) => {
  const rawId = hash.slice(1);
  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

// The last scroll position a real scroll event reported. Scroll events arrive
// asynchronously, so at the moment a new page commits this still holds where
// the visitor was on the page they are leaving.
let lastY = typeof window !== "undefined" ? window.scrollY : 0;

/**
 * Native-app scroll behavior:
 * - New page: start at the top (or at #section when the link has one).
 * - Back / forward: return to exactly where you were on that page.
 * - Switching tabs on a phone: return to where you were in that tab.
 * Pages load on demand, so every restore retries until the page is tall enough.
 */
export default function ScrollToTop() {
  const location = useLocation();
  const { pathname, hash, key, state, search } = location;
  const navigationType = useNavigationType();
  const prev = useRef(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    let t = 0;
    const onScroll = () => {
      lastY = window.scrollY;
      clearTimeout(t);
      t = setTimeout(() => {
        if (prev.current) saveScroll(prev.current.key, prev.current.pathname, lastY);
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    // First, remember where we were on the page we just left.
    if (prev.current) saveScroll(prev.current.key, prev.current.pathname, lastY);
    prev.current = { key, pathname };
    rememberTabPath(pathname, search, hash);

    let timer;
    const started = Date.now();
    const until = (fn) => {
      const tick = () => {
        if (fn() || Date.now() - started > 4000) return;
        timer = window.setTimeout(tick, 60);
      };
      tick();
    };
    const restoreTo = (y) =>
      until(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max + 2 < y) return false; // page not tall enough yet
        window.scrollTo({ top: y, left: 0, behavior: "instant" });
        lastY = y;
        return true;
      });

    if (navigationType === "POP") {
      const y = scrollForEntry(key);
      if (typeof y === "number") restoreTo(y);
      return () => window.clearTimeout(timer);
    }

    if (state && state.restoreScroll) {
      const y = scrollForPath(pathname);
      if (typeof y === "number") {
        restoreTo(y);
        return () => window.clearTimeout(timer);
      }
    }

    if (hash) {
      const id = getHashId(hash);
      until(() => {
        const el = document.getElementById(id);
        if (!el) return false;
        el.scrollIntoView({ behavior: "smooth" });
        return true;
      });
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    lastY = 0;
    return undefined;
     
  }, [key]);

  return null;
}
