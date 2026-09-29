// Pure helpers for submitItemDonation. No network, no SDK, so they can be
// tested on their own.

// Keep in sync with src/lib/donations.js
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

// Westland City Hall, 36300 Warren Rd, Westland, MI 48185, as matched by the
// US Census geocoder. Pickup distance is measured from here.
export const ORIGIN = { lat: 42.338765661869, lng: -83.395465437616, label: 'Westland, MI' };

export const DEFAULT_RADIUS_MILES = 50;
export const MAX_ITEMS = 25;
export const MAX_QUANTITY = 1000;

export function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.7613; // mean Earth radius in miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function clean(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

export type Item = { category: string; description: string; quantity: number; condition: string };
export type Submission = {
  donor_name: string;
  email: string;
  phone: string;
  delivery_method: 'pickup' | 'dropoff';
  address_line: string;
  city: string;
  state: string;
  zip: string;
  pickup_window: string;
  notes: string;
  items: Item[];
};

export type ValidationResult = { ok: true; value: Submission } | { ok: false; field: string; message: string };

export function validateSubmission(body: any, opts: { pickupEnabled: boolean }): ValidationResult {
  const donor_name = clean(body?.donor_name, 120);
  const email = clean(body?.email, 200).toLowerCase();
  const phone = clean(body?.phone, 40);
  const delivery_method = body?.delivery_method === 'pickup' ? 'pickup' : body?.delivery_method === 'dropoff' ? 'dropoff' : '';
  const address_line = clean(body?.address_line, 200);
  const city = clean(body?.city, 100);
  const state = clean(body?.state || 'MI', 40);
  const zip = clean(body?.zip, 10);
  const pickup_window = clean(body?.pickup_window, 300);
  const notes = clean(body?.notes, 2000);

  if (!donor_name) return { ok: false, field: 'donor_name', message: 'Please add your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, field: 'email', message: 'Please add a valid email address.' };
  }
  if (!delivery_method) return { ok: false, field: 'delivery_method', message: 'Choose pickup or drop-off.' };
  if (delivery_method === 'pickup' && !opts.pickupEnabled) {
    return { ok: false, field: 'delivery_method', message: 'Pickups are paused right now. Please choose drop-off.' };
  }
  if (delivery_method === 'pickup') {
    if (phone.replace(/\D/g, '').length < 10) {
      return { ok: false, field: 'phone', message: 'We need a phone number to coordinate a pickup.' };
    }
    if (!address_line) return { ok: false, field: 'address_line', message: 'Please add the pickup street address.' };
    if (!city) return { ok: false, field: 'city', message: 'Please add the city.' };
    if (!/^\d{5}(-\d{4})?$/.test(zip)) return { ok: false, field: 'zip', message: 'Please add a 5 digit ZIP code.' };
  }

  const rawItems = Array.isArray(body?.items) ? body.items : [];
  if (rawItems.length === 0) return { ok: false, field: 'items', message: 'Add at least one item.' };
  if (rawItems.length > MAX_ITEMS) {
    return { ok: false, field: 'items', message: `Please list ${MAX_ITEMS} lines or fewer. Put the rest in the notes.` };
  }
  const items: Item[] = [];
  for (const raw of rawItems) {
    const category = clean(raw?.category, 60);
    const description = clean(raw?.description, 200);
    const condition = clean(raw?.condition, 30) || 'New';
    const quantity = Number(raw?.quantity);
    if (!ITEM_CATEGORIES.includes(category)) {
      return { ok: false, field: 'items', message: 'Pick a category for every item.' };
    }
    if (!ITEM_CONDITIONS.includes(condition)) {
      return { ok: false, field: 'items', message: 'Pick a condition for every item.' };
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { ok: false, field: 'items', message: `Quantities must be whole numbers from 1 to ${MAX_QUANTITY}.` };
    }
    if (category === 'Other' && !description) {
      return { ok: false, field: 'items', message: 'Tell us what the "Other" items are.' };
    }
    items.push({ category, description, quantity, condition });
  }

  return {
    ok: true,
    value: {
      donor_name,
      email,
      phone,
      delivery_method,
      address_line: delivery_method === 'pickup' ? address_line : '',
      city: delivery_method === 'pickup' ? city : '',
      state: delivery_method === 'pickup' ? state : '',
      zip: delivery_method === 'pickup' ? zip : '',
      pickup_window,
      notes,
      items,
    },
  };
}

export function radiusFrom(settings: any): number {
  const r = Number(settings?.pickup_radius_miles);
  return Number.isFinite(r) && r > 0 && r <= 500 ? r : DEFAULT_RADIUS_MILES;
}

export function safeHeader(value: unknown): string {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

export function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function emailBody(record: any): string {
  const lines: (string | null)[] = [
    'A new item donation offer came in through ogwogd.org/donate.',
    '',
    `Donor: ${record.donor_name}`,
    `Email: ${record.email}`,
    record.phone ? `Phone: ${record.phone}` : null,
    `Method: ${record.delivery_method === 'pickup' ? 'Pickup' : 'Drop-off'}`,
    record.delivery_method === 'pickup'
      ? `Address: ${record.matched_address || [record.address_line, record.city, record.state, record.zip].join(', ')}`
      : null,
    record.distance_miles != null ? `Distance from Westland: ${record.distance_miles} miles` : null,
    record.pickup_window ? `Best time: ${record.pickup_window}` : null,
    '',
    'Items:',
    ...record.items.map(
      (i: Item) => `  ${i.quantity} x ${i.category}${i.description ? ` (${i.description})` : ''}, ${i.condition}`,
    ),
    record.notes ? '' : null,
    record.notes ? `Notes: ${record.notes}` : null,
    '',
    'Manage it in the Admin Dashboard under Donations.',
  ];
  return lines.filter((l) => l !== null).join('\r\n');
}
