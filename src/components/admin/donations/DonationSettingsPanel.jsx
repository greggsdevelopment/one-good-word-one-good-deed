import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast as sonner } from 'sonner';
import { DONATION_SETTINGS_KEY, PICKUP_ORIGIN_LABEL } from '@/lib/donations';

const label = 'font-barlow-condensed text-xs uppercase tracking-wider text-ash block mb-1';

function Toggle({ checked, onChange, title, body }) {
  return (
    <label className="flex items-start justify-between gap-4 bg-white border border-ink/10 rounded-sm p-4 cursor-pointer">
      <span>
        <span className="block font-barlow-condensed font-bold text-ink tracking-wide">{title}</span>
        <span className="block font-barlow text-ash text-sm">{body}</span>
      </span>
      <span className="flex items-center gap-2 shrink-0">
        <span className={`font-barlow-condensed text-xs uppercase tracking-wider ${checked ? 'text-green-700' : 'text-red-600'}`}>
          {checked ? 'On' : 'Off'}
        </span>
        <Switch checked={checked} onCheckedChange={onChange} />
      </span>
    </label>
  );
}

export default function DonationSettingsPanel({ settings, onSaved }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(settings);
  const [needsText, setNeedsText] = useState((settings.needs || []).join('\n'));
  const [saving, setSaving] = useState(false);

  // Only reset the form when the saved settings actually change, not on every
  // parent render, so an unsaved edit is not wiped by a background refetch.
  const savedKey = JSON.stringify(settings);
  useEffect(() => {
    setForm(settings);
    setNeedsText((settings.needs || []).join('\n'));
  }, [savedKey]);

  const persist = async (patch) => {
    const data = {
      item_donations_enabled: !!patch.item_donations_enabled,
      pickup_enabled: !!patch.pickup_enabled,
      money_donations_enabled: !!patch.money_donations_enabled,
      pickup_radius_miles: Math.min(500, Math.max(1, Number(patch.pickup_radius_miles) || 50)),
      needs: patch.needs,
      dropoff_instructions: patch.dropoff_instructions || '',
      closed_message: patch.closed_message || '',
      gofundme_url: patch.gofundme_url || '',
    };
    if (settings.id) await base44.entities.DonationSettings.update(settings.id, data);
    else await base44.entities.DonationSettings.create(data);
    await queryClient.invalidateQueries({ queryKey: DONATION_SETTINGS_KEY });
    onSaved?.();
  };

  const currentNeeds = () => needsText.split('\n').map((s) => s.trim()).filter(Boolean);

  // Switches save the moment they are flipped, so "turn it off" is one click.
  const flip = (key) => async (value) => {
    const next = { ...form, [key]: value, needs: currentNeeds() };
    setForm(next);
    try {
      await persist(next);
      sonner.success('Saved', { description: 'The donate page is updated.' });
    } catch (err) {
      setForm(form);
      sonner.error('Could not save', { description: err?.message || 'Try again.' });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await persist({ ...form, needs: currentNeeds() });
      sonner.success('Saved', { description: 'The donate page is updated.' });
    } catch (err) {
      sonner.error('Could not save', { description: err?.message || 'Try again.' });
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        <Toggle
          checked={!!form.item_donations_enabled}
          onChange={flip('item_donations_enabled')}
          title="Accept item donations"
          body="Shows the item form on /donate. Off means the server rejects new offers too."
        />
        <Toggle
          checked={!!form.pickup_enabled}
          onChange={flip('pickup_enabled')}
          title="Offer pickups"
          body="Off leaves drop-off open but stops pickup requests."
        />
        <Toggle
          checked={!!form.money_donations_enabled}
          onChange={flip('money_donations_enabled')}
          title="Show money donations (GoFundMe)"
          body="Shows the Give Money section on /donate."
        />
      </div>

      <form onSubmit={save} className="bg-white border border-ink/10 rounded-sm p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <span className={label}>Pickup radius (miles from {PICKUP_ORIGIN_LABEL})</span>
            <Input type="number" min={1} max={500} value={form.pickup_radius_miles} onChange={set('pickup_radius_miles')} />
          </div>
          <div>
            <span className={label}>GoFundMe link</span>
            <Input type="url" value={form.gofundme_url} onChange={set('gofundme_url')} />
          </div>
        </div>
        <div>
          <span className={label}>What we need most (one per line, shown on /donate)</span>
          <Textarea rows={6} value={needsText} onChange={(e) => setNeedsText(e.target.value)} />
        </div>
        <div>
          <span className={label}>Drop-off instructions</span>
          <Textarea rows={2} value={form.dropoff_instructions} onChange={set('dropoff_instructions')} />
        </div>
        <div>
          <span className={label}>Message when donations are off</span>
          <Textarea rows={2} value={form.closed_message} onChange={set('closed_message')} />
        </div>
        <Button type="submit" disabled={saving} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
