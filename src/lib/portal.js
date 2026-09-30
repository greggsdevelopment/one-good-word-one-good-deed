import { base44 } from '@/api/base44Client';

/* ------------------------------------------------------------------ server */

export const portalKey = (schoolId) => ['portal', schoolId];

function portalError(err) {
  const data = err?.response?.data || err?.data || null;
  const e = new Error(data?.message || 'Something went wrong. Check your connection and try again.');
  e.code = data?.error || 'network';
  e.status = err?.response?.status || 0;
  e.field = data?.field || null;
  return e;
}

/** Calls the schoolPortal function. Throws an Error with a readable message. */
export async function callPortal(action, payload = {}) {
  let res;
  try {
    res = await base44.functions.invoke('schoolPortal', { action, ...payload });
  } catch (err) {
    throw portalError(err);
  }
  const data = res?.data ?? res;
  if (!data?.success) throw portalError({ data });
  return data;
}

/** Admin only: emails a school's portal members about something new. */
export async function notifySchool(kind, schoolId, extra = {}) {
  try {
    const res = await base44.functions.invoke('portalNotify', { kind, school_id: schoolId, ...extra });
    return res?.data ?? res;
  } catch (err) {
    throw portalError(err);
  }
}

/** Uploads a file privately and returns { file_uri, file_name }. */
export async function uploadPrivate(file) {
  if (!file) throw new Error('Choose a file first.');
  if (file.size > 20 * 1024 * 1024) throw new Error('That file is over 20 MB. Please send a smaller copy.');
  try {
    const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
    return { file_uri, file_name: file.name };
  } catch (err) {
    throw portalError(err);
  }
}

/* ------------------------------------------------------------------ money */

