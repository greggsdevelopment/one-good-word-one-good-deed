import { format, parseISO, startOfDay } from 'date-fns';

export const partySize = (r) => (Number(r.adults_attending) || 0) + (Number(r.children_attending) || 0);

export function rsvpTotals(list) {
  return list.reduce(
    (t, r) => {
      const p = partySize(r);
      t.count += 1;
      t.adults += Number(r.adults_attending) || 0;
      t.children += Number(r.children_attending) || 0;
      t.headcount += p;
      if (r.checked_in) t.checkedIn += p;
      return t;
    },
    { count: 0, adults: 0, children: 0, headcount: 0, checkedIn: 0 }
  );
}

export const eventDay = (e) => (e.event_date ? startOfDay(parseISO(e.event_date)) : null);

export const isUpcoming = (e) => {
  const d = eventDay(e);
  return d && d >= startOfDay(new Date());
};

export const formatEventDate = (e) => (e.event_date ? format(parseISO(e.event_date), 'EEE, MMM d, yyyy') : 'No date');

export const formatSubmitted = (r) => (r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy h:mm a') : '');

const neutralize = (s) => (/^-?\d+(\.\d+)?$/.test(s) ? s : /^[=+\-@\t\r]/.test(s) ? `'${s}` : s);
const csvCell = (v) => `"${neutralize(String(v ?? '')).replace(/"/g, '""')}"`;

export function downloadRosterCsv(event, rsvps) {
  const headers = [
    'Event Title', 'Event Date', 'Full Name', 'Email', 'Phone', 'Adults', 'Children', 'Party Total',
    'Message', 'Submitted', 'Notification Sent At', 'Checked In', 'Checked In At', 'Admin Notes', 'RSVP ID',
  ];
  const rows = rsvps.map((r) => [
    event.title, event.event_date, r.full_name, r.email, r.phone, r.adults_attending ?? 0,
    r.children_attending ?? 0, partySize(r), r.message, r.created_date, r.notification_sent_at,
    r.checked_in ? 'Yes' : 'No', r.checked_in_at, r.admin_notes, r.id,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(event.title || 'event').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-rsvps.csv`;
  a.click();
  URL.revokeObjectURL(url);
}