import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export const GOFUNDME_URL = 'https://www.gofundme.com/f/support-one-good-word-one-good-deeds-mission';

// Keep these two lists in sync with base44/functions/submitItemDonation/entry.ts,
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

// Where pickups are measured from. The server uses the same point.
export const PICKUP_ORIGIN_LABEL = 'Westland, MI';

export const DEFAULT_DONATION_SETTINGS = {
  item_donations_enabled: true,
  pickup_enabled: true,
  money_donations_enabled: true,
  pickup_radius_miles: 50,
  needs: [
    'Backpacks',
    'Notebooks, folders, pencils and pens',
    'New socks and underwear (kids sizes)',
    'Coats, hats and gloves',
    'Deodorant, toothbrushes and other hygiene items',
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

export const DONATION_SETTINGS_KEY = ['donation-settings'];

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
