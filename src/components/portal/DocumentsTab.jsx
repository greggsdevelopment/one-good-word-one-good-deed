import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ExternalLink, FileText, FolderOpen, Loader2, Upload } from 'lucide-react';
import { DOC_KINDS, callPortal, portalKey, prettyDate, uploadPrivate } from '@/lib/portal';
import { Card, Chip, Empty, Field, PrimaryButton, inputCls } from './ui';

const SCHOOL_KINDS = ['purchase_order', 'agreement', 'photo_release', 'other'];

export default function DocumentsTab({ data, schoolId }) {
  const qc = useQueryClient();
  const [opening, setOpening] = useState(null);
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('purchase_order');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const docs = data.documents || [];

  const open = async (doc) => {
    setOpening(doc.id);
    // Open the tab right away (browsers block pop-ups opened after a wait), then point it at the file.
    const win = window.open('about:blank', '_blank');
    if (win) win.opener = null;
    try {
      const { url } = await callPortal('documentUrl', { school_id: schoolId, doc_id: doc.id });
      if (win) win.location.href = url;
      else window.location.href = url;
    } catch (err) {
      if (win) win.close();
      toast.error('Could not open the file', { description: err.message });
    } finally {
      setOpening(null);
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('Give the file a name.');
    if (!file) return setError('Choose a file.');
    setBusy(true);
    try {
      const { file_uri, file_name } = await uploadPrivate(file);
      await callPortal('addDocument', { school_id: schoolId, title: title.trim(), kind, file_uri, file_name });
      toast.success('Uploaded', { description: 'Our team has been notified.' });
      setTitle('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      qc.invalidateQueries({ queryKey: portalKey(schoolId) });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-3">
        {docs.length ? (
          docs.map((d) => (
            <Card key={d.id} className="p-4 flex items-center gap-4">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-white/[0.06] shrink-0"><FileText className="w-5 h-5 text-cream/70" /></span>
              <div className="min-w-0 flex-1">
                <p className="font-barlow-condensed font-bold uppercase tracking-wide truncate">{d.title}</p>
                <p className="font-barlow text-xs text-cream/50 flex flex-wrap items-center gap-2 mt-0.5">
                  <Chip>{DOC_KINDS[d.kind] || 'File'}</Chip>
                  <span>{d.uploaded_by === 'school' ? 'From your team' : 'From OGWOGD'}</span>
                  <span>{prettyDate(d.created_date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
              </div>
              <button type="button" onClick={() => open(d)} disabled={opening === d.id} className="min-h-[44px] px-4 rounded-xl border border-white/15 hover:border-white/30 font-barlow-condensed uppercase tracking-wider text-xs inline-flex items-center gap-2 shrink-0">
                {opening === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />} Open
              </button>
            </Card>
          ))
        ) : (
          <Empty icon={FolderOpen} title="No documents yet">Agreements, our W-9, quotes and survey reports will be here.</Empty>
        )}
      </div>

      {!data.viewingAsAdmin && (
        <Card className="p-5 h-fit">
          <p className="font-barlow-condensed font-bold uppercase tracking-wider text-sm">Send us a file</p>
          <p className="font-barlow text-sm text-cream/55 mt-1">Purchase orders, signed agreements, photo releases. Files are private to your school and our team.</p>
          <form onSubmit={upload} className="mt-4 space-y-3" noValidate>
            <Field label="Name">
              <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="PO 5512 for spring program" maxLength={120} />
            </Field>
            <Field label="Type">
              <select className={inputCls} value={kind} onChange={(e) => setKind(e.target.value)}>
                {SCHOOL_KINDS.map((k) => <option key={k} value={k}>{DOC_KINDS[k]}</option>)}
              </select>
            </Field>
            <Field label="File" hint="PDF, image or document, up to 20 MB">
              <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.heic,.doc,.docx,.xls,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full font-barlow text-sm text-cream/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-cream" />
            </Field>
            {error && <p role="alert" className="font-barlow text-sm text-rb-red">{error}</p>}
            <PrimaryButton busy={busy} className="w-full"><Upload className="w-4 h-4" /> Upload</PrimaryButton>
          </form>
        </Card>
      )}
    </div>
  );
}
