import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft, CalendarDays, Check, ClipboardList, Download, ExternalLink, Eye, EyeOff, FileText, Mail, MessageSquare, Pencil, Plus,
  Receipt, Send, Star, Trash2, Upload, UserPlus, Users,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdminData, useEntityOps } from '@/lib/adminData';
import {
  BOOKING_STATUS, DOC_KINDS, INVOICE_STATE, SESSION_KINDS, SESSION_STATE, addDays, bookingToInvoiceLines, callPortal, detroitToday,
  downloadInvoicePdf, invoiceSubtotal, money, nextInvoiceNumber, notifySchool, prettyDate, round2, uploadPrivate, withBalance,
} from '@/lib/portal';

const label = 'font-barlow-condensed text-xs uppercase tracking-wider text-ash block mb-1';
const selectCls = 'w-full h-10 rounded-md border border-input bg-white px-3 text-sm';
const card = 'bg-white border border-ink/10 rounded-sm p-4 sm:p-5';
const h3 = 'font-barlow-condensed font-bold uppercase tracking-wider text-sm text-ink flex items-center gap-2';

const fail = (what) => (err) => toast.error(`Could not ${what}`, { description: err?.message || 'Try again.' });

async function tell(kind, schoolId, extra, doneText) {
  try {
    const r = await notifySchool(kind, schoolId, extra);
    if (r?.sent) toast.success(doneText, { description: `Emailed ${r.sent} ${r.sent === 1 ? 'person' : 'people'} at the school.` });
    else toast.success(doneText, { description: r?.message || 'No one is on the portal yet, so no email went out.' });
  } catch (err) {
    toast.warning(`${doneText}, but the email did not send`, { description: err.message });
  }
}

/* ------------------------------------------------------------------ profile + team */

