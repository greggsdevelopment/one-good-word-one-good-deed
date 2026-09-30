import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// One place that knows how to load every admin data set. Query keys match the
// ones the individual tabs already use, so a save anywhere refreshes everywhere.
export const ADMIN_SOURCES = {
  bookings: { key: ['bookings'], load: () => base44.entities.BookingRequest.list('-created_date', 500) },
  orders: { key: ['admin-orders'], load: () => base44.entities.Order.list('-created_date', 500) },
  messages: { key: ['contactMessages'], load: () => base44.entities.ContactMessage.list('-created_date', 500) },
  sponsors: { key: ['sponsorship-applications'], load: () => base44.entities.SponsorshipApplication.list('-created_date', 500) },
  suggestions: { key: ['resource-suggestions'], load: () => base44.entities.ResourceSuggestion.list('-created_date', 500) },
  subscribers: { key: ['newsletter-subscribers'], load: () => base44.entities.NewsletterSubscriber.list('-created_date', 2000) },
  pledges: { key: ['pledges'], load: () => base44.entities.Pledge.list('-created_date', 1000) },
  stories: { key: ['stories'], load: () => base44.entities.Story.list('-created_date', 500) },
  events: { key: ['admin-events'], load: () => base44.entities.Event.list('event_date', 500) },
  rsvps: { key: ['admin-rsvps'], load: () => base44.entities.EventRSVP.list('-created_date', 2000) },
  itemDonations: { key: ['admin-item-donations'], load: () => base44.entities.ItemDonation.list('-created_date', 500) },
  inventory: { key: ['admin-inventory'], load: () => base44.entities.InventoryItem.list('name', 1000) },
  products: { key: ['admin-products'], load: () => base44.entities.Product.list('sort_order', 500) },
};

const REFRESH_MS = 60_000;

function useSource(name) {
  const src = ADMIN_SOURCES[name];
  return useQuery({
    queryKey: src.key,
    queryFn: async () => {
      try {
        const rows = await src.load();
        return Array.isArray(rows) ? rows : [];
      } catch (err) {
        // One entity failing (for example a schema not yet published) must not
        // take the whole admin down.
        console.error(`admin data: ${name} failed to load`, err);
        return [];
      }
    },
    refetchInterval: REFRESH_MS,
    refetchOnWindowFocus: true,
  });
}

/** Loads everything the command center, search and people views need. */
export function useAdminData() {
  const q = {};
  for (const name of Object.keys(ADMIN_SOURCES)) {
    q[name] = useSource(name);
  }
  const data = Object.fromEntries(Object.entries(q).map(([k, v]) => [k, v.data || []]));
  const loading = Object.values(q).some((v) => v.isLoading);
  const fetching = Object.values(q).some((v) => v.isFetching);
  const updatedAt = Math.max(0, ...Object.values(q).map((v) => v.dataUpdatedAt || 0));
  return { data, loading, fetching, updatedAt };
}

export function useRefreshAdmin() {
  const qc = useQueryClient();
  return () => Object.values(ADMIN_SOURCES).forEach((s) => qc.invalidateQueries({ queryKey: s.key }));
}

/* ---------- small shared helpers ---------- */

export const lower = (v) => String(v || '').trim().toLowerCase();

export const isPrayer = (m) => lower(m.subject) === 'prayer request';

export function ageHours(iso) {
  if (!iso) return 0;
  return (Date.now() - new Date(iso).getTime()) / 36e5;
}

/** Business hours elapsed since iso, skipping Saturdays and Sundays. */
export function businessDaysSince(iso) {
  if (!iso) return 0;
  const start = new Date(iso);
  const now = new Date();
  let days = 0;
  const d = new Date(start);
  while (d < now) {
    d.setDate(d.getDate() + 1);
    if (d > now) break;
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days += 1;
  }
  return days;
}

export function timeAgo(iso) {
  if (!iso) return '';
  const h = ageHours(iso);
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? '1 day ago' : `${d} days ago`;
}

export function mailto(to, subject, body) {
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to || ''}${params.length ? `?${params.join('&')}` : ''}`;
}

export const SIGNATURE = ['', 'Cody Greggs-Dorsey', 'One Good Word...One Good Deed', '(734) 383-3865', 'ogwogd.org'].join('\n');

export function parseJsonList(raw) {
  if (Array.isArray(raw)) return raw;
  try {
    const v = JSON.parse(raw || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// Spreadsheet apps run cells that start with = + - @ (or tab/CR) as formulas.
// Prefix those with an apostrophe so exported form text can never execute.
function neutralize(s) {
  if (/^-?\d+(\.\d+)?$/.test(s)) return s; // plain numbers, e.g. -4 in inventory history
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

function csvCell(value) {
  const s = neutralize(value == null ? '' : String(value));
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCsv(filename, columns, rows) {
  const header = columns.map((c) => csvCell(c.label)).join(',');
  const body = rows.map((r) => columns.map((c) => csvCell(typeof c.value === 'function' ? c.value(r) : r[c.value])).join(','));
  const blob = new Blob([[header, ...body].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

/* ---------- "new since your last visit" ---------- */

const SEEN_KEY = 'ogwogd_admin_last_seen';

export function readLastSeen() {
  try {
    const v = window.localStorage.getItem(SEEN_KEY);
    return v ? Number(v) : 0;
  } catch {
    return 0;
  }
}

export function writeLastSeen(ts = Date.now()) {
  try {
    window.localStorage.setItem(SEEN_KEY, String(ts));
  } catch {
    // private mode or blocked storage; the feature just stays off
  }
}
