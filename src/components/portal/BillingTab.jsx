import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronDown, Download, FileText, Loader2, Receipt } from 'lucide-react';
import { INVOICE_STATE, downloadInvoicePdf, invoiceSubtotal, money, prettyDate } from '@/lib/portal';
import { Card, Chip, Empty, GhostButton } from './ui';

function InvoiceRow({ inv, school }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const state = INVOICE_STATE[inv.state] || INVOICE_STATE.sent;
  const pdf = async () => {
    setBusy(true);
    try {
      await downloadInvoicePdf(inv, school);
    } catch {
      toast.error('Could not make the PDF', { description: 'Try again, or ask us to email it.' });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card className="overflow-hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-white/[0.02]">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/[0.06] shrink-0"><FileText className="w-5 h-5 text-cream/70" /></span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-barlow-condensed font-bold text-lg tracking-wide">{inv.number}</span>
            <Chip tone={state.tone}>{state.label}</Chip>
          </span>
          <span className="block font-barlow text-sm text-cream/55">
            Issued {prettyDate(inv.issue_date, { month: 'short', day: 'numeric', year: 'numeric' })}
            {inv.due_date ? ` · due ${prettyDate(inv.due_date, { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
            {inv.po_number ? ` · PO ${inv.po_number}` : ''}
          </span>
        </span>
        <span className="text-right shrink-0">
          <span className="block font-anton text-xl">{money(inv.balance > 0 ? inv.balance : inv.total)}</span>
          <span className="block font-barlow text-xs text-cream/45">{inv.balance > 0 ? `of ${money(inv.total)}` : 'total'}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-cream/40 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-5 border-t border-white/[0.06] pt-4">
              <table className="w-full font-barlow text-sm">
                <thead>
                  <tr className="text-cream/45 text-left font-barlow-condensed uppercase tracking-wider text-[11px]">
                    <th className="pb-2 font-normal">Item</th>
                    <th className="pb-2 font-normal text-right">Qty</th>
                    <th className="pb-2 font-normal text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(inv.line_items || []).map((it, i) => (
                    <tr key={i} className="border-t border-white/[0.05]">
                      <td className="py-2 pr-3 text-cream/85">{it.description}</td>
                      <td className="py-2 text-right text-cream/60">{it.quantity}</td>
                      <td className="py-2 text-right">{money((Number(it.quantity) || 0) * (Number(it.unit_price) || 0))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="text-cream/80">
                  {Number(inv.discount) > 0 && (
                    <tr><td colSpan={2} className="pt-2 text-right text-cream/55">Subtotal {money(invoiceSubtotal(inv))} · Discount</td><td className="pt-2 text-right">-{money(inv.discount)}</td></tr>
                  )}
                  <tr><td colSpan={2} className="pt-2 text-right font-semibold">Total</td><td className="pt-2 text-right font-semibold">{money(inv.total)}</td></tr>
                  {inv.paid > 0 && <tr><td colSpan={2} className="text-right text-cream/55">Paid</td><td className="text-right text-rb-green">-{money(inv.paid)}</td></tr>}
                  <tr><td colSpan={2} className="text-right font-semibold">Balance</td><td className="text-right font-semibold">{money(inv.balance)}</td></tr>
                </tfoot>
              </table>
              {inv.payments?.length > 0 && (
                <div className="mt-4">
                  <p className="font-barlow-condensed uppercase tracking-wider text-[11px] text-cream/45 mb-1">Payments received</p>
                  <ul className="font-barlow text-sm text-cream/75 space-y-0.5">
                    {inv.payments.map((p) => (
                      <li key={p.id}>
                        {prettyDate(p.received_date, { month: 'short', day: 'numeric', year: 'numeric' })}: {money(p.amount)} by {p.method || 'payment'}
                        {p.reference ? ` (#${p.reference})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {inv.notes && <p className="mt-3 font-barlow text-sm text-cream/65 whitespace-pre-wrap">{inv.notes}</p>}
              <div className="mt-4">
                <GhostButton onClick={pdf} disabled={busy}>
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download PDF
                </GhostButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function BillingTab({ data, go }) {
  const invoices = (data.invoices || []).filter((i) => i.state !== 'void');
  const billed = invoices.reduce((s, i) => s + i.total, 0);
  const paid = invoices.reduce((s, i) => s + i.paid, 0);
  const due = invoices.reduce((s, i) => s + i.balance, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          ['Billed', billed, 'text-cream'],
          ['Paid', paid, 'text-rb-green'],
          ['Balance', due, due > 0 ? 'text-rb-yellow' : 'text-cream'],
        ].map(([label, v, tone]) => (
          <Card key={label} className="p-4">
            <p className="font-barlow-condensed uppercase tracking-wider text-[11px] text-cream/50">{label}</p>
            <p className={`font-anton text-2xl sm:text-3xl mt-1 ${tone}`}>{money(v)}</p>
          </Card>
        ))}
      </div>

      {invoices.length ? (
        <div className="space-y-3">{invoices.map((inv) => <InvoiceRow key={inv.id} inv={inv} school={data.school} />)}</div>
      ) : (
        <Empty icon={Receipt} title="No invoices yet">Invoices show up here as soon as we send them.</Empty>
      )}

      <Card className="p-5">
        <p className="font-barlow-condensed font-bold uppercase tracking-wider text-sm">How to pay</p>
        <p className="font-barlow text-sm text-cream/70 mt-1">
          We accept check, ACH bank transfer and purchase orders. Our W-9 is under{' '}
          <button type="button" onClick={() => go('documents')} className="underline underline-offset-2 text-cream">Documents</button>. Need a PO number on an invoice or
          a different billing contact?{' '}
          <button type="button" onClick={() => go('messages', { topic: 'billing' })} className="underline underline-offset-2 text-cream">Message us</button>.
        </p>
      </Card>
    </div>
  );
}
