import { base44 } from '@/api/base44Client';

export const itemLabel = (it) => [it.name, it.size].filter(Boolean).join(' · ');

export function isLowStock(item) {
  const qty = Number(item.quantity_on_hand) || 0;
  if (item.low_stock_threshold != null && item.low_stock_threshold !== '') {
    return qty <= Number(item.low_stock_threshold);
  }
  if (item.target_quantity) return qty < Number(item.target_quantity) * 0.25;
  return false;
}

async function freshItem(id) {
  const rows = await base44.entities.InventoryItem.filter({ id });
  const item = rows?.[0];
  if (!item) throw new Error('That inventory item no longer exists.');
  return item;
}

/**
 * Change an item's on-hand count and write the matching history row.
 * delta > 0 adds, delta < 0 removes. Refuses to go below zero.
 */
export async function changeStock(itemId, delta, meta = {}) {
  const change = Math.trunc(Number(delta));
  if (!Number.isFinite(change) || change === 0) throw new Error('Enter a quantity other than zero.');
  const item = await freshItem(itemId);
  const current = Number(item.quantity_on_hand) || 0;
  const next = current + change;
  if (next < 0) throw new Error(`Only ${current} on hand for ${item.name}.`);
  await base44.entities.InventoryItem.update(itemId, { quantity_on_hand: next });
  await base44.entities.InventoryTransaction.create({
    item_id: itemId,
    item_name: itemLabel(item),
    change,
    type: meta.type || (change > 0 ? 'received' : 'distributed'),
    reason: meta.reason || '',
    recipient: meta.recipient || '',
    donation_id: meta.donation_id || '',
    donor_name: meta.donor_name || '',
    quantity_after: next,
    recorded_by: meta.recorded_by || '',
  });
  return next;
}

/**
 * Log a donation's lines into inventory, then mark the donation received.
 * lines: [{ include, target: 'new' | itemId, name, category, condition, size, quantity }]
 */
export async function receiveDonation(donation, lines, recordedBy) {
  for (const line of lines) {
    if (!line.include) continue;
    const qty = Math.trunc(Number(line.quantity));
    if (!qty || qty < 1) continue;
    let itemId = line.target;
    if (itemId === 'new') {
      const created = await base44.entities.InventoryItem.create({
        name: line.name.trim() || line.category,
        category: line.category,
        condition: line.condition,
        size: line.size || '',
        quantity_on_hand: 0,
        unit: 'each',
        active: true,
      });
      itemId = created.id;
    }
    await changeStock(itemId, qty, {
      type: 'received',
      reason: 'Donation received',
      donation_id: donation.id,
      donor_name: donation.donor_name,
      recorded_by: recordedBy,
    });
  }
  await base44.entities.ItemDonation.update(donation.id, {
    status: 'received',
    received_at: new Date().toISOString(),
  });
}

// Spreadsheet apps run cells that start with = + - @ (or tab/CR) as formulas.
// Prefix those with an apostrophe so exported form text can never execute.
function neutralize(s) {
  if (/^-?\d+(\.\d+)?$/.test(s)) return s; // plain numbers, e.g. -4 in inventory history
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

function csvCell(value) {
  const s = neutralize(value == null ? '' : String(value));
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCsv(filename, columns, rows) {
  const header = columns.map((c) => csvCell(c.label)).join(',');
  const body = rows.map((r) => columns.map((c) => csvCell(typeof c.value === 'function' ? c.value(r) : r[c.value])).join(','));
  const blob = new Blob([[header, ...body].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
