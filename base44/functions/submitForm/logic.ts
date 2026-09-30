// Pure validation for submitForm. No network, no SDK, so it can be tested alone.
//
// Every public form on the site is described here: which fields a visitor may
// set, how long each may be, which are required, and which admin-only fields
// get forced to a safe value no matter what the browser sends.

type Spec =
  | { t: 'str'; max: number; req?: boolean }
  | { t: 'email'; req?: boolean }
  | { t: 'int'; min: number; max: number; req?: boolean }
  | { t: 'num'; min: number; max: number }
  | { t: 'bool' }
  | { t: 'date' }
  | { t: 'json_list'; max: number };

export type FormDef = {
  entity: string;
  fields: Record<string, Spec>;
  forced?: Record<string, unknown>;
  /** Field holding the submitter's email, used for per-person rate limits. */
  emailField?: string;
  /** Max submissions from the same email in the window. */
  perEmail?: number;
  /** Max submissions of this form from everyone combined in the window. */
  global: number;
  /** Silently succeed instead of creating a second record for the same email. */
  dedupeByEmail?: boolean;
};

export const WINDOW_MINUTES = 10;
export const MAX_BODY_BYTES = 60_000;

const s = (max: number, req = false): Spec => ({ t: 'str', max, req });
const email = (req = true): Spec => ({ t: 'email', req });

export const FORMS: Record<string, FormDef> = {
  pledge: {
    entity: 'Pledge',
    fields: { first_name: s(40, true), last_initial: s(1), city: s(60), pledge_statement: s(500) },
    forced: { approved: false },
    global: 30,
  },
  contact: {
    entity: 'ContactMessage',
    fields: { name: s(100, true), email: email(), subject: s(150), message: s(4000, true) },
    forced: { read: false, replied: false },
    emailField: 'email',
    perEmail: 3,
    global: 40,
  },
  prayer: {
    entity: 'ContactMessage',
    fields: { name: s(100), message: s(4000, true) },
    // Prayer requests never carry a real reply address unless one is added later.
    forced: { subject: 'Prayer Request', email: 'prayer@request.org', read: false, replied: false },
    global: 20,
  },
  newsletter: {
    entity: 'NewsletterSubscriber',
    fields: { email: email() },
    emailField: 'email',
    dedupeByEmail: true,
    global: 60,
  },
  resource: {
    entity: 'ResourceSuggestion',
    fields: { name: s(150, true), phone: s(40), website: s(300), category: s(60), notes: s(2000) },
    forced: { status: 'new' },
    global: 20,
  },
  sponsorship: {
    entity: 'SponsorshipApplication',
    fields: {
      business_name: s(150, true), contact_person: s(120, true), email: email(), phone: s(40), website: s(300),
      city: s(100), sponsorship_level: s(150), funding_focus: s(200), school_of_interest: s(200), in_kind: s(500),
      message: s(4000),
    },
    forced: { status: 'new', read: false },
    emailField: 'email',
    perEmail: 3,
    global: 20,
  },
  rsvp: {
    entity: 'EventRSVP',
    fields: {
      event_id: s(64, true), full_name: s(120, true), email: email(), phone: s(40),
      adults_attending: { t: 'int', min: 0, max: 20 }, children_attending: { t: 'int', min: 0, max: 30 }, message: s(1000),
    },
    forced: { checked_in: false },
    emailField: 'email',
    perEmail: 3,
    global: 60,
  },
  booking: {
    entity: 'BookingRequest',
    fields: {
      school_name: s(200, true), contact_name: s(120, true), email: email(), phone: s(40), preferred_date: { t: 'date' },
      num_students: { t: 'int', min: 0, max: 10000 }, message: s(4000), grade_band: s(40), school_type: s(40),
      district: s(150), principal_name: s(120), contact_role: s(100), package_type: s(40),
      line_items: { t: 'json_list', max: 6000 }, quoted_total: { t: 'num', min: 0, max: 100000 }, target_term: s(60),
      date_window_1: { t: 'date' }, date_window_2: { t: 'date' }, date_window_3: { t: 'date' }, payment_route: s(40),
      po_number: s(60), billing_contact_name: s(120), billing_contact_email: email(false), needs_w9: { t: 'bool' },
    },
    forced: { status: 'new' },
    emailField: 'email',
    perEmail: 3,
    global: 20,
  },
};

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

