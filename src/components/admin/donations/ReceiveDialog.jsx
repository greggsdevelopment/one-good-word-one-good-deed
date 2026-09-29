import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast as sonner } from 'sonner';
import { itemLabel, receiveDonation } from './inventoryOps';

const label = 'font-barlow-condensed text-[11px] uppercase tracking-wider text-ash block mb-1';

function guessTarget(line, inventory, needs) {
  const need = needs.find((n) => n.id === line.need_id);
  if (need?.inventory_item_id && inventory.some((it) => it.id === need.inventory_item_id)) return need.inventory_item_id;
  const name = (line.name || line.description || line.category || '').trim().toLowerCase();
  const exact = inventory.find((it) => (it.name || '').trim().toLowerCase() === name);
  return exact ? exact.id : 'new';
}

export default function ReceiveDialog({ donation, inventory, needs = [], recordedBy, onClose, onDone }) {
  const initial = useMemo(
    () =>
      (donation.items || []).map((line) => ({
        include: true,
        target: guessTarget(line, inventory, needs),
        name: line.name || line.description || line.category,
        category: line.category,
        condition: line.condition,
        size: line.need_id === 'other' ? '' : line.description || '',
        quantity: line.quantity,
        offered: line.quantity,
        offList: line.need_id === 'other',
      })),
    [donation, inventory, needs],
  );
  const [lines, setLines] = useState(initial);
  const [saving, setSaving] = useState(false);

  const update = (idx, patch) => setLines((ls) => ls.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

  const submit = async () => {
    setSaving(true);
    try {
      await receiveDonation(donation, lines, recordedBy);
      sonner.success('Logged into inventory', { description: `${donation.donor_name}'s donation is marked received.` });
      onDone();
      onClose();
    } catch (err) {
      sonner.error('Could not finish', { description: err?.message || 'Some lines may have saved. Check History.' });
      onDone();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-anton tracking-wide text-xl">RECEIVE INTO INVENTORY</DialogTitle>
        </DialogHeader>
        <p className="font-barlow text-sm text-ash -mt-2">
          Count what actually came in. Uncheck anything that did not show up or that you are not keeping.
        </p>

        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div key={idx} className={`border rounded-sm p-3 ${line.include ? 'border-ink/15 bg-white' : 'border-ink/5 bg-ink/[0.02] opacity-60'}`}>
              <label className="flex items-center gap-2 font-barlow text-sm font-semibold text-ink mb-3">
                <input type="checkbox" checked={line.include} onChange={(e) => update(idx, { include: e.target.checked })} />
                {line.offered} x {line.name}
                {line.size ? ` (${line.size})` : ''} · {line.condition}
                {line.offList && <span className="ml-1 text-[10px] font-barlow-condensed uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">not on list</span>}
              </label>
              {line.include && (
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 sm:col-span-5">
                    <span className={label}>Add to</span>
                    <select
                      value={line.target}
                      onChange={(e) => update(idx, { target: e.target.value })}
                      className="w-full h-9 border border-input rounded-md px-2 text-sm bg-transparent"
                    >
                      <option value="new">+ New inventory item</option>
                      {inventory.map((it) => (
                        <option key={it.id} value={it.id}>
                          {itemLabel(it)} ({it.quantity_on_hand || 0} on hand)
                        </option>
                      ))}
                    </select>
                  </div>
                  {line.target === 'new' && (
                    <>
                      <div className="col-span-8 sm:col-span-4">
                        <span className={label}>New item name</span>
                        <Input value={line.name} onChange={(e) => update(idx, { name: e.target.value })} />
                      </div>
                      <div className="col-span-4 sm:col-span-3">
                        <span className={label}>Size</span>
                        <Input placeholder="optional" value={line.size} onChange={(e) => update(idx, { size: e.target.value })} />
                      </div>
                    </>
                  )}
                  <div className="col-span-4 sm:col-span-2">
                    <span className={label}>Qty in</span>
                    <Input type="number" min={0} value={line.quantity} onChange={(e) => update(idx, { quantity: e.target.value })} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button onClick={submit} disabled={saving} className="w-full bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
          {saving ? 'Saving...' : 'Log Items and Mark Received'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
