import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Download, Pencil, Plus, Receipt, Trash2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { downloadCsv, useAdminData, useEntityOps } from '@/lib/adminData';
import { base44 } from '@/api/base44Client';
import { daysUntil, detroitToday, money, money0, prettyDate, round2, uploadPrivate, withBalance } from '@/lib/portal';

const label = 'font-barlow-condensed text-xs uppercase tracking-wider text-ash block mb-1';
const selectCls = 'w-full h-10 rounded-md border border-input bg-white px-3 text-sm';
const card = 'bg-white border border-ink/10 rounded-sm p-4 sm:p-5';
const CATEGORIES = ['wristbands', 'printing', 'travel', 'supplies', 'event', 'marketing', 'software', 'fees', 'other'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BUCKETS = [
  ['current', 'Not yet due'],
  ['d30', '1 to 30 days late'],
  ['d60', '31 to 60'],
  ['d90', '61 to 90'],
  ['d90p', 'Over 90'],
];

function bucketFor(inv, today) {
  if (!inv.due_date) return 'current';
  const late = -daysUntil(inv.due_date, today);
  if (late <= 0) return 'current';
  if (late <= 30) return 'd30';
  if (late <= 60) return 'd60';
  if (late <= 90) return 'd90';
  return 'd90p';
}

function ExpenseForm({ value, schools, onDone }) {
  const ops = useEntityOps('expenses');
  const [e, setE] = useState(value || { date: detroitToday(), category: 'supplies', vendor: '', amount: '', school_id: '', payment_method: '', notes: '' });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (ev) => setE((x) => ({ ...x, [k]: ev.target.value }));
  const save = async (ev) => {
    ev.preventDefault();
    const amount = round2(Number(e.amount));
    if (!(amount > 0)) return toast.error('Enter the amount');
    if (!e.date) return toast.error('Enter the date');
    setBusy(true);
    try {
      const receipt = file ? await uploadPrivate(file) : null;
      const { id, pending, created_date, ...rest } = e;  
      const data = { ...rest, amount, ...(receipt ? { receipt_uri: receipt.file_uri } : {}) };
      if (id) await ops.update(id, data);
      else await ops.create(data);
      toast.success('Expense saved');
      onDone();
    } catch (err) {
      toast.error('Could not save', { description: err?.message });
    } finally {
      setBusy(false);
    }
    return undefined;
  };
  return (
    <form onSubmit={save} className="grid grid-cols-2 gap-3">
      <div><span className={label}>Date</span><Input type="date" value={e.date} onChange={set('date')} /></div>
      <div><span className={label}>Amount</span><Input type="number" min="0" step="0.01" value={e.amount} onChange={set('amount')} /></div>
      <div>
        <span className={label}>Category</span>
        <select className={selectCls} value={e.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
      </div>
      <div><span className={label}>Paid to</span><Input value={e.vendor} onChange={set('vendor')} /></div>
      <div>
        <span className={label}>For school (optional)</span>
        <select className={selectCls} value={e.school_id || ''} onChange={set('school_id')}>
          <option value="">General</option>
          {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div><span className={label}>Paid with</span><Input value={e.payment_method || ''} onChange={set('payment_method')} placeholder="Card, cash, check" /></div>
      <div className="col-span-2"><span className={label}>Notes</span><Input value={e.notes || ''} onChange={set('notes')} /></div>
      <div className="col-span-2">
        <span className={label}>Receipt {e.receipt_uri ? '(one is saved; choose a file to replace it)' : '(optional)'}</span>
        <input type="file" accept=".pdf,.png,.jpg,.jpeg,.heic" onChange={(ev) => setFile(ev.target.files?.[0] || null)} className="block w-full text-sm" />
      </div>
      <Button type="submit" disabled={busy} className="col-span-2 bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider"><Upload className="w-4 h-4 mr-1" /> {busy ? 'Saving...' : 'Save expense'}</Button>
    </form>
  );
}

export default function BooksTab() {
  const { data } = useAdminData();
  const today = detroitToday();
  const thisYear = Number(today.slice(0, 4));
  const [year, setYear] = useState(thisYear);
  const [editing, setEditing] = useState(null);
  const expenseOps = useEntityOps('expenses');
  const schoolName = (id) => data.schools.find((s) => s.id === id)?.name || '';
  const inYear = (iso) => String(iso || '').slice(0, 4) === String(year);

  const books = useMemo(() => {
    const invoices = data.invoices.filter((i) => i.status !== 'draft').map((i) => withBalance(i, data.payments, today));
    const live = invoices.filter((i) => i.state !== 'void');
    const payments = data.payments.filter((p) => inYear(p.received_date));
    const expenses = data.expenses.filter((x) => inYear(x.date));
    const invoiced = live.filter((i) => inYear(i.issue_date)).reduce((t, i) => t + i.total, 0);
    const collected = payments.reduce((t, p) => t + (Number(p.amount) || 0), 0);
    const spent = expenses.reduce((t, x) => t + (Number(x.amount) || 0), 0);
    const open = live.filter((i) => i.balance > 0);
    const outstanding = open.reduce((t, i) => t + i.balance, 0);
    const overdue = open.filter((i) => i.state === 'overdue').reduce((t, i) => t + i.balance, 0);

    const aging = {};
    for (const inv of open) {
      const k = inv.school_id || 'none';
      aging[k] = aging[k] || { school: schoolName(inv.school_id) || 'Unassigned', current: 0, d30: 0, d60: 0, d90: 0, d90p: 0, total: 0 };
      aging[k][bucketFor(inv, today)] += inv.balance;
      aging[k].total += inv.balance;
    }
    const agingRows = Object.values(aging).sort((a, b) => b.total - a.total);
    const agingTotals = BUCKETS.reduce((o, [k]) => ({ ...o, [k]: agingRows.reduce((t, r) => t + r[k], 0) }), {});

    const months = MONTHS.map((m, i) => {
      const mm = String(i + 1).padStart(2, '0');
      const inc = payments.filter((p) => String(p.received_date).slice(5, 7) === mm).reduce((t, p) => t + (Number(p.amount) || 0), 0);
      const out = expenses.filter((x) => String(x.date).slice(5, 7) === mm).reduce((t, x) => t + (Number(x.amount) || 0), 0);
      return { m, inc, out, net: inc - out };
    });
    const byCategory = CATEGORIES.map((c) => [c, expenses.filter((x) => x.category === c).reduce((t, x) => t + (Number(x.amount) || 0), 0)]).filter(([, v]) => v > 0);
    return { invoices: live, payments, expenses, invoiced, collected, spent, outstanding, overdue, agingRows, agingTotals, months, byCategory };
     
  }, [data, year, today]);

  const years = [...new Set([thisYear, ...data.payments.map((p) => Number(String(p.received_date).slice(0, 4))), ...data.expenses.map((x) => Number(String(x.date).slice(0, 4)))].filter(Boolean))].sort((a, b) => b - a);

  const invoiceById = (id) => data.invoices.find((i) => i.id === id);
  const openReceipt = async (x) => {
    if (!x.receipt_uri) return;
    // Receipts are private files; ask the storage service for a short-lived link.
    const win = window.open('about:blank', '_blank');
    if (win) win.opener = null;
    try {
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: x.receipt_uri, expires_in: 300 });
      if (win) win.location.href = signed_url;
      else window.location.href = signed_url;
    } catch (err) {
      if (win) win.close();
      toast.error('Could not open the receipt', { description: err?.message });
    }
  };

  const Kpi = ({ text, value, tone = 'text-ink', sub }) => (
    <div className={card}>
      <p className="font-barlow-condensed uppercase tracking-wider text-xs text-ash">{text}</p>
      <p className={`font-anton text-2xl sm:text-3xl mt-1 ${tone}`}>{money0(value)}</p>
      {sub && <p className="font-barlow text-xs text-ash mt-0.5">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-anton text-2xl text-ink tracking-wide">BOOKS</h2>
          <p className="font-barlow text-sm text-ash">Money in from schools, money out, and who still owes what. Figures come from recorded payments and expenses.</p>
        </div>
        <div className="flex gap-2 items-center">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="h-9 rounded-sm border border-ink/15 bg-white px-2 font-barlow text-sm">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <Button onClick={() => setEditing('new')} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider"><Plus className="w-4 h-4 mr-1" /> Expense</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kpi text={`Invoiced ${year}`} value={books.invoiced} />
        <Kpi text={`Collected ${year}`} value={books.collected} tone="text-green-700" />
        <Kpi text={`Expenses ${year}`} value={books.spent} tone="text-red-700" />
        <Kpi text={`Net ${year}`} value={books.collected - books.spent} tone={books.collected - books.spent >= 0 ? 'text-ink' : 'text-red-700'} sub="Collected minus expenses" />
        <Kpi text="Owed to us now" value={books.outstanding} tone={books.overdue > 0 ? 'text-amber-600' : 'text-ink'} sub={books.overdue > 0 ? `${money0(books.overdue)} past due` : 'Nothing past due'} />
      </div>

      <div className={card}>
        <p className="font-barlow-condensed font-bold uppercase tracking-wider text-sm text-ink mb-3">Who owes what (by how late)</p>
        {books.agingRows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full font-barlow text-sm min-w-[640px]">
              <thead><tr className="text-ash text-left font-barlow-condensed uppercase tracking-wider text-[11px]"><th className="pb-2 font-normal">School</th>{BUCKETS.map(([k, l]) => <th key={k} className="pb-2 font-normal text-right">{l}</th>)}<th className="pb-2 font-normal text-right">Total</th></tr></thead>
              <tbody>
                {books.agingRows.map((r) => (
                  <tr key={r.school} className="border-t border-ink/5">
                    <td className="py-2 text-ink">{r.school}</td>
                    {BUCKETS.map(([k]) => <td key={k} className={`py-2 text-right ${r[k] > 0 && k !== 'current' ? 'text-red-600' : 'text-ink/70'}`}>{r[k] ? money(r[k]) : ''}</td>)}
                    <td className="py-2 text-right font-semibold">{money(r.total)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink/15 font-semibold"><td className="py-2">Total</td>{BUCKETS.map(([k]) => <td key={k} className="py-2 text-right">{books.agingTotals[k] ? money(books.agingTotals[k]) : ''}</td>)}<td className="py-2 text-right">{money(books.outstanding)}</td></tr>
              </tbody>
            </table>
          </div>
        ) : <p className="font-barlow text-sm text-ash">Nobody owes anything right now.</p>}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={card}>
          <p className="font-barlow-condensed font-bold uppercase tracking-wider text-sm text-ink mb-3">Month by month, {year}</p>
          <table className="w-full font-barlow text-sm">
            <thead><tr className="text-ash text-left font-barlow-condensed uppercase tracking-wider text-[11px]"><th className="pb-2 font-normal">Month</th><th className="pb-2 font-normal text-right">In</th><th className="pb-2 font-normal text-right">Out</th><th className="pb-2 font-normal text-right">Net</th></tr></thead>
            <tbody>
              {books.months.map((r) => (
                <tr key={r.m} className="border-t border-ink/5">
                  <td className="py-1.5 text-ink">{r.m}</td>
                  <td className="py-1.5 text-right text-green-700">{r.inc ? money0(r.inc) : ''}</td>
                  <td className="py-1.5 text-right text-red-700">{r.out ? money0(r.out) : ''}</td>
                  <td className={`py-1.5 text-right ${r.net < 0 ? 'text-red-700' : 'text-ink'}`}>{r.inc || r.out ? money0(r.net) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={card}>
          <p className="font-barlow-condensed font-bold uppercase tracking-wider text-sm text-ink mb-3">Spending by category, {year}</p>
          {books.byCategory.length ? (
            <ul className="space-y-1.5 font-barlow text-sm">
              {books.byCategory.sort((a, b) => b[1] - a[1]).map(([c, v]) => (
                <li key={c} className="flex justify-between border-b border-ink/5 pb-1.5"><span className="capitalize text-ink">{c}</span><span>{money(v)}</span></li>
              ))}
            </ul>
          ) : <p className="font-barlow text-sm text-ash">No expenses recorded for {year}.</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => downloadCsv(`ogwogd-payments-${year}.csv`, [
              { label: 'Date', value: 'received_date' }, { label: 'School', value: (p) => schoolName(p.school_id) }, { label: 'Invoice', value: (p) => invoiceById(p.invoice_id)?.number || '' },
              { label: 'Method', value: 'method' }, { label: 'Reference', value: 'reference' }, { label: 'Amount', value: 'amount' }, { label: 'Notes', value: 'notes' },
            ], books.payments)}><Download className="w-3.5 h-3.5 mr-1" /> Payments CSV</Button>
            <Button size="sm" variant="outline" onClick={() => downloadCsv(`ogwogd-expenses-${year}.csv`, [
              { label: 'Date', value: 'date' }, { label: 'Category', value: 'category' }, { label: 'Paid to', value: 'vendor' }, { label: 'Amount', value: 'amount' },
              { label: 'School', value: (x) => schoolName(x.school_id) }, { label: 'Paid with', value: 'payment_method' }, { label: 'Receipt on file', value: (x) => (x.receipt_uri ? 'yes' : '') }, { label: 'Notes', value: 'notes' },
            ], books.expenses)}><Download className="w-3.5 h-3.5 mr-1" /> Expenses CSV</Button>
            <Button size="sm" variant="outline" onClick={() => downloadCsv(`ogwogd-invoices-${year}.csv`, [
              { label: 'Invoice', value: 'number' }, { label: 'School', value: (i) => schoolName(i.school_id) }, { label: 'Issued', value: 'issue_date' }, { label: 'Due', value: 'due_date' },
              { label: 'PO', value: 'po_number' }, { label: 'Total', value: 'total' }, { label: 'Paid', value: 'paid' }, { label: 'Balance', value: 'balance' }, { label: 'Status', value: 'state' },
            ], books.invoices.filter((i) => inYear(i.issue_date)))}><Download className="w-3.5 h-3.5 mr-1" /> Invoices CSV</Button>
          </div>
        </div>
      </div>

      <div className={card}>
        <p className="font-barlow-condensed font-bold uppercase tracking-wider text-sm text-ink mb-3">Payments received, {year}</p>
        {books.payments.length ? (
          <ul className="divide-y divide-ink/5 font-barlow text-sm">
            {[...books.payments].sort((a, b) => String(b.received_date).localeCompare(String(a.received_date))).map((p) => (
              <li key={p.id} className="py-2 flex flex-wrap items-center gap-3">
                <span className="w-24 text-ash">{prettyDate(p.received_date, { month: 'short', day: 'numeric' })}</span>
                <span className="flex-1 min-w-0 text-ink truncate">{schoolName(p.school_id)} · {invoiceById(p.invoice_id)?.number || 'invoice'}</span>
                <span className="text-ash uppercase text-xs">{p.method}{p.reference ? ` #${p.reference}` : ''}</span>
                <span className="font-semibold text-green-700">{money(p.amount)}</span>
              </li>
            ))}
          </ul>
        ) : <p className="font-barlow text-sm text-ash">No payments recorded for {year}. Record them from each school's Billing section.</p>}
      </div>

      <div className={card}>
        <p className="font-barlow-condensed font-bold uppercase tracking-wider text-sm text-ink mb-3">Expenses, {year}</p>
        {books.expenses.length ? (
          <ul className="divide-y divide-ink/5 font-barlow text-sm">
            {[...books.expenses].sort((a, b) => String(b.date).localeCompare(String(a.date))).map((x) => (
              <li key={x.id} className="py-2 flex flex-wrap items-center gap-3">
                <span className="w-24 text-ash">{prettyDate(x.date, { month: 'short', day: 'numeric' })}</span>
                <span className="flex-1 min-w-0 text-ink truncate"><span className="capitalize">{x.category}</span>{x.vendor ? ` · ${x.vendor}` : ''}{x.school_id ? ` · ${schoolName(x.school_id)}` : ''}</span>
                {x.receipt_uri && <button type="button" onClick={() => openReceipt(x)} className="text-xs underline text-ink"><Receipt className="inline w-3.5 h-3.5 mr-0.5" />receipt</button>}
                <span className="font-semibold text-red-700">{money(x.amount)}</span>
                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setEditing(x)}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="h-8 px-2 text-red-600" onClick={() => expenseOps.remove(x.id).catch((err) => toast.error('Could not delete', { description: err?.message }))}><Trash2 className="w-4 h-4" /></Button>
              </li>
            ))}
          </ul>
        ) : <p className="font-barlow text-sm text-ash">No expenses yet. Add wristbands, printing, travel and the like to see real profit per year.</p>}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="bg-white">
          <DialogHeader><DialogTitle className="font-anton tracking-wide">{editing && editing !== 'new' ? 'EDIT EXPENSE' : 'ADD EXPENSE'}</DialogTitle></DialogHeader>
          {editing && <ExpenseForm value={editing === 'new' ? null : editing} schools={data.schools} onDone={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
