import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Ticket, CheckCircle, Clock, Phone, Mail, User, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GOFUNDME_LINK = 'https://www.gofundme.com/f/support-one-good-word-one-good-deeds-mission';

function generateTicketNumber() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function CopyableTicket({ ticketNumber }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback select
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Ticket className="w-4 h-4 text-gold shrink-0" />
      <input
        readOnly
        value={`Ticket #${ticketNumber}`}
        className="font-barlow-condensed text-gold font-semibold tracking-widest text-lg bg-transparent border-0 outline-none w-28 cursor-default"
        onFocus={(e) => e.target.select()}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleCopy}
        className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
}

function NotesField({ entry, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(entry.notes || '');

  const handleSave = () => {
    onSave(entry.id, text);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="mt-2 flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Add a note..."
          className="flex-1 bg-ink/5 border border-ink/10 rounded-sm px-3 py-2 text-sm font-barlow text-ink focus:outline-none focus:border-gold/60 resize-none"
        />
        <div className="flex flex-col gap-1">
          <Button size="sm" onClick={handleSave} className="bg-ink text-cream hover:bg-ink/80 font-barlow-condensed text-xs px-3">Save</Button>
          <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="font-barlow-condensed text-xs px-3">Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {entry.notes ? (
        <button
          onClick={() => setEditing(true)}
          className="text-left text-xs font-barlow text-ink/60 italic hover:text-ink transition-colors"
        >
          📝 {entry.notes}
          <span className="text-ink/30 ml-2">(click to edit)</span>
        </button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditing(true)}
          className="font-barlow-condensed text-xs text-ink/40 hover:text-ink gap-1 h-7 px-2"
        >
          + Add note
        </Button>
      )}
    </div>
  );
}

function EntryCard({ entry, onMarkPaid, onSaveNote }) {
  const isPaid = entry.status === 'paid';
  return (
    <div className={`bg-white border rounded-sm p-4 flex flex-col sm:flex-row sm:items-start gap-4 ${isPaid ? 'border-green-200' : 'border-ink/10'}`}>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-ink/40" />
          <span className="font-barlow font-semibold text-ink">{entry.name}</span>
          {isPaid ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-barlow-condensed uppercase tracking-wider">
              <CheckCircle className="w-3 h-3" /> Paid
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-barlow-condensed uppercase tracking-wider">
              <Clock className="w-3 h-3" /> Pending
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-ink/60 font-barlow">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> {entry.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> {entry.phone}
          </span>
          <span className="text-xs bg-ink/5 px-2 py-0.5 rounded">
            Prefers: {entry.preferred_contact === 'email' ? 'Email' : 'Text'}
          </span>
        </div>
        {!isPaid && (
          <div className="mt-2 flex items-center gap-2 bg-amber-50/60 border border-amber-200 rounded-sm px-3 py-2">
            <ExternalLink className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <a
              href={GOFUNDME_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-barlow text-amber-700 hover:text-amber-900 underline break-all"
            >
              GoFundMe payment link sent to entrant
            </a>
          </div>
        )}
        {isPaid && entry.ticket_number && (
          <CopyableTicket ticketNumber={entry.ticket_number} />
        )}
        {entry.created_date && (
          <p className="text-xs text-ink/30 font-barlow mt-1">
            Entered: {new Date(entry.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
        <NotesField entry={entry} onSave={onSaveNote} />
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-barlow-condensed text-ink/60 text-sm">$5.00</p>
        {!isPaid && (
          <Button
            size="sm"
            onClick={() => onMarkPaid(entry)}
            className="bg-ink text-cream hover:bg-ink/80 font-barlow-condensed uppercase tracking-wider text-xs"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark as Paid
          </Button>
        )}
      </div>
    </div>
  );
}

export default function RaffleTab() {
  const queryClient = useQueryClient();
  const [confirmEntry, setConfirmEntry] = useState(null);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['raffleEntries'],
    queryFn: () => base44.entities.RaffleEntry.list('-created_date', 200),
  });

  const markPaid = useMutation({
    mutationFn: async (entry) => {
      const ticketNumber = generateTicketNumber();
      return base44.entities.RaffleEntry.update(entry.id, {
        status: 'paid',
        ticket_number: ticketNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raffleEntries'] });
      setConfirmEntry(null);
    },
  });

  const saveNote = useMutation({
    mutationFn: ({ id, notes }) => base44.entities.RaffleEntry.update(id, { notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['raffleEntries'] }),
  });

  const pending = entries.filter((e) => e.status !== 'paid');
  const paid = entries.filter((e) => e.status === 'paid');

  if (isLoading) {
    return <p className="font-barlow text-ink/40 text-center py-12">Loading raffle entries...</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <Ticket className="w-10 h-10 text-ink/20 mx-auto mb-3" />
        <p className="font-barlow-condensed text-ink/40 uppercase tracking-widest text-sm">No raffle entries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Entries', value: entries.length, color: 'text-ink' },
          { label: 'Pending Payment', value: pending.length, color: 'text-amber-600' },
          { label: 'Paid', value: paid.length, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-ink/5 rounded-sm p-4 text-center">
            <p className={`font-anton text-3xl ${color}`}>{value}</p>
            <p className="font-barlow text-xs text-ink/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Confirm modal */}
      {confirmEntry && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-anton text-xl text-ink tracking-wide">Confirm Payment</h3>
            <p className="font-barlow text-ink/70 text-sm">
              Mark <strong>{confirmEntry.name}</strong> as paid? A 4-digit ticket number will be generated automatically.
            </p>
            <p className="font-barlow text-xs text-ink/40">
              Remember to send the ticket number to {confirmEntry.name} via their preferred method: <strong>{confirmEntry.preferred_contact === 'email' ? confirmEntry.email : confirmEntry.phone}</strong>
            </p>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-ink text-cream hover:bg-ink/80 font-barlow-condensed uppercase tracking-wider text-xs"
                onClick={() => markPaid.mutate(confirmEntry)}
                disabled={markPaid.isPending}
              >
                {markPaid.isPending ? 'Saving...' : 'Confirm & Generate Ticket'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-barlow-condensed uppercase tracking-wider text-xs"
                onClick={() => setConfirmEntry(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pending entries */}
      {pending.length > 0 && (
        <div>
          <p className="font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase mb-3">
            Awaiting Payment ({pending.length})
          </p>
          <div className="space-y-3">
            {pending.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onMarkPaid={setConfirmEntry} onSaveNote={(id, notes) => saveNote.mutate({ id, notes })} />
            ))}
          </div>
        </div>
      )}

      {/* Paid entries */}
      {paid.length > 0 && (
        <div>
          <p className="font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase mb-3">
            Paid — Ticket Assigned ({paid.length})
          </p>
          <div className="space-y-3">
            {paid.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onMarkPaid={setConfirmEntry} onSaveNote={(id, notes) => saveNote.mutate({ id, notes })} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}