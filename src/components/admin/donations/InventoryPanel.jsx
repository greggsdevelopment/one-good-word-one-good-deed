import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Search, Download, AlertTriangle, PackageMinus, PackagePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast as sonner } from 'sonner';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '@/lib/donations';
import { changeStock, downloadCsv, isLowStock, itemLabel } from './inventoryOps';

const label = 'font-barlow-condensed text-xs uppercase tracking-wider text-ash block mb-1';
const selectClass = 'w-full h-9 border border-input rounded-md px-3 text-sm bg-transparent';

const EMPTY = {
  name: '', category: 'School supplies', unit: 'each', size: '', condition: 'New', location: '',
  target_quantity: '', low_stock_threshold: '', notes: '', active: true, starting_quantity: '',
};

function ItemDialog({ item, recordedBy, onClose, onSaved }) {
  const isNew = !item.id;
  const [form, setForm] = useState({ ...EMPTY, ...item, target_quantity: item.target_quantity ?? '', low_stock_threshold: item.low_stock_threshold ?? '' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const num = (v) => (v === '' || v == null ? null : Math.max(0, Math.trunc(Number(v))));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        category: form.category,
        unit: form.unit || 'each',
        size: form.size,
        condition: form.condition,
        location: form.location,
        target_quantity: num(form.target_quantity),
        low_stock_threshold: num(form.low_stock_threshold),
        notes: form.notes,
        active: !!form.active,
      };
      if (isNew) {
        const created = await base44.entities.InventoryItem.create({ ...data, quantity_on_hand: 0 });
        const start = num(form.starting_quantity);
        if (start) await changeStock(created.id, start, { type: 'adjustment', reason: 'Starting count', recorded_by: recordedBy });
      } else {
        await base44.entities.InventoryItem.update(item.id, data);
      }
      onSaved();
      onClose();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${item.name}? Its history rows stay in the log.`)) return;
    await base44.entities.InventoryItem.delete(item.id);
    onSaved();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-anton tracking-wide text-xl">{isNew ? 'NEW INVENTORY ITEM' : 'EDIT ITEM'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div><span className={label}>Name *</span><Input required value={form.name} onChange={set('name')} placeholder="e.g. Backpacks (kids)" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Category</span>
              <select className={selectClass} value={form.category} onChange={set('category')}>
                {ITEM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <span className={label}>Condition</span>
              <select className={selectClass} value={form.condition} onChange={set('condition')}>
                {ITEM_CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><span className={label}>Size</span><Input value={form.size} onChange={set('size')} placeholder="optional" /></div>
            <div><span className={label}>Unit</span><Input value={form.unit} onChange={set('unit')} /></div>
            <div><span className={label}>Location</span><Input value={form.location} onChange={set('location')} placeholder="e.g. Garage" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {isNew && <div><span className={label}>Starting count</span><Input type="number" min={0} value={form.starting_quantity} onChange={set('starting_quantity')} /></div>}
            <div><span className={label}>Target</span><Input type="number" min={0} value={form.target_quantity} onChange={set('target_quantity')} /></div>
            <div><span className={label}>Low at</span><Input type="number" min={0} value={form.low_stock_threshold} onChange={set('low_stock_threshold')} /></div>
          </div>
          <div><span className={label}>Notes</span><Textarea rows={2} value={form.notes} onChange={set('notes')} /></div>
          <label className="flex items-center gap-2 font-barlow text-sm">
            <Switch checked={!!form.active} onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))} /> Active (uncheck to archive)
          </label>
          {!isNew && <p className="font-barlow text-xs text-ash">To change the count, use Add or Remove on the table so it lands in History.</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="flex-1 bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
              {saving ? 'Saving...' : 'Save Item'}
            </Button>
            {!isNew && (
              <Button type="button" variant="outline" onClick={remove} className="text-red-600 font-barlow-condensed uppercase tracking-wider">Delete</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StockDialog({ item, mode, recordedBy, onClose, onSaved }) {
  const [qty, setQty] = useState('');
  const [type, setType] = useState(mode === 'add' ? 'received' : 'distributed');
  const [recipient, setRecipient] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const onHand = Number(item.quantity_on_hand) || 0;

  const save = async (e) => {
    e.preventDefault();
    const n = Math.trunc(Number(qty));
    if (!n || n < 1) return;
    setSaving(true);
    try {
      await changeStock(item.id, mode === 'add' ? n : -n, { type, reason, recipient, recorded_by: recordedBy });
      sonner.success(mode === 'add' ? `Added ${n}` : `Removed ${n}`, { description: itemLabel(item) });
      onSaved();
      onClose();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-anton tracking-wide text-xl">{mode === 'add' ? 'ADD STOCK' : 'REMOVE STOCK'}</DialogTitle>
        </DialogHeader>
        <p className="font-barlow text-sm text-ink -mt-2">{itemLabel(item)} · <span className="text-ash">{onHand} {item.unit || 'each'} on hand</span></p>
        <form onSubmit={save} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Quantity *</span>
              <Input required autoFocus type="number" min={1} max={mode === 'remove' ? onHand : undefined} value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div>
              <span className={label}>Type</span>
              <select className={selectClass} value={type} onChange={(e) => setType(e.target.value)}>
                {mode === 'add' ? (
                  <>
                    <option value="received">Received (donated)</option>
                    <option value="adjustment">Count correction</option>
                  </>
                ) : (
                  <>
                    <option value="distributed">Given out</option>
                    <option value="adjustment">Count correction / damaged</option>
                  </>
                )}
              </select>
            </div>
          </div>
          {mode === 'remove' && type === 'distributed' && (
            <div><span className={label}>Given to / where</span><Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. A Night For Drayke, Stevenson MS" /></div>
          )}
          <div><span className={label}>Note</span><Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="optional" /></div>
          <Button type="submit" disabled={saving || !qty} className="w-full bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function InventoryPanel({ inventory, recordedBy, onChange }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showArchived, setShowArchived] = useState(false);
  const [lowOnly, setLowOnly] = useState(false);
  const [editing, setEditing] = useState(null);
  const [stock, setStock] = useState(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inventory
      .filter((it) => (showArchived ? true : it.active !== false))
      .filter((it) => category === 'All' || it.category === category)
      .filter((it) => !lowOnly || isLowStock(it))
      .filter((it) => !q || [it.name, it.size, it.location, it.notes, it.category].some((v) => (v || '').toLowerCase().includes(q)))
      .sort((a, b) => (a.category || '').localeCompare(b.category || '') || (a.name || '').localeCompare(b.name || ''));
  }, [inventory, search, category, showArchived, lowOnly]);

  const totalUnits = rows.reduce((s, it) => s + (Number(it.quantity_on_hand) || 0), 0);

  const exportCsv = () =>
    downloadCsv(`ogwogd-inventory-${format(new Date(), 'yyyy-MM-dd')}.csv`, [
      { label: 'Name', value: 'name' },
      { label: 'Category', value: 'category' },
      { label: 'Size', value: 'size' },
      { label: 'Condition', value: 'condition' },
      { label: 'On hand', value: (r) => r.quantity_on_hand || 0 },
      { label: 'Unit', value: 'unit' },
      { label: 'Target', value: 'target_quantity' },
      { label: 'Low at', value: 'low_stock_threshold' },
      { label: 'Low stock', value: (r) => (isLowStock(r) ? 'yes' : '') },
      { label: 'Location', value: 'location' },
      { label: 'Active', value: (r) => (r.active === false ? 'no' : 'yes') },
      { label: 'Notes', value: 'notes' },
    ], rows);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventory" className="pl-9 bg-white" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 border border-input rounded-md px-3 text-sm bg-white">
          <option>All</option>
          {ITEM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-1.5 font-barlow text-sm text-ink/70">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} /> Low only
        </label>
        <label className="flex items-center gap-1.5 font-barlow text-sm text-ink/70">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Archived
        </label>
        <Button size="sm" variant="outline" onClick={exportCsv} disabled={!rows.length} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5">
          <Download className="w-3.5 h-3.5" /> CSV
        </Button>
        <Button size="sm" onClick={() => setEditing({})} className="bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold uppercase tracking-wider text-xs gap-1.5">
          <Plus className="w-4 h-4" /> New Item
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="font-barlow text-ash text-center py-12">
          {inventory.length ? 'No items match.' : 'No inventory yet. Mark a donation Received or add an item.'}
        </p>
      ) : (
        <div className="bg-white border border-ink/10 rounded-sm overflow-x-auto">
          <table className="w-full text-sm font-barlow">
            <thead>
              <tr className="border-b border-ink/10 text-left font-barlow-condensed text-[11px] uppercase tracking-wider text-ash">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-right">On hand</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Target</th>
                <th className="px-4 py-3 hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((it) => {
                const low = isLowStock(it);
                return (
                  <tr key={it.id} className={`border-b border-ink/5 last:border-0 ${it.active === false ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{it.name}</p>
                      <p className="text-xs text-ash">{[it.size, it.condition].filter(Boolean).join(' · ')}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-ink/70">{it.category}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className={`font-anton text-lg ${low ? 'text-red-600' : 'text-ink'}`}>{it.quantity_on_hand || 0}</span>
                      <span className="text-xs text-ash ml-1">{it.unit || 'each'}</span>
                      {low && <AlertTriangle className="w-3.5 h-3.5 text-red-600 inline ml-1 -mt-1" aria-label="Low stock" />}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell text-ink/60">{it.target_quantity ?? ''}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-ink/60">{it.location || ''}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setStock({ item: it, mode: 'add' })} aria-label="Add stock" title="Add stock">
                          <PackagePlus className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8" disabled={!it.quantity_on_hand} onClick={() => setStock({ item: it, mode: 'remove' })} aria-label="Remove stock" title="Give out / remove">
                          <PackageMinus className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(it)} aria-label="Edit" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-ink/10 font-barlow-condensed text-xs uppercase tracking-wider text-ash">
                <td className="px-4 py-3" colSpan={2}>{rows.length} {rows.length === 1 ? 'item' : 'items'}</td>
                <td className="px-4 py-3 text-right">{totalUnits.toLocaleString()} units</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {editing && <ItemDialog item={editing} recordedBy={recordedBy} onClose={() => setEditing(null)} onSaved={onChange} />}
      {stock && <StockDialog item={stock.item} mode={stock.mode} recordedBy={recordedBy} onClose={() => setStock(null)} onSaved={onChange} />}
    </div>
  );
}
