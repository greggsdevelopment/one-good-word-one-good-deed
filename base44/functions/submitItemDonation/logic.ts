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
  'Baby and toddler',
  'Blankets and bedding',
  'Books',
  'Toys and games',
  'Other',
];
export const ITEM_CONDITIONS = ['New', 'Like new', 'Gently used'];

// Westland City Hall, 36300 Warren Rd, Westland, MI 48185, as matched by the
// US Census geocoder. Pickup distance is measured from here.
export const ORIGIN = { lat: 42.338765661869, lng: -83.395465437616, label: 'Westland, MI' };

export const DEFAULT_RADIUS_MILES = 50;
export const MAX_LINES = 25;
export const MAX_QUANTITY = 1000;
export const OTHER_NEED_ID = 'other';

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

export type Need = {
  id: string;
  name: string;
  category: string;
  status?: string;
  accepted_conditions?: string[];
  max_per_donation?: number | null;
};

export type Item = {
  need_id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  condition: string;
};

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

export type ValidationOptions = {
  pickupEnabled: boolean;
  allowOther: boolean;
  needs: Need[];
};

/** Conditions a need accepts. An empty or missing list means new only. */
export function conditionsFor(need: Need): string[] {
  const list = Array.isArray(need.accepted_conditions)
    ? need.accepted_conditions.filter((c) => ITEM_CONDITIONS.includes(c))
    : [];
  return list.length ? list : ['New'];
}

export function capFor(need: Need): number {
  const cap = Number(need.max_per_donation);
  return Number.isFinite(cap) && cap > 0 ? Math.min(Math.trunc(cap), MAX_QUANTITY) : MAX_QUANTITY;
}

function validateItems(rawItems: any[], opts: ValidationOptions): { ok: true; items: Item[] } | { ok: false; message: string } {
  if (rawItems.length === 0) return { ok: false, message: 'Add at least one item.' };
  if (rawItems.length > MAX_LINES) {
    return { ok: false, message: `Please list ${MAX_LINES} lines or fewer. Put the rest in the notes.` };
  }

  const byId = new Map<string, Need>();
  for (const n of opts.needs || []) if (n && n.id) byId.set(String(n.id), n);

  // Merge repeated lines for the same need so a cap cannot be dodged by
  // splitting one item across several rows.
  const merged = new Map<string, Item>();
  const others: Item[] = [];

  for (const raw of rawItems) {
    const needId = clean(raw?.need_id, 64);
    const description = clean(raw?.description, 200);
    const condition = clean(raw?.condition, 30);
    const quantity = Number(raw?.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, message: 'Quantities must be whole numbers of 1 or more.' };
    }
    if (!ITEM_CONDITIONS.includes(condition)) {
      return { ok: false, message: 'Pick a condition for every item.' };
    }

    if (needId === OTHER_NEED_ID) {
      if (!opts.allowOther) {
        return { ok: false, message: 'Right now we can only take items from our list. Please pick from the list.' };
      }
      if (!description) return { ok: false, message: 'Tell us what the item not on the list is.' };
      if (quantity > MAX_QUANTITY) return { ok: false, message: `Quantities must be ${MAX_QUANTITY} or fewer.` };
      others.push({ need_id: OTHER_NEED_ID, name: description, category: 'Other', description, quantity, condition });
      continue;
    }

    const need = byId.get(needId);
    if (!need) {
      return { ok: false, message: 'One of those items is no longer on our list. Refresh the page and try again.' };
    }
    const status = need.status || 'open';
    if (status === 'full') {
      return { ok: false, message: `We are covered on ${need.name} right now, thank you. Please remove it from your offer.` };
    }
    if (status !== 'open') {
      return { ok: false, message: `We are not taking ${need.name} right now. Please remove it from your offer.` };
    }
    const allowed = conditionsFor(need);
    if (!allowed.includes(condition)) {
      return {
        ok: false,
        message: `For ${need.name} we can only take: ${allowed.join(', ').toLowerCase()}.`,
      };
    }

    const existing = merged.get(need.id);
    const total = (existing?.quantity || 0) + quantity;
    const cap = capFor(need);
    if (total > cap) {
      return { ok: false, message: `We can take up to ${cap} ${need.name.toLowerCase()} per donation. Please lower the quantity.` };
    }
    if (existing) {
      existing.quantity = total;
      if (description && !existing.description.includes(description)) {
        existing.description = [existing.description, description].filter(Boolean).join('; ');
      }
      // Keep the lower condition so we never overstate what is coming.
      if (ITEM_CONDITIONS.indexOf(condition) > ITEM_CONDITIONS.indexOf(existing.condition)) existing.condition = condition;
    } else {
      merged.set(need.id, {
        need_id: need.id,
        name: String(need.name || '').slice(0, 120),
        category: ITEM_CATEGORIES.includes(need.category) ? need.category : 'Other',
        description,
        quantity,
        condition,
      });
    }
  }

  return { ok: true, items: [...merged.values(), ...others] };
}

export function validateSubmission(body: any, opts: ValidationOptions): ValidationResult {
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

  const itemsResult = validateItems(Array.isArray(body?.items) ? body.items : [], opts);
  if (!itemsResult.ok) return { ok: false, field: 'items', message: itemsResult.message };

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
      items: itemsResult.items,
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
  const offList = (record.items || []).some((i: Item) => i.need_id === OTHER_NEED_ID);
  const lines: (string | null)[] = [
    'A new item donation offer came in through ogwogd.org/donate.',
    offList ? 'It includes something NOT on the needs list. Look before you say yes.' : null,
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
    ...(record.items || []).map(
      (i: Item) =>
        `  ${i.quantity} x ${i.name}${i.need_id === OTHER_NEED_ID ? ' [NOT ON LIST]' : ''}${
          i.description && i.description !== i.name ? ` (${i.description})` : ''
        }, ${i.condition}`,
    ),
    record.notes ? '' : null,
    record.notes ? `Notes: ${record.notes}` : null,
    '',
    'Nothing is promised to the donor yet. Accept, schedule or decline it in the Admin Dashboard under Donations.',
  ];
  return lines.filter((l) => l !== null).join('\r\n');
}
