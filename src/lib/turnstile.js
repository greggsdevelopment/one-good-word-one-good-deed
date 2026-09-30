import { base44 } from '@/api/base44Client';

/**
 * Cloudflare Turnstile, run on demand right before a public submission.
 *
 * - The site key comes from the publicConfig backend function, so turning the
 *   check on or rotating keys only means changing Base44 secrets.
 * - When no site key is configured this returns null and the request goes out
 *   without a token (the server skips the check in that same state).
 * - Each call renders a fresh widget, waits for its single-use token, then
 *   removes it. The widget only becomes visible if Cloudflare wants the
 *   visitor to click a checkbox.
 */

// Errors thrown here carry humanCheck: true so callers can show their message as-is.
function checkError(message) {
  const err = new Error(message);
  err.humanCheck = true;
  return err;
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TIMEOUT_MS = 45_000;

let siteKeyPromise = null;
let scriptPromise = null;

function getSiteKey() {
  if (!siteKeyPromise) {
    siteKeyPromise = base44.functions
      .invoke('publicConfig', {})
      .then((r) => String((r?.data ?? r)?.turnstile_site_key || ''))
      .catch(() => {
        siteKeyPromise = null; // do not cache a failed lookup
        return '';
      });
  }
  return siteKeyPromise;
}

function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile did not load')));
      s.onerror = () => {
        scriptPromise = null;
        reject(new Error('Turnstile did not load'));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

function mountPoint() {
  let host = document.getElementById('ogw-human-check');
  if (!host) {
    host = document.createElement('div');
    host.id = 'ogw-human-check';
    host.setAttribute('aria-live', 'polite');
    // Bottom center, above everything, empty (and invisible) unless Cloudflare asks for a click.
    host.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000;';
    document.body.appendChild(host);
  }
  const slot = document.createElement('div');
  host.appendChild(slot);
  return slot;
}

/**
 * Resolves to a fresh token for `action` (letters, numbers, dash, underscore;
 * max 32 characters), or null when the check is not switched on.
 */
export async function getHumanToken(action) {
  const siteKey = await getSiteKey();
  if (!siteKey) return null;

  let ts;
  try {
    ts = await loadScript();
  } catch {
    throw checkError('Our spam check could not load. Check your connection or turn off content blockers, then try again.');
  }

  const slot = mountPoint();
  return new Promise((resolve, reject) => {
    let widgetId = null;
    let settled = false;
    const done = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      setTimeout(() => {
        try {
          if (widgetId !== null) ts.remove(widgetId);
        } catch {
          // already gone
        }
        slot.remove();
      }, 0);
      fn(value);
    };
    const timer = setTimeout(
      () => done(reject, checkError('The spam check took too long. Please try again.')),
      TIMEOUT_MS,
    );
    try {
      widgetId = ts.render(slot, {
        sitekey: siteKey,
        action: String(action).slice(0, 32),
        appearance: 'interaction-only',
        theme: 'dark',
        callback: (token) => done(resolve, token),
        'error-callback': () => done(reject, checkError('We could not confirm you are a person. Please refresh and try again.')),
        'expired-callback': () => done(reject, checkError('The spam check expired. Please try again.')),
      });
    } catch {
      done(reject, checkError('Our spam check could not start. Please refresh and try again.'));
    }
  });
}