export const money = (n) =>
  `$${(Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const money0 = (n) => `$${Math.round(Number(n) || 0).toLocaleString('en-US')}`;
export const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

export function detroitToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function invoiceSubtotal(inv) {
  const items = Array.isArray(inv?.line_items) ? inv.line_items : [];
  return round2(items.reduce((s, i) => s + (Number(i?.quantity) || 0) * (Number(i?.unit_price) || 0), 0));
}

export function invoiceTotal(inv) {
  if (inv && inv.total != null && inv.total !== '' && Number.isFinite(Number(inv.total))) return round2(Number(inv.total));
  return round2(Math.max(0, invoiceSubtotal(inv) - (Number(inv?.discount) || 0)));
}

/** Same rules as the server: paid / partial / sent / overdue / draft / void. */
export function withBalance(inv, payments, today = detroitToday()) {
  const mine = (payments || []).filter((p) => p.invoice_id === inv.id);
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

export const INVOICE_STATE = {
  draft: { label: 'Draft', tone: 'bg-white/10 text-cream/70', light: 'bg-ink/5 text-ash' },
  sent: { label: 'Due', tone: 'bg-rb-blue/15 text-rb-blue', light: 'bg-blue-100 text-blue-700' },
  partial: { label: 'Partly paid', tone: 'bg-rb-yellow/15 text-rb-yellow', light: 'bg-amber-100 text-amber-800' },
  overdue: { label: 'Overdue', tone: 'bg-rb-red/15 text-rb-red', light: 'bg-red-100 text-red-700' },
  paid: { label: 'Paid', tone: 'bg-rb-green/15 text-rb-green', light: 'bg-green-100 text-green-700' },
  void: { label: 'Void', tone: 'bg-white/10 text-cream/40 line-through', light: 'bg-ink/5 text-ash line-through' },
};

export const SESSION_KINDS = {
  assembly: 'Whole School Assembly',
  ten_second_lab: 'The 10 Second Lab',
  group_chat_check: 'Group Chat Check',
  ambassadors: 'Student Ambassadors',
  staff_pd: 'Staff PD',
  family_night: 'Family Night',
  survey: 'Student survey',
  planning_call: 'Planning call',
  other: 'Other',
};

export const SESSION_STATE = {
  proposed: { label: 'Proposed', tone: 'bg-rb-yellow/15 text-rb-yellow', light: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmed', tone: 'bg-rb-green/15 text-rb-green', light: 'bg-green-100 text-green-700' },
  completed: { label: 'Done', tone: 'bg-white/10 text-cream/60', light: 'bg-ink/5 text-ash' },
  cancelled: { label: 'Cancelled', tone: 'bg-rb-red/10 text-rb-red/80 line-through', light: 'bg-red-50 text-red-700 line-through' },
};

export const DOC_KINDS = {
  agreement: 'Agreement',
  quote: 'Quote',
  invoice: 'Invoice',
  w9: 'W-9',
  purchase_order: 'Purchase order',
  survey_report: 'Survey report',
  certificate: 'Certificate',
  photo_release: 'Photo release',
  other: 'Other',
};

export const BOOKING_STATUS = {
  new: 'Request received',
  pending: 'Request received',
  contacted: 'In conversation',
  quoted: 'Quote sent',
  po_received: 'PO received',
  confirmed: 'Scheduled',
  scheduled: 'Scheduled',
  delivered: 'Program delivered',
  invoiced: 'Invoiced',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

/** Booking quote lines (stored as JSON text) as invoice line items. */
export function parseLines(raw) {
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function bookingToInvoiceLines(booking) {
  return parseLines(booking?.line_items).map((l) => ({
    description: `${l.name || 'Program'}${l.detail ? ` (${l.detail})` : ''}`,
    quantity: 1,
    unit_price: Number(l.amount) || 0,
  }));
}

/** Next invoice number for the year: OGW-2026-0001, OGW-2026-0002... */
export function nextInvoiceNumber(invoices, year = new Date().getFullYear()) {
  const prefix = `OGW-${year}-`;
  const max = (invoices || []).reduce((m, i) => {
    const n = String(i.number || '').startsWith(prefix) ? Number(String(i.number).slice(prefix.length)) : 0;
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `${prefix}${String(max + 1).padStart(4, '0')}`;
}

export function addDays(iso, days) {
  const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ dates */

export function prettyDate(iso, opts = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!iso) return '';
  const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString('en-US', opts);
}

export function daysUntil(iso, today = detroitToday()) {
  if (!iso) return null;
  const a = new Date(`${today}T12:00:00`).getTime();
  const b = new Date(`${String(iso).slice(0, 10)}T12:00:00`).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** "9:00 AM" -> [9, 0]; falls back to null. */
function parseTime(t) {
  const m = String(t || '').trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] || 0);
  const ap = (m[3] || '').toLowerCase();
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return [h, min];
}

const pad = (n) => String(n).padStart(2, '0');

function icsStamp(date, time) {
  const d = String(date).slice(0, 10).replace(/-/g, '');
  const t = parseTime(time);
  return t ? `${d}T${pad(t[0])}${pad(t[1])}00` : null;
}

const icsText = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (m) => `\\${m}`);

/** An .ics calendar file for one session (floating local time, America/Detroit). */
export function sessionIcs(session, schoolName) {
  const start = icsStamp(session.date, session.start_time);
  const end = icsStamp(session.date, session.end_time) || start;
  const day = String(session.date).slice(0, 10).replace(/-/g, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OGWOGD//School Portal//EN',
    'BEGIN:VEVENT',
    `UID:${session.id}@ogwogd.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')}`,
    start ? `DTSTART;TZID=America/Detroit:${start}` : `DTSTART;VALUE=DATE:${day}`,
    start ? `DTEND;TZID=America/Detroit:${end}` : null,
    `SUMMARY:${icsText(`${session.title} (One Good Word...One Good Deed)`)}`,
    `LOCATION:${icsText([session.location, schoolName].filter(Boolean).join(', '))}`,
    `DESCRIPTION:${icsText([session.grades ? `Grades: ${session.grades}` : '', session.notes_for_school || ''].filter(Boolean).join('\n'))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

export function downloadText(filename, text, type = 'text/calendar') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Google Calendar "add event" link (opens outside the app). */
export function googleCalendarLink(session, schoolName) {
  const start = icsStamp(session.date, session.start_time);
  const end = icsStamp(session.date, session.end_time) || start;
  const day = String(session.date).slice(0, 10).replace(/-/g, '');
  const next = (() => {
    const d = new Date(`${String(session.date).slice(0, 10)}T12:00:00`);
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  })();
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${session.title} (One Good Word...One Good Deed)`,
    dates: start ? `${start}/${end}` : `${day}/${next}`,
    ctz: 'America/Detroit',
    location: [session.location, schoolName].filter(Boolean).join(', '),
    details: [session.grades ? `Grades: ${session.grades}` : '', session.notes_for_school || ''].filter(Boolean).join('\n'),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ------------------------------------------------------------------ PDF */

