import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export const GOFUNDME_URL = 'https://www.gofundme.com/f/support-one-good-word-one-good-deeds-mission';

// Keep these lists in sync with base44/functions/submitItemDonation/logic.ts,
// which validates against its own copy on the server.
export const ITEM_CATEGORIES = [
  'Backpacks',
  'School supplies',
  'Clothing',
  'Shoes',
  'Coats and winter gear',
  'Hygiene and personal care',
  'Books',
  'Toys and games',
  'Other',
];

export const ITEM_CONDITIONS = ['New', 'Like new', 'Gently used'];
export const NEED_STATUSES = ['open', 'paused', 'full'];
export const OTHER_NEED_ID = 'other';

// Where pickups are measured from. The server uses the same point.
export const PICKUP_ORIGIN_LABEL = 'Westland, MI';

export const DEFAULT_DONATION_SETTINGS = {
  item_donations_enabled: true,
  pickup_enabled: true,
  money_donations_enabled: true,
  allow_other_items: false,
  pickup_radius_miles: 50,
  not_accepted: [
    'Used socks or underwear',
    'Opened or used hygiene products',
    'Anything stained, torn, broken or missing pieces',
    'Car seats, cribs, mattresses or furniture',
    'Food or medicine',
  ],
  dropoff_instructions:
    'Choose drop-off and we will reach out within two business days to set a time and place that works for you.',
  closed_message:
    'We are not taking donations through the site right now. Check back soon, or call (734) 383-3865 if you have something for a family in need.',
  gofundme_url: GOFUNDME_URL,
};

export function mergeDonationSettings(record) {
  const merged = { ...DEFAULT_DONATION_SETTINGS };
  if (!record) return merged;
  for (const key of Object.keys(DEFAULT_DONATION_SETTINGS)) {
    const value = record[key];
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    merged[key] = value;
  }
  if (record.id) merged.id = record.id;
  return merged;
}

/** Conditions a need accepts. Mirrors the server: empty means new only. */
export function conditionsFor(need) {
  const list = Array.isArray(need?.accepted_conditions)
    ? need.accepted_conditions.filter((c) => ITEM_CONDITIONS.includes(c))
    : [];
  return list.length ? list : ['New'];
}

export function capFor(need) {
  const cap = Number(need?.max_per_donation);
  return Number.isFinite(cap) && cap > 0 ? Math.trunc(cap) : 1000;
}

export const DONATION_SETTINGS_KEY = ['donation-settings'];
export const DONATION_NEEDS_KEY = ['donation-needs'];

export function useDonationSettings() {
  const query = useQuery({
    queryKey: DONATION_SETTINGS_KEY,
    queryFn: async () => {
      const rows = await base44.entities.DonationSettings.list('-updated_date', 1);
      return rows?.[0] || null;
    },
    staleTime: 60_000,
  });
  return { ...query, settings: mergeDonationSettings(query.data) };
}

export function useDonationNeeds() {
  return useQuery({
    queryKey: DONATION_NEEDS_KEY,
    queryFn: async () => {
      const rows = await base44.entities.DonationNeed.list('sort_order', 500);
      return Array.isArray(rows) ? rows : [];
    },
    staleTime: 60_000,
  });
}

// A sensible first list. The admin can add it with one click and edit from there.
export const STARTER_NEEDS = [
  { name: 'Backpacks', category: 'Backpacks', details: 'Kids and teen sizes. Zippers and straps must work.', accepted_conditions: ['New', 'Like new'], max_per_donation: 20, target_quantity: 50, sort_order: 10 },
  { name: 'Notebooks, folders and paper', category: 'School supplies', details: 'Unused.', accepted_conditions: ['New'], max_per_donation: 100, target_quantity: 200, sort_order: 20 },
  { name: 'Pencils, pens, crayons and markers', category: 'School supplies', details: 'Unopened packs.', accepted_conditions: ['New'], max_per_donation: 100, target_quantity: 200, sort_order: 30 },
  { name: 'Socks and underwear (kids sizes)', category: 'Clothing', details: 'New in the package only.', accepted_conditions: ['New'], max_per_donation: 50, target_quantity: 100, sort_order: 40 },
  { name: 'Coats, hats and gloves (kids sizes)', category: 'Coats and winter gear', details: 'Clean, with working zippers and buttons.', accepted_conditions: ['New', 'Like new'], max_per_donation: 20, target_quantity: 50, sort_order: 50 },
  { name: 'Deodorant, toothbrushes and toothpaste', category: 'Hygiene and personal care', details: 'Unopened only.', accepted_conditions: ['New'], max_per_donation: 50, target_quantity: 100, sort_order: 60 },
  { name: 'Shoes (kids sizes)', category: 'Shoes', details: 'Clean pairs, no holes.', accepted_conditions: ['New', 'Like new'], max_per_donation: 20, target_quantity: 40, sort_order: 70 },
  { name: 'Books for kids and teens', category: 'Books', details: 'Complete, no torn or missing pages.', accepted_conditions: ['New', 'Like new', 'Gently used'], max_per_donation: 40, target_quantity: 100, sort_order: 80 },
];
