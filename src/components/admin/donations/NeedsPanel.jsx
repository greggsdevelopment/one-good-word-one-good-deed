import { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Sparkles, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast as sonner } from 'sonner';
import { ITEM_CATEGORIES, ITEM_CONDITIONS, NEED_STATUSES, STARTER_NEEDS, conditionsFor } from '@/lib/donations';
import { itemLabel } from './inventoryOps';

const label = 'font-barlow-condensed text-xs uppercase tracking-wider text-ash block mb-1';
const selectClass = 'w-full h-9 border border-input rounded-md px-3 text-sm bg-transparent';

const STATUS_STYLE = {
  open: 'bg-green-100 text-green-800',
  paused: 'bg-amber-100 text-amber-800',
  full: 'bg-blue-100 text-blue-800',
};
const STATUS_HELP = {
  open: 'Shown on the form. Donors can offer it.',
  paused: 'Hidden from the form. Use this while you sort things out.',
  full: 'Hidden from the form and listed as covered, so donors stop offering it.',
};

const EMPTY = {
  name: '', category: 'School supplies', details: '', accepted_conditions: ['New', 'Like new'],
  status: 'open', max_per_donation: '', target_quantity: '', inventory_item_id: '', sort_order: 100,
};

const num = (v) => (v === '' || v == null ? null : Math.max(0, Math.trunc(Number(v))));