/** Builds and downloads an invoice PDF. jsPDF loads only when needed. */
export async function downloadInvoicePdf(inv, school) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const L = 54;
  let y = 64;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('INVOICE', L, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('One Good Word...One Good Deed LLC', W - L, y - 14, { align: 'right' });
  doc.text('Metro Detroit, Michigan', W - L, y, { align: 'right' });
  doc.text('greggsdevelopment@gmail.com  |  (734) 383-3865', W - L, y + 14, { align: 'right' });
  doc.text('ogwogd.org', W - L, y + 28, { align: 'right' });

  y += 48;
  doc.setDrawColor(200);
  doc.line(L, y, W - L, y);
  y += 24;

  const row = (label, value) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, L, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || ''), L + 90, y);
    y += 16;
  };
  row('Invoice #', inv.number);
  row('Issued', prettyDate(inv.issue_date, { month: 'long', day: 'numeric', year: 'numeric' }));
  if (inv.due_date) row('Due', prettyDate(inv.due_date, { month: 'long', day: 'numeric', year: 'numeric' }));
  if (inv.po_number) row('PO #', inv.po_number);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Bill to', L, y);
  doc.setFont('helvetica', 'normal');
  y += 16;
  const billTo = [
    school?.name,
    school?.billing_contact_name ? `Attn: ${school.billing_contact_name}` : null,
    school?.address,
    [school?.city, school?.state, school?.zip].filter(Boolean).join(', ').replace(/, (\d{5})/, ' $1'),
    school?.billing_email,
  ].filter(Boolean);
  billTo.forEach((l) => {
    doc.text(String(l), L, y);
    y += 14;
  });

  y += 18;
  doc.setFillColor(240, 240, 240);
  doc.rect(L, y - 12, W - 2 * L, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Description', L + 6, y + 2);
  doc.text('Qty', W - L - 190, y + 2, { align: 'right' });
  doc.text('Rate', W - L - 100, y + 2, { align: 'right' });
  doc.text('Amount', W - L - 6, y + 2, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  y += 24;
  for (const it of inv.line_items || []) {
    const lines = doc.splitTextToSize(String(it.description || ''), W - 2 * L - 220);
    doc.text(lines, L + 6, y);
    doc.text(String(it.quantity ?? ''), W - L - 190, y, { align: 'right' });
    doc.text(money(it.unit_price), W - L - 100, y, { align: 'right' });
    doc.text(money((Number(it.quantity) || 0) * (Number(it.unit_price) || 0)), W - L - 6, y, { align: 'right' });
    y += Math.max(18, lines.length * 13 + 5);
    if (y > 660) {
      doc.addPage();
      y = 64;
    }
  }
  doc.line(L, y - 6, W - L, y - 6);
  y += 10;
  const totalRow = (label, value, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(label, W - L - 120, y, { align: 'right' });
    doc.text(value, W - L - 6, y, { align: 'right' });
    y += 16;
  };
  totalRow('Subtotal', money(invoiceSubtotal(inv)));
  if (Number(inv.discount)) totalRow('Discount', `-${money(inv.discount)}`);
  totalRow('Total', money(inv.total ?? invoiceTotal(inv)), true);
  if (inv.paid != null) {
    totalRow('Paid', money(inv.paid));
    totalRow('Balance due', money(inv.balance), true);
  }

  y += 20;
  doc.setFontSize(9);
  const notes = [
    inv.notes,
    'Payment by check, ACH or purchase order. Checks payable to One Good Word...One Good Deed LLC.',
    'One Good Word...One Good Deed LLC is a Michigan LLC. Questions: greggsdevelopment@gmail.com or (734) 383-3865.',
  ].filter(Boolean);
  notes.forEach((n) => {
    const lines = doc.splitTextToSize(String(n), W - 2 * L);
    doc.text(lines, L, y);
    y += lines.length * 12 + 6;
  });
  doc.save(`${inv.number || 'invoice'}.pdf`);
}
