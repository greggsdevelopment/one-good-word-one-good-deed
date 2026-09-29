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
  'Baby and toddler',
  'Blankets and bedding',
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
// Kept to what a kid or a family in a rough spot actually uses, with the
// conditions strict enough that nobody can unload a closet on us.
const N = ['New'];
const NL = ['New', 'Like new'];
const NLG = ['New', 'Like new', 'Gently used'];
export const STARTER_NEEDS = [
  // Backpacks
  { name: 'Backpacks (kids and teen sizes)', category: 'Backpacks', details: 'Zippers and straps must work. No rips.', accepted_conditions: NL, max_per_donation: 20, target_quantity: 50, sort_order: 10 },

  // School supplies
  { name: 'Notebooks, folders and loose-leaf paper', category: 'School supplies', details: 'Unused.', accepted_conditions: N, max_per_donation: 100, target_quantity: 200, sort_order: 20 },
  { name: 'Pencils, pens, crayons, markers and colored pencils', category: 'School supplies', details: 'Unopened packs.', accepted_conditions: N, max_per_donation: 100, target_quantity: 200, sort_order: 21 },
  { name: 'Binders and pencil cases', category: 'School supplies', details: 'Clean. Binder rings must close.', accepted_conditions: NL, max_per_donation: 40, target_quantity: 80, sort_order: 22 },
  { name: 'Glue sticks, scissors, rulers, erasers and highlighters', category: 'School supplies', details: 'Unopened.', accepted_conditions: N, max_per_donation: 100, target_quantity: 150, sort_order: 23 },
  { name: 'Calculators (basic or scientific)', category: 'School supplies', details: 'Working, with the cover if it came with one.', accepted_conditions: NL, max_per_donation: 20, target_quantity: 30, sort_order: 24 },
  { name: 'Lunch boxes and water bottles', category: 'School supplies', details: 'New only, for hygiene.', accepted_conditions: N, max_per_donation: 30, target_quantity: 60, sort_order: 25 },
  { name: 'Headphones or earbuds for school', category: 'School supplies', details: 'New in package. Many schools require them.', accepted_conditions: N, max_per_donation: 20, target_quantity: 40, sort_order: 26 },

  // Clothing
  { name: 'Socks and underwear (kids sizes)', category: 'Clothing', details: 'New in the package only.', accepted_conditions: N, max_per_donation: 50, target_quantity: 100, sort_order: 30 },
  { name: 'Shirts, pants and sweatshirts (kids sizes)', category: 'Clothing', details: 'Clean, no stains, rips or missing buttons. Tell us the sizes.', accepted_conditions: NL, max_per_donation: 30, target_quantity: 100, sort_order: 31 },
  { name: 'School uniform polos and khakis (kids sizes)', category: 'Clothing', details: 'Clean, no stains. Tell us the sizes.', accepted_conditions: NL, max_per_donation: 20, target_quantity: 40, sort_order: 32 },
  { name: 'Pajamas (kids sizes)', category: 'Clothing', details: 'Clean, no stains. Tell us the sizes.', accepted_conditions: NL, max_per_donation: 20, target_quantity: 40, sort_order: 33 },

  // Shoes
  { name: 'Sneakers (kids sizes)', category: 'Shoes', details: 'Clean pairs, no holes, laces included. Tell us the sizes.', accepted_conditions: NL, max_per_donation: 20, target_quantity: 40, sort_order: 40 },
  { name: 'Winter boots (kids sizes)', category: 'Shoes', details: 'Clean, dry, soles intact. Tell us the sizes.', accepted_conditions: NL, max_per_donation: 20, target_quantity: 40, sort_order: 41 },

  // Coats and winter gear
  { name: 'Winter coats (kids sizes)', category: 'Coats and winter gear', details: 'Clean, zippers and buttons working. Tell us the sizes.', accepted_conditions: NL, max_per_donation: 20, target_quantity: 50, sort_order: 50 },
  { name: 'Hats, gloves and scarves', category: 'Coats and winter gear', details: 'Clean, no holes.', accepted_conditions: NL, max_per_donation: 50, target_quantity: 100, sort_order: 51 },

  // Hygiene and personal care
  { name: 'Deodorant, toothbrushes and toothpaste', category: 'Hygiene and personal care', details: 'Unopened only.', accepted_conditions: N, max_per_donation: 50, target_quantity: 100, sort_order: 60 },
  { name: 'Shampoo, conditioner, soap and body wash', category: 'Hygiene and personal care', details: 'Unopened only. Full size or travel size.', accepted_conditions: N, max_per_donation: 50, target_quantity: 100, sort_order: 61 },
  { name: 'Pads and tampons', category: 'Hygiene and personal care', details: 'Unopened boxes or packs.', accepted_conditions: N, max_per_donation: 50, target_quantity: 100, sort_order: 62 },
  { name: 'Hair brushes, combs and hair ties', category: 'Hygiene and personal care', details: 'New in package.', accepted_conditions: N, max_per_donation: 50, target_quantity: 100, sort_order: 63 },

  // Baby and toddler
  { name: 'Diapers and baby wipes', category: 'Baby and toddler', details: 'Unopened packs, any size. Tell us the size.', accepted_conditions: N, max_per_donation: 50, target_quantity: 100, sort_order: 70 },

  // Blankets and bedding
  { name: 'Blankets and throws', category: 'Blankets and bedding', details: 'New only.', accepted_conditions: N, max_per_donation: 20, target_quantity: 40, sort_order: 80 },

  // Books
  { name: 'Books for kids and teens', category: 'Books', details: 'Complete, no torn or missing pages.', accepted_conditions: NLG, max_per_donation: 40, target_quantity: 100, sort_order: 90 },

  // Toys and games
  { name: 'Toys for giveaways', category: 'Toys and games', details: 'New in package only. These go straight into treat bags and community giveaways.', accepted_conditions: N, max_per_donation: 30, target_quantity: 100, sort_order: 100 },
  { name: 'Board games and puzzles', category: 'Toys and games', details: 'All pieces included.', accepted_conditions: NL, max_per_donation: 10, target_quantity: 20, sort_order: 101 },
  { name: 'Sports balls and outdoor play gear', category: 'Toys and games', details: 'Clean and working. Balls must hold air.', accepted_conditions: NL, max_per_donation: 10, target_quantity: 20, sort_order: 102 },
];