function NeedDialog({ need, inventory, onClose, onSaved }) {
  const isNew = !need.id;
  const [form, setForm] = useState({
    ...EMPTY,
    ...need,
    max_per_donation: need.max_per_donation ?? '',
    target_quantity: need.target_quantity ?? '',
    inventory_item_id: need.inventory_item_id || '',
    accepted_conditions: Array.isArray(need.accepted_conditions) && need.accepted_conditions.length ? need.accepted_conditions : EMPTY.accepted_conditions,
  });
  const [createInventory, setCreateInventory] = useState(isNew);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const toggleCondition = (c) =>
    setForm((p) => {
      const has = p.accepted_conditions.includes(c);
      const next = has ? p.accepted_conditions.filter((x) => x !== c) : [...p.accepted_conditions, c];
      return { ...p, accepted_conditions: ITEM_CONDITIONS.filter((x) => next.includes(x)) };
    });

  const save = async (e) => {
    e.preventDefault();
    if (!form.accepted_conditions.length) {
      sonner.error('Pick at least one condition you will accept.');
      return;
    }
    setSaving(true);
    try {
      let inventoryId = form.inventory_item_id;
      if (!inventoryId && createInventory) {
        const created = await base44.entities.InventoryItem.create({
          name: form.name.trim(),
          category: form.category,
          condition: form.accepted_conditions[0],
          quantity_on_hand: 0,
          unit: 'each',
          target_quantity: num(form.target_quantity),
          active: true,
        });
        inventoryId = created.id;
      }
      const data = {
        name: form.name.trim(),
        category: form.category,
        details: form.details.trim(),
        accepted_conditions: form.accepted_conditions,
        status: NEED_STATUSES.includes(form.status) ? form.status : 'open',
        max_per_donation: num(form.max_per_donation),
        target_quantity: num(form.target_quantity),
        inventory_item_id: inventoryId || '',
        sort_order: Number(form.sort_order) || 100,
      };
      if (isNew) await base44.entities.DonationNeed.create(data);
      else await base44.entities.DonationNeed.update(need.id, data);
      sonner.success(isNew ? 'Added to the list' : 'Saved');
      onSaved();
      onClose();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Remove ${need.name} from the list? Past offers and inventory are kept.`)) return;
    await base44.entities.DonationNeed.delete(need.id);
    onSaved();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-anton tracking-wide text-xl">{isNew ? 'ADD TO THE LIST' : 'EDIT LIST ITEM'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div><span className={label}>Name donors see *</span><Input required value={form.name} onChange={set('name')} placeholder="e.g. Backpacks" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Category</span>
              <select className={selectClass} value={form.category} onChange={set('category')}>
                {ITEM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <span className={label}>Status</span>
              <select className={selectClass} value={form.status} onChange={set('status')}>
                {NEED_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <p className="font-barlow text-[11px] text-ash mt-1">{STATUS_HELP[form.status]}</p>
            </div>
          </div>
          <div><span className={label}>Rules donors see</span><Textarea rows={2} value={form.details} onChange={set('details')} placeholder="e.g. Kids and teen sizes. Zippers must work." /></div>
          <div>
            <span className={label}>Conditions we accept *</span>
            <div className="flex flex-wrap gap-4">
              {ITEM_CONDITIONS.map((c) => (
                <label key={c} className="flex items-center gap-1.5 font-barlow text-sm">
                  <input type="checkbox" checked={form.accepted_conditions.includes(c)} onChange={() => toggleCondition(c)} /> {c}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><span className={label}>Max per offer</span><Input type="number" min={1} value={form.max_per_donation} onChange={set('max_per_donation')} placeholder="no cap" /></div>
            <div><span className={label}>Target on hand</span><Input type="number" min={0} value={form.target_quantity} onChange={set('target_quantity')} /></div>
            <div><span className={label}>Sort</span><Input type="number" value={form.sort_order} onChange={set('sort_order')} /></div>
          </div>
          <div>
            <span className={label}>Counts into inventory item</span>
            <select className={selectClass} value={form.inventory_item_id} onChange={(e) => { setForm((p) => ({ ...p, inventory_item_id: e.target.value })); if (e.target.value) setCreateInventory(false); }}>
              <option value="">{createInventory ? 'Create a new inventory item with this name' : 'None yet'}</option>
              {inventory.map((it) => (
                <option key={it.id} value={it.id}>{itemLabel(it)} ({it.quantity_on_hand || 0} on hand)</option>
              ))}
            </select>
            {!form.inventory_item_id && (
              <label className="flex items-center gap-1.5 font-barlow text-xs text-ash mt-1.5">
                <input type="checkbox" checked={createInventory} onChange={(e) => setCreateInventory(e.target.checked)} /> Create a matching inventory item
              </label>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="flex-1 bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
              {saving ? 'Saving...' : isNew ? 'Add to List' : 'Save'}
            </Button>
            {!isNew && (
              <Button type="button" variant="outline" onClick={remove} className="text-red-600 font-barlow-condensed uppercase tracking-wider">Remove</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function NeedsPanel({ needs, inventory, onChange }) {
  const [editing, setEditing] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const inventoryById = useMemo(() => new Map(inventory.map((i) => [i.id, i])), [inventory]);

  const rows = useMemo(
    () => [...needs].sort((a, b) => (Number(a.sort_order) || 100) - (Number(b.sort_order) || 100) || (a.name || '').localeCompare(b.name || '')),
    [needs],
  );

  const setStatus = async (need, status) => {
    try {
      await base44.entities.DonationNeed.update(need.id, { status });
      sonner.success(`${need.name}: ${status}`);
      onChange();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    }
  };

  const seed = async () => {
    setSeeding(true);
    try {
      for (const n of STARTER_NEEDS) {
        const created = await base44.entities.InventoryItem.create({
          name: n.name,
          category: n.category,
          condition: n.accepted_conditions[0],
          quantity_on_hand: 0,
          unit: 'each',
          target_quantity: n.target_quantity,
          active: true,
        });
        await base44.entities.DonationNeed.create({ ...n, status: 'open', inventory_item_id: created.id });
      }
      sonner.success('Starter list added', { description: 'Edit anything, or remove what you do not want.' });
      onChange();
    } catch (err) {
      sonner.error('Could not add the starter list', { description: err?.message });
      onChange();
    } finally {
      setSeeding(false);
    }
  };

  const openCount = rows.filter((n) => (n.status || 'open') === 'open').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-barlow text-sm text-ash">
          Donors can only offer what is <span className="font-semibold text-green-700">open</span> here, in the conditions you tick.
          {' '}{openCount} of {rows.length} open.
        </p>
        <Button size="sm" onClick={() => setEditing({})} className="bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold uppercase tracking-wider text-xs gap-1.5">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-ink/10 rounded-sm p-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-amber-700 font-barlow text-sm">
            <AlertTriangle className="w-4 h-4" /> The list is empty, so the donate page is not taking any item offers.
          </div>
          <p className="font-barlow text-ash text-sm">Start with a sensible default list and edit from there, or add items one at a time.</p>
          <Button onClick={seed} disabled={seeding} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider gap-1.5">
            <Sparkles className="w-4 h-4" /> {seeding ? 'Adding...' : 'Add Starter List'}
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-ink/10 rounded-sm overflow-x-auto">
          <table className="w-full text-sm font-barlow">
            <thead>
              <tr className="border-b border-ink/10 text-left font-barlow-condensed text-[11px] uppercase tracking-wider text-ash">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 hidden sm:table-cell">Accepts</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Max / offer</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">On hand / target</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((n) => {
                const inv = n.inventory_item_id ? inventoryById.get(n.inventory_item_id) : null;
                const onHand = inv ? Number(inv.quantity_on_hand) || 0 : null;
                const target = n.target_quantity ?? inv?.target_quantity ?? null;
                const atTarget = onHand != null && target != null && target > 0 && onHand >= target;
                const status = n.status || 'open';
                return (
                  <tr key={n.id} className={`border-b border-ink/5 last:border-0 ${status !== 'open' ? 'opacity-70' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{n.name}</p>
                      <p className="text-xs text-ash">{n.category}{n.details ? ` · ${n.details}` : ''}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-ink/70">{conditionsFor(n).join(', ')}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell text-ink/60">{n.max_per_donation || ''}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell whitespace-nowrap">
                      {onHand != null ? (
                        <span className={atTarget && status === 'open' ? 'text-blue-700 font-semibold' : 'text-ink/70'}>
                          {onHand}{target ? ` / ${target}` : ''}
                          {atTarget && status === 'open' ? ' · at target' : ''}
                        </span>
                      ) : (
                        <span className="text-ash">not tracked</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={status}
                        onChange={(e) => setStatus(n, e.target.value)}
                        aria-label={`Status for ${n.name}`}
                        className={`h-8 rounded-full px-2.5 text-[11px] font-barlow-condensed uppercase tracking-wider border-0 cursor-pointer ${STATUS_STYLE[status]}`}
                      >
                        {NEED_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(n)} aria-label={`Edit ${n.name}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && <NeedDialog need={editing} inventory={inventory} onClose={() => setEditing(null)} onSaved={onChange} />}
    </div>
  );
}