const PROFILE_FIELDS = [
  ['name', 'School name'], ['district', 'District'], ['address', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP'],
  ['phone', 'Office phone'], ['enrollment', 'Enrollment'], ['billing_contact_name', 'Billing contact'], ['billing_email', 'Billing email'], ['tax_exempt_id', 'Tax exempt #'],
];

function ProfileSection({ school, members, bookings, allBookings }) {
  const schools = useEntityOps('schools');
  const memberOps = useEntityOps('schoolMembers');
  const bookingOps = useEntityOps('bookings');
  const [form, setForm] = useState(school);
  const [saving, setSaving] = useState(false);
  const [add, setAdd] = useState({ name: '', email: '', title: '', phone: '', is_primary: members.length === 0 });
  const [adding, setAdding] = useState(false);
  const [linkId, setLinkId] = useState('');
  useEffect(() => setForm(school), [school.id]);  

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const patch = {};
    for (const [k] of PROFILE_FIELDS) patch[k] = k === 'enrollment' ? (form[k] === '' || form[k] == null ? null : Number(form[k])) : form[k] ?? '';
    Object.assign(patch, { status: form.status || 'active', school_type: form.school_type || '', grade_band: form.grade_band || '', po_required: Boolean(form.po_required), w9_sent: Boolean(form.w9_sent), admin_notes: form.admin_notes || '' });
    try {
      await schools.update(school.id, patch);
      toast.success('School saved');
    } catch (err) {
      fail('save')(err);
    } finally {
      setSaving(false);
    }
  };

  const invite = async (member) => {
    try {
      try {
        await base44.users.inviteUser(member.email, 'user');
      } catch (err) {
        // Already has an account: they can sign in as is. Anything else, report it.
        if (!/exist|already/i.test(String(err?.response?.data?.message || err?.message || ''))) throw err;
      }
      await memberOps.update(member.id, { status: 'invited', invited_at: new Date().toISOString() });
      await tell('invite', school.id, { member_id: member.id }, `Invited ${member.name || member.email}`);
    } catch (err) {
      fail('send the invite')(err);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    const email = add.email.trim().toLowerCase();
    if (!add.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast.error('Add a name and a valid email');
    if (members.some((m) => m.email === email && m.status !== 'removed')) return toast.error('That email is already on this school');
    setAdding(true);
    try {
      if (add.is_primary) for (const m of members.filter((x) => x.is_primary)) await memberOps.update(m.id, { is_primary: false });
      const m = await memberOps.create({ school_id: school.id, name: add.name.trim(), email, title: add.title.trim(), phone: add.phone.trim(), is_primary: add.is_primary, status: 'invited' });
      await invite(m);
      setAdd({ name: '', email: '', title: '', phone: '', is_primary: false });
    } catch (err) {
      fail('add them')(err);
    } finally {
      setAdding(false);
    }
    return undefined;
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const linkable = allBookings.filter((b) => !b.school_id);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <form onSubmit={save} className={`${card} space-y-3`}>
        <p className={h3}>School details</p>
        <div className="grid grid-cols-2 gap-3">
          {PROFILE_FIELDS.map(([k, l]) => (
            <div key={k} className={k === 'name' || k === 'address' || k === 'billing_email' ? 'col-span-2' : ''}>
              <span className={label}>{l}</span>
              <Input value={form[k] ?? ''} onChange={set(k)} />
            </div>
          ))}
          <div>
            <span className={label}>Status</span>
            <select value={form.status || 'active'} onChange={set('status')} className={selectCls}>
              {['prospect', 'active', 'past'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <span className={label}>Type</span>
            <select value={form.school_type || ''} onChange={set('school_type')} className={selectCls}>
              <option value="">Not set</option>
              {['public', 'charter', 'private', 'faith', 'other'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 font-barlow text-sm"><input type="checkbox" checked={Boolean(form.po_required)} onChange={set('po_required')} /> District needs a purchase order before service</label>
        <label className="flex items-center gap-2 font-barlow text-sm"><input type="checkbox" checked={Boolean(form.w9_sent)} onChange={set('w9_sent')} /> We sent our W-9</label>
        <div>
          <span className={label}>Private notes (never shown to the school)</span>
          <Textarea rows={3} value={form.admin_notes || ''} onChange={set('admin_notes')} />
        </div>
        <Button type="submit" disabled={saving} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">{saving ? 'Saving...' : 'Save school'}</Button>
      </form>

      <div className="space-y-4">
        <div className={card}>
          <p className={h3}><Users className="w-4 h-4" /> Portal access</p>
          <ul className="mt-2 divide-y divide-ink/5">
            {members.filter((m) => m.status !== 'removed').map((m) => (
              <li key={m.id} className="py-2.5 flex flex-wrap items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-barlow text-ink flex items-center gap-1.5">
                    {m.name || m.email}
                    {m.is_primary && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                  </p>
                  <p className="font-barlow text-xs text-ash truncate">{[m.title, m.email, m.phone].filter(Boolean).join(' · ')}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-barlow-condensed uppercase tracking-wider ${m.status === 'active' ? 'bg-green-100 text-green-700' : m.status === 'requested' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                  {m.status === 'requested' ? 'asked for access' : m.status}
                </span>
                {m.status !== 'active' && (
                  <Button size="sm" variant="outline" onClick={() => invite(m)} className="h-8 font-barlow-condensed uppercase tracking-wider text-xs">
                    <Send className="w-3.5 h-3.5 mr-1" /> {m.status === 'requested' ? 'Approve and invite' : 'Resend invite'}
                  </Button>
                )}
                {!m.is_primary && m.status !== 'requested' && (
                  <Button size="sm" variant="ghost" title="Make main contact" onClick={async () => {
                    try {
                      for (const x of members.filter((y) => y.is_primary)) await memberOps.update(x.id, { is_primary: false });
                      await memberOps.update(m.id, { is_primary: true });
                    } catch (err) { fail('update')(err); }
                  }} className="h-8 px-2"><Star className="w-4 h-4" /></Button>
                )}
                <Button size="sm" variant="ghost" title="Remove access" onClick={() => memberOps.update(m.id, { status: 'removed', is_primary: false }).then(() => toast.success('Access removed')).catch(fail('remove access'))} className="h-8 px-2 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
            {!members.some((m) => m.status !== 'removed') && <li className="py-3 font-barlow text-sm text-ash">No one yet. Invite the principal below.</li>}
          </ul>
          <form onSubmit={addMember} className="mt-3 pt-3 border-t border-ink/5 grid grid-cols-2 gap-2">
            <p className={`${h3} col-span-2`}><UserPlus className="w-4 h-4" /> Invite someone</p>
            <Input placeholder="Name" value={add.name} onChange={(e) => setAdd((a) => ({ ...a, name: e.target.value }))} />
            <Input placeholder="Title" value={add.title} onChange={(e) => setAdd((a) => ({ ...a, title: e.target.value }))} />
            <Input placeholder="Work email" type="email" value={add.email} onChange={(e) => setAdd((a) => ({ ...a, email: e.target.value }))} />
            <Input placeholder="Phone" value={add.phone} onChange={(e) => setAdd((a) => ({ ...a, phone: e.target.value }))} />
            <label className="col-span-2 flex items-center gap-2 font-barlow text-sm"><input type="checkbox" checked={add.is_primary} onChange={(e) => setAdd((a) => ({ ...a, is_primary: e.target.checked }))} /> Main contact</label>
            <Button type="submit" disabled={adding} className="col-span-2 bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">{adding ? 'Inviting...' : 'Invite to the portal'}</Button>
            <p className="col-span-2 font-barlow text-xs text-ash">They get a Base44 invitation plus a note from you explaining the portal. They sign up with this exact email.</p>
          </form>
        </div>

        <div className={card}>
          <p className={h3}><ClipboardList className="w-4 h-4" /> Bookings</p>
          <ul className="mt-2 divide-y divide-ink/5">
            {bookings.map((b) => (
              <li key={b.id} className="py-2 flex items-center gap-2 font-barlow text-sm">
                <span className="flex-1 min-w-0 truncate">{b.reference || 'Booking'} · {b.contact_name} · {b.target_term || ''} {b.quoted_total ? `· ${money(b.quoted_total)}` : ''}</span>
                <span className="rounded-full bg-ink/5 text-ash px-2 py-0.5 text-[10px] font-barlow-condensed uppercase tracking-wider">{BOOKING_STATUS[b.status] || b.status}</span>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => bookingOps.update(b.id, { school_id: '' }).catch(fail('unlink'))}>Unlink</Button>
              </li>
            ))}
            {!bookings.length && <li className="py-2 font-barlow text-sm text-ash">No bookings linked.</li>}
          </ul>
          {linkable.length > 0 && (
            <div className="mt-2 flex gap-2">
              <select value={linkId} onChange={(e) => setLinkId(e.target.value)} className={selectCls}>
                <option value="">Link another booking...</option>
                {linkable.map((b) => <option key={b.id} value={b.id}>{b.school_name} · {b.contact_name} · {b.reference || ''}</option>)}
              </select>
              <Button size="sm" disabled={!linkId} onClick={() => bookingOps.update(linkId, { school_id: school.id }).then(() => setLinkId('')).catch(fail('link'))} className="h-10 bg-ink text-cream">Link</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ schedule */

const EMPTY_SESSION = { kind: 'assembly', title: SESSION_KINDS.assembly, date: '', start_time: '', end_time: '', location: '', grades: '', status: 'proposed', notes_for_school: '', internal_notes: '', booking_id: '' };

function SessionsSection({ school, sessions, bookings }) {
  const ops = useEntityOps('sessions');
  const [edit, setEdit] = useState(null);
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const today = detroitToday();
  const sorted = [...sessions].sort((a, b) => String(a.date || '9999').localeCompare(String(b.date || '9999')));

  const save = async (e) => {
    e.preventDefault();
    if (!edit.title.trim()) return toast.error('Give it a title');
    setBusy(true);
    const { id, pending, created_date, ...data } = edit;  
    try {
      if (id) await ops.update(id, data);
      else await ops.create({ ...data, school_id: school.id });
      if (notify && data.status !== 'proposed') await tell('schedule', school.id, { note: `${data.title}${data.date ? ` on ${prettyDate(data.date)}` : ''}${data.start_time ? ` at ${data.start_time}` : ''} (${SESSION_STATE[data.status]?.label || data.status})` }, 'Schedule saved');
      else toast.success('Schedule saved');
      setEdit(null);
    } catch (err) {
      fail('save the session')(err);
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  const set = (k) => (e) => setEdit((s) => {
    const v = e.target.value;
    if (k === 'kind' && (!s.title || Object.values(SESSION_KINDS).includes(s.title))) return { ...s, kind: v, title: SESSION_KINDS[v] };
    return { ...s, [k]: v };
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setEdit({ ...EMPTY_SESSION, booking_id: bookings[0]?.id || '' })} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider"><Plus className="w-4 h-4 mr-1" /> Add date</Button>
      </div>
      <div className="grid gap-2">
        {sorted.map((s) => (
          <div key={s.id} className={`${card} flex flex-wrap items-center gap-3 ${s.date && s.date < today ? 'opacity-60' : ''}`}>
            <div className="w-24 shrink-0 font-barlow-condensed uppercase tracking-wider text-sm text-ink">{s.date ? prettyDate(s.date, { month: 'short', day: 'numeric', weekday: 'short' }) : 'Date TBD'}</div>
            <div className="min-w-0 flex-1">
              <p className="font-barlow text-ink font-semibold">{s.title}</p>
              <p className="font-barlow text-xs text-ash">{[s.start_time && `${s.start_time}${s.end_time ? ` to ${s.end_time}` : ''}`, s.location, s.grades].filter(Boolean).join(' · ')}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-barlow-condensed uppercase tracking-wider ${SESSION_STATE[s.status]?.light || ''}`}>{SESSION_STATE[s.status]?.label || s.status}</span>
            <Button size="sm" variant="ghost" onClick={() => setEdit({ ...EMPTY_SESSION, ...s })} className="h-8 px-2"><Pencil className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => ops.remove(s.id).catch(fail('delete'))} className="h-8 px-2 text-red-600"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
        {!sorted.length && <p className={`${card} font-barlow text-sm text-ash`}>No dates yet. Add the planning call first, then each part of the program.</p>}
      </div>

      <Dialog open={Boolean(edit)} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle className="font-anton tracking-wide">{edit?.id ? 'EDIT DATE' : 'ADD A DATE'}</DialogTitle></DialogHeader>
          {edit && (
            <form onSubmit={save} className="grid grid-cols-2 gap-3">
              <div>
                <span className={label}>Part of the program</span>
                <select value={edit.kind} onChange={set('kind')} className={selectCls}>
                  {Object.entries(SESSION_KINDS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </div>
              <div>
                <span className={label}>Status</span>
                <select value={edit.status} onChange={set('status')} className={selectCls}>
                  {Object.entries(SESSION_STATE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="col-span-2"><span className={label}>Title the school sees</span><Input value={edit.title} onChange={set('title')} /></div>
              <div><span className={label}>Date</span><Input type="date" value={edit.date || ''} onChange={set('date')} /></div>
              <div><span className={label}>Grades or group</span><Input value={edit.grades || ''} onChange={set('grades')} placeholder="Grades 6 to 8" /></div>
              <div><span className={label}>Start</span><Input value={edit.start_time || ''} onChange={set('start_time')} placeholder="9:00 AM" /></div>
              <div><span className={label}>End</span><Input value={edit.end_time || ''} onChange={set('end_time')} placeholder="10:00 AM" /></div>
              <div className="col-span-2"><span className={label}>Room or place</span><Input value={edit.location || ''} onChange={set('location')} placeholder="Gym" /></div>
              {bookings.length > 0 && (
                <div className="col-span-2">
                  <span className={label}>Booking</span>
                  <select value={edit.booking_id || ''} onChange={set('booking_id')} className={selectCls}>
                    <option value="">None</option>
                    {bookings.map((b) => <option key={b.id} value={b.id}>{b.reference || b.id}</option>)}
                  </select>
                </div>
              )}
              <div className="col-span-2"><span className={label}>Note for the school</span><Textarea rows={2} value={edit.notes_for_school || ''} onChange={set('notes_for_school')} /></div>
              <div className="col-span-2"><span className={label}>Private note</span><Textarea rows={2} value={edit.internal_notes || ''} onChange={set('internal_notes')} /></div>
              <label className="col-span-2 flex items-center gap-2 font-barlow text-sm"><input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} /> Email the school (skipped for proposed dates)</label>
              <Button type="submit" disabled={busy} className="col-span-2 bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">{busy ? 'Saving...' : 'Save'}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ billing */

function InvoiceEditor({ school, bookings, invoices, value, onClose }) {
  const ops = useEntityOps('invoices');
  const today = detroitToday();
  const [inv, setInv] = useState(() => value || {
    number: nextInvoiceNumber(invoices),
    issue_date: today,
    due_date: addDays(today, 30),
    booking_id: bookings[0]?.id || '',
    po_number: bookings[0]?.po_number || '',
    line_items: bookings[0] ? bookingToInvoiceLines(bookings[0]) : [{ description: '', quantity: 1, unit_price: 0 }],
    discount: 0,
    notes: '',
    status: 'draft',
  });
  const [busy, setBusy] = useState(false);
  const subtotal = invoiceSubtotal(inv);
  const total = round2(Math.max(0, subtotal - (Number(inv.discount) || 0)));

  const setLine = (i, k, v) => setInv((x) => ({ ...x, line_items: x.line_items.map((l, j) => (j === i ? { ...l, [k]: k === 'description' ? v : v === '' ? '' : Number(v) } : l)) }));

  const save = async (send) => {
    if (!inv.number.trim()) return toast.error('Add an invoice number');
    const lines = inv.line_items.filter((l) => String(l.description).trim()).map((l) => ({ description: String(l.description).trim(), quantity: Number(l.quantity) || 0, unit_price: Number(l.unit_price) || 0 }));
    if (!lines.length) return toast.error('Add at least one line');
    if (!value?.id && invoices.some((i) => i.number === inv.number.trim())) return toast.error('That invoice number is already used');
    setBusy(true);
    const { id, pending, created_date, paid, balance, state, payments, ...rest } = inv;  
    const data = { ...rest, number: inv.number.trim(), line_items: lines, discount: Number(inv.discount) || 0, total, school_id: school.id };
    if (send) Object.assign(data, { status: 'sent', sent_at: new Date().toISOString() });
    try {
      const saved = id ? await ops.update(id, data) : await ops.create(data);
      const savedId = id || saved?.id;
      if (send) await tell('invoice', school.id, { ref_id: savedId }, `Invoice ${data.number} sent`);
      else toast.success('Invoice saved as draft');
      onClose();
    } catch (err) {
      fail('save the invoice')(err);
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <div className="space-y-3">
      {!value?.id && bookings.length > 0 && (
        <div>
          <span className={label}>Fill from booking quote</span>
          <select className={selectCls} value={inv.booking_id} onChange={(e) => {
            const b = bookings.find((x) => x.id === e.target.value);
            setInv((x) => ({ ...x, booking_id: e.target.value, line_items: b ? bookingToInvoiceLines(b) : x.line_items, po_number: b?.po_number || x.po_number }));
          }}>
            <option value="">None</option>
            {bookings.map((b) => <option key={b.id} value={b.id}>{b.reference} · {money(b.quoted_total)}</option>)}
          </select>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="col-span-2"><span className={label}>Invoice #</span><Input value={inv.number} onChange={(e) => setInv((x) => ({ ...x, number: e.target.value }))} /></div>
        <div className="col-span-2"><span className={label}>PO #</span><Input value={inv.po_number || ''} onChange={(e) => setInv((x) => ({ ...x, po_number: e.target.value }))} /></div>
        <div className="col-span-2"><span className={label}>Issued</span><Input type="date" value={inv.issue_date || ''} onChange={(e) => setInv((x) => ({ ...x, issue_date: e.target.value }))} /></div>
        <div className="col-span-2"><span className={label}>Due</span><Input type="date" value={inv.due_date || ''} onChange={(e) => setInv((x) => ({ ...x, due_date: e.target.value }))} /></div>
      </div>
      <div>
        <span className={label}>Lines</span>
        <div className="space-y-2">
          {inv.line_items.map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_60px_100px_32px] gap-2 items-center">
              <Input value={l.description} onChange={(e) => setLine(i, 'description', e.target.value)} placeholder="Description" />
              <Input type="number" min="0" value={l.quantity} onChange={(e) => setLine(i, 'quantity', e.target.value)} aria-label="Quantity" />
              <Input type="number" min="0" step="0.01" value={l.unit_price} onChange={(e) => setLine(i, 'unit_price', e.target.value)} aria-label="Price" />
              <button type="button" aria-label="Remove line" onClick={() => setInv((x) => ({ ...x, line_items: x.line_items.filter((_, j) => j !== i) }))} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setInv((x) => ({ ...x, line_items: [...x.line_items, { description: '', quantity: 1, unit_price: 0 }] }))}><Plus className="w-4 h-4 mr-1" /> Add line</Button>
      </div>
      <div className="grid grid-cols-2 gap-2 items-end">
        <div><span className={label}>Discount ($)</span><Input type="number" min="0" step="0.01" value={inv.discount} onChange={(e) => setInv((x) => ({ ...x, discount: e.target.value }))} /></div>
        <div className="text-right font-barlow">
          <p className="text-sm text-ash">Subtotal {money(subtotal)}</p>
          <p className="text-lg font-semibold text-ink">Total {money(total)}</p>
        </div>
      </div>
      <div><span className={label}>Notes on the invoice</span><Textarea rows={2} value={inv.notes || ''} onChange={(e) => setInv((x) => ({ ...x, notes: e.target.value }))} placeholder="Remit to address, payment terms, thank you..." /></div>
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" disabled={busy} onClick={() => save(false)} className="font-barlow-condensed uppercase tracking-wider">Save draft</Button>
        <Button type="button" disabled={busy} onClick={() => save(true)} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider"><Send className="w-4 h-4 mr-1" /> {value?.status && value.status !== 'draft' ? 'Save and re-send' : 'Save and send'}</Button>
      </div>
      <p className="font-barlow text-xs text-ash">Drafts are only visible to you. Sending puts it in their portal and emails their team.</p>
    </div>
  );
}

function PaymentDialog({ inv, onClose }) {
  const payOps = useEntityOps('payments');
  const invOps = useEntityOps('invoices');
  const [p, setP] = useState({ amount: inv.balance || inv.total, method: 'check', reference: '', received_date: detroitToday(), notes: '' });
  const [busy, setBusy] = useState(false);
  const save = async (e) => {
    e.preventDefault();
    const amount = round2(Number(p.amount));
    if (!(amount > 0)) return toast.error('Enter the amount received');
    setBusy(true);
    try {
      await payOps.create({ ...p, amount, invoice_id: inv.id, school_id: inv.school_id });
      if (amount >= inv.balance - 0.004) await invOps.update(inv.id, { status: 'paid' });
      toast.success(`${money(amount)} recorded`, { description: amount >= inv.balance - 0.004 ? `${inv.number} is paid in full.` : `${money(inv.balance - amount)} still due.` });
      onClose();
    } catch (err) {
      fail('record the payment')(err);
    } finally {
      setBusy(false);
    }
    return undefined;
  };
  return (
    <form onSubmit={save} className="grid grid-cols-2 gap-3">
      <div><span className={label}>Amount</span><Input type="number" min="0" step="0.01" value={p.amount} onChange={(e) => setP((x) => ({ ...x, amount: e.target.value }))} /></div>
      <div><span className={label}>Received</span><Input type="date" value={p.received_date} onChange={(e) => setP((x) => ({ ...x, received_date: e.target.value }))} /></div>
      <div>
        <span className={label}>Method</span>
        <select className={selectCls} value={p.method} onChange={(e) => setP((x) => ({ ...x, method: e.target.value }))}>
          {['check', 'ach', 'card', 'cash', 'other'].map((m) => <option key={m} value={m}>{m.toUpperCase()}</option>)}
        </select>
      </div>
      <div><span className={label}>Check # or reference</span><Input value={p.reference} onChange={(e) => setP((x) => ({ ...x, reference: e.target.value }))} /></div>
      <div className="col-span-2"><span className={label}>Notes</span><Input value={p.notes} onChange={(e) => setP((x) => ({ ...x, notes: e.target.value }))} /></div>
      <Button type="submit" disabled={busy} className="col-span-2 bg-green-700 hover:bg-green-800 text-white font-barlow-condensed uppercase tracking-wider">{busy ? 'Saving...' : 'Record payment'}</Button>
    </form>
  );
}

function BillingSection({ school, invoices, payments, bookings, allInvoices }) {
  const ops = useEntityOps('invoices');
  const payOps = useEntityOps('payments');
  const [editing, setEditing] = useState(null);
  const [paying, setPaying] = useState(null);
  const rows = invoices.map((i) => withBalance(i, payments)).sort((a, b) => String(b.issue_date).localeCompare(String(a.issue_date)));
  const due = rows.filter((r) => r.state !== 'void' && r.state !== 'draft').reduce((t, r) => t + r.balance, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-barlow text-ink">Outstanding: <span className="font-semibold">{money(due)}</span></p>
        <Button onClick={() => setEditing('new')} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider"><Plus className="w-4 h-4 mr-1" /> New invoice</Button>
      </div>
      {rows.map((inv) => (
        <div key={inv.id} className={card}>
          <div className="flex flex-wrap items-center gap-3">
            <Receipt className="w-5 h-5 text-ash" />
            <div className="min-w-0 flex-1">
              <p className="font-barlow text-ink font-semibold">{inv.number} <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-barlow-condensed uppercase tracking-wider ${INVOICE_STATE[inv.state]?.light || ''}`}>{INVOICE_STATE[inv.state]?.label}</span></p>
              <p className="font-barlow text-xs text-ash">Issued {prettyDate(inv.issue_date, { month: 'short', day: 'numeric', year: 'numeric' })}{inv.due_date ? ` · due ${prettyDate(inv.due_date, { month: 'short', day: 'numeric' })}` : ''}{inv.po_number ? ` · PO ${inv.po_number}` : ''}</p>
            </div>
            <div className="text-right font-barlow">
              <p className="text-ink font-semibold">{money(inv.total)}</p>
              {inv.paid > 0 && <p className="text-xs text-ash">{money(inv.balance)} due</p>}
            </div>
          </div>
          {inv.payments.length > 0 && (
            <ul className="mt-2 pl-8 font-barlow text-xs text-ash space-y-0.5">
              {inv.payments.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-600" /> {prettyDate(p.received_date, { month: 'short', day: 'numeric', year: 'numeric' })}: {money(p.amount)} {p.method}{p.reference ? ` #${p.reference}` : ''}
                  <button type="button" className="text-red-600 hover:underline" onClick={() => payOps.remove(p.id).then(() => inv.status === 'paid' && ops.update(inv.id, { status: 'sent' })).catch(fail('delete the payment'))}>remove</button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditing(inv)}><Pencil className="w-3.5 h-3.5 mr-1" /> Edit</Button>
            {inv.state !== 'void' && inv.state !== 'draft' && inv.balance > 0 && <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white" onClick={() => setPaying(inv)}>Record payment</Button>}
            <Button size="sm" variant="outline" onClick={() => downloadInvoicePdf(inv, school).catch(fail('make the PDF'))}><Download className="w-3.5 h-3.5 mr-1" /> PDF</Button>
            {inv.state !== 'void' && inv.state !== 'draft' && <Button size="sm" variant="ghost" onClick={() => ops.update(inv.id, { status: 'void' }).then(() => toast.success('Voided')).catch(fail('void it'))}>Void</Button>}
            {inv.state === 'draft' && <Button size="sm" variant="ghost" className="text-red-600" onClick={() => ops.remove(inv.id).catch(fail('delete the draft'))}><Trash2 className="w-3.5 h-3.5 mr-1" /> Delete draft</Button>}
          </div>
        </div>
      ))}
      {!rows.length && <p className={`${card} font-barlow text-sm text-ash`}>No invoices yet. Start one from the booking quote.</p>}

      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader><DialogTitle className="font-anton tracking-wide">{editing && editing !== 'new' ? `EDIT ${editing.number}` : 'NEW INVOICE'}</DialogTitle></DialogHeader>
          {editing && <InvoiceEditor school={school} bookings={bookings} invoices={allInvoices} value={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(paying)} onOpenChange={(o) => !o && setPaying(null)}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle className="font-anton tracking-wide">PAYMENT FOR {paying?.number}</DialogTitle></DialogHeader>
          {paying && <PaymentDialog inv={paying} onClose={() => setPaying(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ documents */

function DocsSection({ school, docs }) {
  const ops = useEntityOps('schoolDocs');
  const [form, setForm] = useState({ title: '', kind: 'agreement', visible: true, notify: true });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const open = async (d) => {
    const win = window.open('about:blank', '_blank');
    if (win) win.opener = null;
    try {
      const { url } = await callPortal('documentUrl', { school_id: school.id, doc_id: d.id });
      if (win) win.location.href = url;
      else window.location.href = url;
    } catch (err) {
      if (win) win.close();
      fail('open it')(err);
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !file) return toast.error('Add a name and choose a file');
    setBusy(true);
    try {
      const { file_uri, file_name } = await uploadPrivate(file);
      await ops.create({ school_id: school.id, title: form.title.trim(), kind: form.kind, file_uri, file_name, uploaded_by: 'ogwogd', visible_to_school: form.visible });
      if (form.visible && form.notify) await tell('document', school.id, { note: form.title.trim() }, 'Document added');
      else toast.success('Document added');
      setForm({ title: '', kind: 'agreement', visible: true, notify: true });
      setFile(null);
      e.target.reset();
    } catch (err) {
      fail('upload')(err);
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-2">
        {docs.map((d) => (
          <div key={d.id} className={`${card} flex flex-wrap items-center gap-3`}>
            <FileText className="w-5 h-5 text-ash" />
            <div className="min-w-0 flex-1">
              <p className="font-barlow text-ink font-semibold truncate">{d.title}</p>
              <p className="font-barlow text-xs text-ash">{DOC_KINDS[d.kind] || d.kind} · {d.uploaded_by === 'school' ? 'from the school' : 'from us'} · {prettyDate(d.created_date, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <Button size="sm" variant="ghost" title={d.visible_to_school === false ? 'Hidden from school' : 'Visible to school'} onClick={() => ops.update(d.id, { visible_to_school: d.visible_to_school === false }).catch(fail('update'))} className="h-8 px-2">
              {d.visible_to_school === false ? <EyeOff className="w-4 h-4 text-ash" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={() => open(d)}><ExternalLink className="w-3.5 h-3.5 mr-1" /> Open</Button>
            <Button size="sm" variant="ghost" className="h-8 px-2 text-red-600" onClick={() => ops.remove(d.id).catch(fail('delete'))}><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
        {!docs.length && <p className={`${card} font-barlow text-sm text-ash`}>No documents yet. Start with your W-9 and the program agreement.</p>}
      </div>
      <form onSubmit={upload} className={`${card} space-y-3 h-fit`}>
        <p className={h3}><Upload className="w-4 h-4" /> Add a document</p>
        <div><span className={label}>Name</span><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="OGWOGD W-9 (2026)" /></div>
        <div>
          <span className={label}>Type</span>
          <select className={selectCls} value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}>
            {Object.entries(DOC_KINDS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
        <label className="flex items-center gap-2 font-barlow text-sm"><input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} /> School can see it</label>
        <label className="flex items-center gap-2 font-barlow text-sm"><input type="checkbox" checked={form.notify} onChange={(e) => setForm((f) => ({ ...f, notify: e.target.checked }))} /> Email the school</label>
        <Button type="submit" disabled={busy} className="w-full bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">{busy ? 'Uploading...' : 'Upload'}</Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ messages */

function MessagesSection({ school, messages }) {
  const ops = useEntityOps('portalMessages');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const thread = [...messages].sort((a, b) => String(a.created_date).localeCompare(String(b.created_date)));

  useEffect(() => {
    messages.filter((m) => m.author === 'school' && !m.read_by_ogwogd && !m.pending).forEach((m) => ops.update(m.id, { read_by_ogwogd: true }).catch(() => {}));
  }, [messages.length]);  

  const send = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setBusy(true);
    setText('');
    try {
      await ops.create({ school_id: school.id, author: 'ogwogd', author_name: 'OGWOGD', author_email: 'greggsdevelopment@gmail.com', body, topic: 'general', read_by_ogwogd: true, read_by_school: false });
      await tell('message', school.id, { note: body.slice(0, 280) }, 'Message sent');
    } catch (err) {
      setText(body);
      fail('send')(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-3">
      <div className={`${card} space-y-3 max-h-[520px] overflow-y-auto`}>
        {thread.map((m) => (
          <div key={m.id} className={`flex ${m.author === 'ogwogd' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 font-barlow text-sm whitespace-pre-wrap ${m.author === 'ogwogd' ? 'bg-ink text-cream' : 'bg-cream border border-ink/10 text-ink'} ${m.pending ? 'opacity-60' : ''}`}>
              <p className={`text-[10px] uppercase tracking-wider font-barlow-condensed ${m.author === 'ogwogd' ? 'text-cream/50' : 'text-ash'}`}>
                {m.author === 'ogwogd' ? 'You' : m.author_name}{m.topic && m.topic !== 'general' ? ` · ${m.topic}` : ''} · {new Date(m.created_date).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </p>
              {m.body}
              {m.author === 'ogwogd' && <p className="text-[10px] text-cream/40 mt-0.5">{m.read_by_school ? 'Seen' : 'Not seen yet'}</p>}
            </div>
          </div>
        ))}
        {!thread.length && <p className="font-barlow text-sm text-ash">No messages yet.</p>}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <Textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${school.name}`} className="bg-white" />
        <Button type="submit" disabled={busy || !text.trim()} className="bg-ink text-cream hover:bg-ink/90 h-auto"><Send className="w-4 h-4" /></Button>
      </form>
      <p className="font-barlow text-xs text-ash">They get an email with your message and a link to reply in the portal.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ checklist */

// Matches what the site tells schools to expect (programs page).
const STANDARD_TASKS = [
  ['ogwogd', 'Planning call (20 minutes)'],
  ['ogwogd', 'Send the one-page plan'],
  ['ogwogd', 'Send the quote and our W-9'],
  ['school', 'Sign the program agreement'],
  ['school', 'Send the purchase order (or confirm how you will pay)'],
  ['school', 'Confirm dates, rooms and the bell schedule'],
  ['school', 'Confirm sound, a staff contact and supervision for each session'],
  ['school', 'Give students 5 minutes for the survey before the program'],
  ['ogwogd', 'Deliver the program'],
  ['school', 'Give students 5 minutes for the 60-day follow-up survey'],
  ['ogwogd', 'Send the survey summary report'],
  ['ogwogd', 'Send the invoice'],
];

function TasksSection({ school, tasks, bookings }) {
  const ops = useEntityOps('schoolTasks');
  const [add, setAdd] = useState({ title: '', owner: 'school', due_date: '' });
  const [busy, setBusy] = useState(false);
  const sorted = [...tasks].sort((a, b) => Number(a.done) - Number(b.done) || String(a.due_date || '9999').localeCompare(String(b.due_date || '9999')));

  const create = async (e) => {
    e.preventDefault();
    if (!add.title.trim()) return;
    try {
      await ops.create({ school_id: school.id, booking_id: bookings[0]?.id || '', title: add.title.trim(), owner: add.owner, due_date: add.due_date || null, done: false });
      if (add.owner === 'school') await tell('task', school.id, { note: add.title.trim() }, 'Added');
      setAdd({ title: '', owner: 'school', due_date: '' });
    } catch (err) {
      fail('add it')(err);
    }
  };

  const addStandard = async () => {
    setBusy(true);
    try {
      const existing = new Set(tasks.map((t) => t.title));
      for (const [owner, title] of STANDARD_TASKS) {
        if (!existing.has(title)) await ops.create({ school_id: school.id, booking_id: bookings[0]?.id || '', title, owner, done: false });
      }
      toast.success('Standard checklist added');
    } catch (err) {
      fail('add the checklist')(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={busy} onClick={addStandard} className="font-barlow-condensed uppercase tracking-wider"><ClipboardList className="w-4 h-4 mr-1" /> Add standard checklist</Button>
      </div>
      <div className={`${card} divide-y divide-ink/5`}>
        {sorted.map((t) => (
          <div key={t.id} className="py-2 flex items-center gap-3">
            <input type="checkbox" checked={Boolean(t.done)} onChange={() => ops.update(t.id, { done: !t.done, done_at: !t.done ? new Date().toISOString() : null, done_by: !t.done ? 'OGWOGD' : '' }).catch(fail('update'))} className="w-4 h-4" />
            <div className="min-w-0 flex-1">
              <p className={`font-barlow ${t.done ? 'line-through text-ash' : 'text-ink'}`}>{t.title}</p>
              <p className="font-barlow text-xs text-ash">{t.owner === 'school' ? 'School' : 'Us'}{t.due_date ? ` · due ${prettyDate(t.due_date, { month: 'short', day: 'numeric' })}` : ''}{t.done && t.done_by ? ` · checked by ${t.done_by}` : ''}</p>
            </div>
            <Button size="sm" variant="ghost" className="h-8 px-2 text-red-600" onClick={() => ops.remove(t.id).catch(fail('delete'))}><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
        {!sorted.length && <p className="py-2 font-barlow text-sm text-ash">No checklist yet. Add the standard one to start.</p>}
      </div>
      <form onSubmit={create} className="grid grid-cols-[1fr_120px_150px_auto] gap-2">
        <Input value={add.title} onChange={(e) => setAdd((a) => ({ ...a, title: e.target.value }))} placeholder="New item" className="bg-white" />
        <select className={selectCls} value={add.owner} onChange={(e) => setAdd((a) => ({ ...a, owner: e.target.value }))}>
          <option value="school">School</option>
          <option value="ogwogd">Us</option>
        </select>
        <Input type="date" value={add.due_date} onChange={(e) => setAdd((a) => ({ ...a, due_date: e.target.value }))} className="bg-white" />
        <Button type="submit" className="bg-ink text-cream hover:bg-ink/90"><Plus className="w-4 h-4" /></Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ detail */

const SECTIONS = [
  ['profile', 'Profile and team', Users],
  ['schedule', 'Schedule', CalendarDays],
  ['billing', 'Billing', Receipt],
  ['documents', 'Documents', FileText],
  ['messages', 'Messages', MessageSquare],
  ['tasks', 'Checklist', ClipboardList],
];

export default function SchoolDetail({ school, onBack }) {
  const { data } = useAdminData();
  const [section, setSection] = useState('profile');
  const f = (rows) => rows.filter((r) => r.school_id === school.id);
  const members = f(data.schoolMembers);
  const bookings = f(data.bookings);
  const messages = f(data.portalMessages);
  const unread = messages.filter((m) => m.author === 'school' && !m.read_by_ogwogd).length;
  const requested = members.filter((m) => m.status === 'requested').length;
  const counts = useMemo(() => ({ messages: unread, profile: requested }), [unread, requested]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" /> All schools</Button>
        <div className="min-w-0 flex-1">
          <h2 className="font-anton text-2xl text-ink tracking-wide truncate">{school.name}</h2>
          <p className="font-barlow text-xs text-ash">{[school.district, school.city].filter(Boolean).join(' · ')}</p>
        </div>
        <Link to={`/portal?school=${school.id}`} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-ink/15 hover:border-ink/40 font-barlow-condensed uppercase tracking-wider text-xs text-ink">
          <Eye className="w-4 h-4" /> See their portal
        </Link>
        {members.find((m) => m.is_primary) && (
          <a href={`mailto:${members.find((m) => m.is_primary).email}`} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-ink/15 hover:border-ink/40 font-barlow-condensed uppercase tracking-wider text-xs text-ink">
            <Mail className="w-4 h-4" /> Email main contact
          </a>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto bg-white border border-ink/5 rounded-sm p-1">
        {SECTIONS.map(([key, text, Icon]) => (
          <button key={key} type="button" onClick={() => setSection(key)} className={`shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-sm font-barlow-condensed uppercase tracking-wider text-xs ${section === key ? 'bg-ink text-cream' : 'text-ink hover:bg-ink/5'}`}>
            <Icon className="w-3.5 h-3.5" /> {text}
            {counts[key] > 0 && <span className="ml-1 rounded-full bg-violet-100 text-violet-700 text-[10px] px-1.5">{counts[key]}</span>}
          </button>
        ))}
      </div>

      {section === 'profile' && <ProfileSection school={school} members={members} bookings={bookings} allBookings={data.bookings} />}
      {section === 'schedule' && <SessionsSection school={school} sessions={f(data.sessions)} bookings={bookings} />}
      {section === 'billing' && <BillingSection school={school} invoices={f(data.invoices)} payments={f(data.payments)} bookings={bookings} allInvoices={data.invoices} />}
      {section === 'documents' && <DocsSection school={school} docs={f(data.schoolDocs)} />}
      {section === 'messages' && <MessagesSection school={school} messages={messages} />}
      {section === 'tasks' && <TasksSection school={school} tasks={f(data.schoolTasks)} bookings={bookings} />}
    </div>
  );
}
