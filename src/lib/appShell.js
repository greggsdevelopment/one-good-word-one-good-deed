/**
 * App-style navigation helpers shared by the phone tab bar and scroll handling.
 *
 * - Every page belongs to one of five tabs. Switching tabs returns you to the
 *   last page you were on inside that tab ("stack preservation"), scrolled to
 *   where you left it.
 * - Scroll positions are remembered per history entry (for Back) and per
 *   page (for returning to a tab). Storage failures are harmless.
 */

export const TABS = [
  { key: 'home', label: 'Home', root: '/' },
  { key: 'programs', label: 'Programs', root: '/programs' },
  { key: 'events', label: 'Events', root: '/events' },
  { key: 'donate', label: 'Give', root: '/donate' },
  { key: 'account', label: 'Account', root: '/account' },
];

const PREFIX = [
  ['programs', ['/programs']],
  ['events', ['/events', '/rsvp']],
  ['donate', ['/donate', '/sponsorship', '/hall-of-fame']],
  ['account', ['/account', '/portal', '/login', '/register', '/forgot-password', '/reset-password', '/privacy', '/terms']],
];

export function tabFor(pathname = '/') {
  const p = pathname.toLowerCase();
  for (const [key, prefixes] of PREFIX) {
    if (prefixes.some((x) => p === x || p.startsWith(`${x}/`) || p.startsWith(`${x}#`))) return key;
  }
  return 'home';
}

/** Where the tab bar is hidden: tools with their own navigation. */
export const NO_TABBAR = [/^\/admin/];

function read(key) {
  try {
    const v = window.sessionStorage.getItem(key);
    return v ? JSON.parse(v) : {};
  } catch {
    return {};
  }
}

function write(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode or storage full: navigation still works, just without memory
  }
}

/* ---------------- tab stacks ---------------- */

const STACK_KEY = 'ogw-tab-stacks';

export function rememberTabPath(pathname, search = '', hash = '') {
  const stacks = read(STACK_KEY);
  stacks[tabFor(pathname)] = `${pathname}${search}${hash}`;
  write(STACK_KEY, stacks);
}

export function lastPathForTab(key) {
  return read(STACK_KEY)[key] || TABS.find((t) => t.key === key)?.root || '/';
}

/* ---------------- scroll memory ---------------- */

const BY_ENTRY = 'ogw-scroll-entry';
const BY_PATH = 'ogw-scroll-path';

export function saveScroll(entryKey, pathname, y) {
  const e = read(BY_ENTRY);
  e[entryKey] = y;
  // Keep the map small.
  const keys = Object.keys(e);
  if (keys.length > 80) keys.slice(0, keys.length - 80).forEach((k) => delete e[k]);
  write(BY_ENTRY, e);
  const p = read(BY_PATH);
  p[pathname] = y;
  write(BY_PATH, p);
}

export const scrollForEntry = (entryKey) => read(BY_ENTRY)[entryKey];
export const scrollForPath = (pathname) => read(BY_PATH)[pathname];