function clean(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

export type Result = { ok: true; record: Record<string, unknown> } | { ok: false; field: string | null; message: string };

const pretty = (field: string) => field.replace(/_/g, ' ');

export function validate(formKey: string, data: any): Result {
  const def = FORMS[formKey];
  if (!def) return { ok: false, field: null, message: 'Unknown form.' };
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, field: null, message: 'Nothing was submitted.' };

  const record: Record<string, unknown> = {};
  for (const [field, spec] of Object.entries(def.fields)) {
    const raw = data[field];
    const empty = raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '');

    switch (spec.t) {
      case 'str': {
        const v = clean(raw, spec.max);
        if (spec.req && !v) return { ok: false, field, message: `Please fill in ${pretty(field)}.` };
        if (v) record[field] = v;
        break;
      }
      case 'email': {
        const v = clean(raw, 200).toLowerCase();
        if (!v) {
          if (spec.req) return { ok: false, field, message: 'Please add your email address.' };
          break;
        }
        if (!EMAIL_RE.test(v)) return { ok: false, field, message: 'Please add a valid email address.' };
        record[field] = v;
        break;
      }
      case 'int': {
        if (empty) {
          if (spec.req) return { ok: false, field, message: `Please fill in ${pretty(field)}.` };
          break;
        }
        const n = Number(raw);
        if (!Number.isInteger(n) || n < spec.min || n > spec.max) {
          return { ok: false, field, message: `${pretty(field)} must be a whole number from ${spec.min} to ${spec.max}.` };
        }
        record[field] = n;
        break;
      }
      case 'num': {
        if (empty) break;
        const n = Number(raw);
        if (!Number.isFinite(n) || n < spec.min || n > spec.max) return { ok: false, field, message: `${pretty(field)} is out of range.` };
        record[field] = Math.round(n * 100) / 100;
        break;
      }
      case 'bool':
        if (!empty) record[field] = raw === true || raw === 'true';
        break;
      case 'date': {
        if (empty) break;
        const v = clean(raw, 40);
        if (!/^\d{4}-\d{2}-\d{2}/.test(v) || Number.isNaN(Date.parse(v))) return { ok: false, field, message: `${pretty(field)} is not a valid date.` };
        record[field] = v.slice(0, 10);
        break;
      }
      case 'json_list': {
        if (empty) break;
        const str = typeof raw === 'string' ? raw : JSON.stringify(raw);
        if (str.length > spec.max) return { ok: false, field, message: `${pretty(field)} is too long.` };
        try {
          const parsed = JSON.parse(str);
          if (!Array.isArray(parsed)) throw new Error('not a list');
          record[field] = JSON.stringify(parsed);
        } catch {
          return { ok: false, field, message: `${pretty(field)} could not be read.` };
        }
        break;
      }
    }
  }

  // Anything not listed above (status, approved, read, checked_in, notes...)
  // is dropped, then admin-only fields are pinned to safe values.
  Object.assign(record, def.forced || {});
  return { ok: true, record };
}

/** True when the newest `limit` records all landed inside the window. */
export function overLimit(createdDates: string[], limit: number, now = Date.now()): boolean {
  if (!limit) return false;
  const cutoff = now - WINDOW_MINUTES * 60_000;
  return createdDates.filter((d) => d && Date.parse(d) >= cutoff).length >= limit;
}

export function bookingReference(now = Date.now()): string {
  const rand = Math.floor(Math.random() * 36 ** 3).toString(36).toUpperCase().padStart(3, '0');
  return `OGW-B-${now.toString(36).toUpperCase()}${rand}`;
}
