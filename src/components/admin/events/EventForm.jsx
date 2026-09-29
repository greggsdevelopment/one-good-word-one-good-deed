import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const CATEGORIES = ['Community Outreach', 'Workshop', 'Gathering', 'School Visit', 'Speaking Engagement', 'Other'];
const EMPTY = {
  title: '', description: '', event_date: '', start_time: '', end_time: '', location: '',
  category: 'Community Outreach', featured: false, registration_url: '', flyer_url: '',
};
const label = 'font-barlow-condensed text-xs uppercase tracking-wider text-ash block mb-1';

export default function EventForm({ event, open, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, ...(event || {}) });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(Object.keys(EMPTY).map((k) => [k, form[k]]));
    if (event?.id) await base44.entities.Event.update(event.id, data);
    else await base44.entities.Event.create(data);
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-anton tracking-wide text-xl">{event?.id ? 'EDIT EVENT' : 'NEW EVENT'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div><span className={label}>Title *</span><Input required value={form.title} onChange={set('title')} /></div>
          <div><span className={label}>Description</span><Textarea rows={3} value={form.description} onChange={set('description')} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><span className={label}>Date *</span><Input required type="date" value={form.event_date} onChange={set('event_date')} /></div>
            <div><span className={label}>Start</span><Input placeholder="5:00 PM" value={form.start_time} onChange={set('start_time')} /></div>
            <div><span className={label}>End</span><Input placeholder="9:00 PM" value={form.end_time} onChange={set('end_time')} /></div>
          </div>
          <div><span className={label}>Location</span><Input value={form.location} onChange={set('location')} /></div>
          <div>
            <span className={label}>Category</span>
            <select value={form.category} onChange={set('category')} className="w-full h-9 border border-input rounded-md px-3 text-sm bg-transparent">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><span className={label}>Registration URL</span><Input value={form.registration_url} onChange={set('registration_url')} /></div>
          <div><span className={label}>Flyer URL</span><Input value={form.flyer_url} onChange={set('flyer_url')} /></div>
          <label className="flex items-center gap-2 font-barlow text-sm">
            <Switch checked={!!form.featured} onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))} /> Featured
          </label>
          <Button type="submit" disabled={saving} className="w-full bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
            {saving ? 'Saving...' : 'Save Event'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}