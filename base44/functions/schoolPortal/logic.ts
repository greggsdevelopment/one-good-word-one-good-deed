/** Pure helpers for schoolPortal (unit tested outside Base44). */

export const round2 = (n: number) => Math.round((Number(n) || 0) * 100) / 100;

export function invoiceSubtotal(inv: any): number {
  const items = Array.isArray(inv?.line_items) ? inv.line_items : [];
  return round2(items.reduce((s: number, i: any) => s + (Number(i?.quantity) || 0) * (Number(i?.unit_price) || 0), 0));
}

/** Amount due: stored total when set, otherwise items minus discount. */
export function invoiceTotal(inv: any): number {
  if (inv && inv.total != null && inv.total !== '' && Number.isFinite(Number(inv.total))) return round2(Number(inv.total));
  return round2(Math.max(0, invoiceSubtotal(inv) - (Number(inv?.discount) || 0)));
}

export function invoiceWithBalance(inv: any, payments: any[], today: string) {
  const mine = payments.filter((p) => p.invoice_id === inv.id);
  const paid = round2(mine.reduce((s, p) => s + (Number(p.amount) || 0), 0));
  const total = invoiceTotal(inv);
  const balance = round2(Math.max(0, total - paid));
  let state = inv.status || 'draft';
  if (state !== 'void' && state !== 'draft') {
    if (balance <= 0.004) state = 'paid';
    else if (paid > 0) state = 'partial';
    else state = 'sent';
    if (state !== 'paid' && inv.due_date && String(inv.due_date).slice(0, 10) < today) state = 'overdue';
  }
  return { ...inv, total, paid, balance, state, payments: mine };
}

// What school staff may see or change. Anything not listed never leaves the server.
export const SCHOOL_PUBLIC = ['id', 'name', 'district', 'school_type', 'address', 'city', 'state', 'zip', 'phone', 'grade_band', 'enrollment', 'billing_contact_name', 'billing_email', 'po_required', 'tax_exempt_id', 'w9_sent', 'status'];
export const SCHOOL_EDITABLE = ['phone', 'address', 'city', 'state', 'zip', 'billing_contact_name', 'billing_email', 'tax_exempt_id', 'enrollment'];
export const MEMBER_PUBLIC = ['id', 'name', 'title', 'email', 'phone', 'is_primary', 'status'];
export const SESSION_PUBLIC = ['id', 'booking_id', 'kind', 'title', 'date', 'start_time', 'end_time', 'location', 'grades', 'status', 'notes_for_school'];
export const BOOKING_PUBLIC = ['id', 'reference', 'status', 'grade_band', 'package_type', 'line_items', 'quoted_total', 'target_term', 'date_window_1', 'date_window_2', 'date_window_3', 'payment_route', 'po_number', 'created_date'];
export const INVOICE_PUBLIC = ['id', 'booking_id', 'number', 'issue_date', 'due_date', 'line_items', 'discount', 'total', 'po_number', 'status', 'notes', 'sent_at'];
export const PAYMENT_PUBLIC = ['id', 'invoice_id', 'amount', 'method', 'reference', 'received_date'];
export const DOC_PUBLIC = ['id', 'booking_id', 'title', 'kind', 'file_name', 'uploaded_by', 'created_date'];
export const TASK_PUBLIC = ['id', 'booking_id', 'title', 'owner', 'due_date', 'done', 'done_at'];
export const MESSAGE_PUBLIC = ['id', 'author', 'author_name', 'body', 'topic', 'read_by_school', 'read_by_ogwogd', 'created_date'];
export const SCHOOL_DOC_KINDS = ['purchase_order', 'agreement', 'photo_release', 'other'];

export function pick(obj: any, keys: string[]) {
  const out: Record<string, unknown> = {};
  for (const k of keys) if (obj && obj[k] !== undefined) out[k] = obj[k];
  return out;
}

export const clean = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);

export const oneLine = (v: unknown, max: number) => clean(v, max).replace(/\s+/g, ' ');

const EMAIL = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]{2,}$/;
export const isEmail = (v: unknown) => typeof v === 'string' && EMAIL.test(v.trim());
export const isId = (v: unknown) => typeof v === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(v);
export const isFileUri = (v: unknown) => typeof v === 'string' && v.length <= 400 && /^[\w\-./%@+=]+$/.test(v) && !v.includes('..');

/** Validates a school's edits to its own profile. */
export function schoolPatch(input: any): { ok: true; patch: Record<string, unknown> } | { ok: false; field: string; message: string } {
  const patch: Record<string, unknown> = {};
  for (const k of SCHOOL_EDITABLE) {
    if (input?.[k] === undefined) continue;
    if (k === 'enrollment') {
      const n = Number(input[k]);
      if (input[k] !== '' && (!Number.isFinite(n) || n < 0 || n > 20000)) return { ok: false, field: k, message: 'Enrollment should be a number.' };
      patch[k] = input[k] === '' ? null : Math.round(n);
      continue;
    }
    const v = oneLine(input[k], k === 'address' ? 200 : 120);
    if (k === 'billing_email' && v && !isEmail(v)) return { ok: false, field: k, message: 'That billing email does not look right.' };
    if (k === 'state' && v && !/^[A-Za-z]{2}$/.test(v)) return { ok: false, field: k, message: 'Use the two-letter state.' };
    if (k === 'zip' && v && !/^\d{5}(-\d{4})?$/.test(v)) return { ok: false, field: k, message: 'That ZIP code does not look right.' };
    patch[k] = k === 'state' ? v.toUpperCase() : v;
  }
  return { ok: true, patch };
}
