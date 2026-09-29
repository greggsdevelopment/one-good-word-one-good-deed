import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { Trash2, MailCheck, MailX } from 'lucide-react';
import ConfirmDelete from '@/components/admin/events/ConfirmDelete';

export function CheckInToggle({ rsvp, onChange }) {
  const toggle = async (v) => {
    await base44.entities.EventRSVP.update(rsvp.id, { checked_in: v, checked_in_at: v ? new Date().toISOString() : null });
    onChange();
  };
  return <Switch checked={!!rsvp.checked_in} onCheckedChange={toggle} />;
}

export function NotesField({ rsvp, onChange }) {
  const save = async (e) => {
    const value = e.target.value;
    if (value === (rsvp.admin_notes || '')) return;
    await base44.entities.EventRSVP.update(rsvp.id, { admin_notes: value });
    onChange();
  };
  return (
    <input
      key={rsvp.id + (rsvp.admin_notes || '')}
      defaultValue={rsvp.admin_notes || ''}
      onBlur={save}
      placeholder="Add note"
      className="w-full min-w-[120px] bg-cream/[0.04] border border-cream/10 rounded-sm px-2 py-1 text-cream text-xs font-barlow placeholder:text-cream/25 focus:outline-none focus:border-gold/40"
    />
  );
}

export function NotifiedIcon({ rsvp }) {
  return rsvp.notification_sent_at
    ? <MailCheck className="w-4 h-4 text-teal-400" title="Notification sent" />
    : <MailX className="w-4 h-4 text-cream/25" title="Notification not sent" />;
}

export function DeleteRsvp({ rsvp, onChange }) {
  const remove = async () => {
    await base44.entities.EventRSVP.delete(rsvp.id);
    onChange();
  };
  return (
    <ConfirmDelete title="Delete RSVP?" description={`This permanently removes the RSVP from ${rsvp.full_name}.`} onConfirm={remove}>
      <button className="text-cream/30 hover:text-red-400 transition-colors" aria-label="Delete RSVP"><Trash2 className="w-4 h-4" /></button>
    </ConfirmDelete>
  );
}