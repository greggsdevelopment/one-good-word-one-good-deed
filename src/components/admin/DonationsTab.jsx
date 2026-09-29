import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { mergeDonationSettings, DONATION_SETTINGS_KEY, DONATION_NEEDS_KEY } from '@/lib/donations';
import IncomingDonations from '@/components/admin/donations/IncomingDonations';
import InventoryPanel from '@/components/admin/donations/InventoryPanel';
import HistoryPanel from '@/components/admin/donations/HistoryPanel';
import DonationSettingsPanel from '@/components/admin/donations/DonationSettingsPanel';
import NeedsPanel from '@/components/admin/donations/NeedsPanel';
import { isLowStock } from '@/components/admin/donations/inventoryOps';

const KEYS = {
  donations: ['admin-item-donations'],
  inventory: ['admin-inventory'],
  history: ['admin-inventory-history'],
  needs: DONATION_NEEDS_KEY,
};

function Stat({ label, value, sub, tone = 'text-ink' }) {
  return (
    <div className="bg-white rounded-sm p-4 border border-ink/5">
      <p className={`font-anton text-3xl ${tone}`}>{value}</p>
      <p className="font-barlow text-ash text-xs">{label}</p>
      {sub && <p className="font-barlow text-xs text-ink/50 mt-0.5">{sub}</p>}
    </div>
  );
}

const subTab = 'font-barlow-condensed uppercase tracking-wider text-xs data-[state=active]:bg-gold data-[state=active]:text-ink';

export default function DonationsTab() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const recordedBy = user?.email || '';

  const settingsQ = useQuery({
    queryKey: DONATION_SETTINGS_KEY,
    queryFn: async () => (await base44.entities.DonationSettings.list('-updated_date', 1))?.[0] || null,
  });
  const donationsQ = useQuery({ queryKey: KEYS.donations, queryFn: () => base44.entities.ItemDonation.list('-created_date', 500) });
  const inventoryQ = useQuery({ queryKey: KEYS.inventory, queryFn: () => base44.entities.InventoryItem.list('name', 1000) });
  const historyQ = useQuery({ queryKey: KEYS.history, queryFn: () => base44.entities.InventoryTransaction.list('-created_date', 1000) });
  const needsQ = useQuery({ queryKey: KEYS.needs, queryFn: () => base44.entities.DonationNeed.list('sort_order', 500) });

  const refresh = () => Object.values(KEYS).forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));

  if (settingsQ.isLoading || donationsQ.isLoading || inventoryQ.isLoading || needsQ.isLoading) {
    return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  }

  const settings = mergeDonationSettings(settingsQ.data);
  const donations = donationsQ.data || [];
  const inventory = inventoryQ.data || [];
  const activeInventory = inventory.filter((i) => i.active !== false);
  const history = historyQ.data || [];
  const needs = needsQ.data || [];
  const openNeeds = needs.filter((n) => (n.status || 'open') === 'open').length;

  const newCount = donations.filter((d) => !d.status || d.status === 'new').length;
  const scheduled = donations.filter((d) => d.status === 'scheduled');
  const nextPickup = scheduled
    .filter((d) => d.scheduled_for)
    .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for))[0];
  const units = activeInventory.reduce((s, i) => s + (Number(i.quantity_on_hand) || 0), 0);
  const low = activeInventory.filter(isLowStock).length;
  const accepting = settings.item_donations_enabled;

  return (
    <div className="space-y-6">
      <SonnerToaster position="bottom-center" richColors closeButton duration={3500} />
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-anton text-ink text-2xl tracking-wide">DONATIONS & INVENTORY</h2>
        <span className={`font-barlow-condensed text-xs uppercase tracking-wider px-3 py-1 rounded-full ${accepting ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          Item donations {accepting ? 'ON' : 'OFF'}
          {accepting && !settings.pickup_enabled ? ' · pickups paused' : ''}
          {accepting && openNeeds === 0 ? ' · list empty' : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="New offers" value={newCount} tone={newCount ? 'text-amber-600' : 'text-ink'} />
        <Stat
          label="Scheduled"
          value={scheduled.length}
          sub={nextPickup ? `Next: ${nextPickup.donor_name}, ${new Date(nextPickup.scheduled_for).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}` : null}
        />
        <Stat label="Units on hand" value={units.toLocaleString()} sub={`${activeInventory.length} ${activeInventory.length === 1 ? 'item' : 'items'}`} />
        <Stat label="Low stock" value={low} tone={low ? 'text-red-600' : 'text-ink'} />
      </div>

      <Tabs defaultValue="offers">
        <TabsList className="bg-white border border-ink/5 mb-4 h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="offers" className={subTab}>Offers {newCount > 0 && `(${newCount})`}</TabsTrigger>
          <TabsTrigger value="needs" className={subTab}>Needs List ({openNeeds} open)</TabsTrigger>
          <TabsTrigger value="inventory" className={subTab}>Inventory</TabsTrigger>
          <TabsTrigger value="history" className={subTab}>History</TabsTrigger>
          <TabsTrigger value="settings" className={subTab}>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="offers">
          <IncomingDonations donations={donations} inventory={activeInventory} needs={needs} recordedBy={recordedBy} onChange={refresh} />
        </TabsContent>
        <TabsContent value="needs">
          <NeedsPanel needs={needs} inventory={activeInventory} onChange={refresh} />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryPanel inventory={inventory} recordedBy={recordedBy} onChange={refresh} />
        </TabsContent>
        <TabsContent value="history">
          <HistoryPanel transactions={history} />
        </TabsContent>
        <TabsContent value="settings">
          <DonationSettingsPanel settings={settings} onSaved={() => queryClient.invalidateQueries({ queryKey: DONATION_SETTINGS_KEY })} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
