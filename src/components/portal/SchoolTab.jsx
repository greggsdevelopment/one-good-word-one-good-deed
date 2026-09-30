import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Building2, Mail, Phone, Star, UserPlus, UserRound } from 'lucide-react';
import { callPortal, portalKey } from '@/lib/portal';
import { Card, CardTitle, Chip, Field, PrimaryButton, inputCls } from './ui';

const SCHOOL_FIELDS = [
  ['phone', 'Main office phone', 'tel'],
  ['address', 'Street address', 'text'],
  ['city', 'City', 'text'],
  ['state', 'State', 'text'],
  ['zip', 'ZIP', 'text'],
  ['enrollment', 'Enrollment', 'number'],
  ['billing_contact_name', 'Billing contact', 'text'],
  ['billing_email', 'Billing email', 'email'],
  ['tax_exempt_id', 'Tax exempt number', 'text'],
];

export default function SchoolTab({ data, schoolId }) {
  const qc = useQueryClient();
  const key = portalKey(schoolId);
  const [school, setSchool] = useState(() => Object.fromEntries(SCHOOL_FIELDS.map(([k]) => [k, data.school?.[k] ?? ''])));
  const [savingSchool, setSavingSchool] = useState(false);
  const [schoolErr, setSchoolErr] = useState(null);
  const [me, setMe] = useState({ name: data.me?.name || '', title: data.me?.title || '', phone: data.me?.phone || '' });
  const [savingMe, setSavingMe] = useState(false);
  const [mate, setMate] = useState({ name: '', email: '', title: '' });
  const [mateBusy, setMateBusy] = useState(false);
  const [mateErr, setMateErr] = useState(null);
  const readOnly = data.viewingAsAdmin;

  const saveSchool = async (e) => {
    e.preventDefault();
    setSchoolErr(null);
    setSavingSchool(true);
    const prev = qc.getQueryData(key);
    qc.setQueryData(key, (old) => old && { ...old, school: { ...old.school, ...school } });
    try {
      const res = await callPortal('updateSchool', { school_id: schoolId, patch: school });
      qc.setQueryData(key, (old) => old && { ...old, school: res.school });
      toast.success('School details saved');
    } catch (err) {
      qc.setQueryData(key, prev);
      setSchoolErr({ field: err.field, message: err.message });
    } finally {
      setSavingSchool(false);
    }
  };

  const saveMe = async (e) => {
    e.preventDefault();
    setSavingMe(true);
    try {
      const res = await callPortal('updateMe', { school_id: schoolId, ...me });
      qc.setQueryData(key, (old) => old && { ...old, me: res.me, members: old.members.map((m) => (m.id === res.me.id ? res.me : m)) });
      toast.success('Your details are saved');
    } catch (err) {
      toast.error('Could not save', { description: err.message });
    } finally {
      setSavingMe(false);
    }
  };

  const requestMate = async (e) => {
    e.preventDefault();
    setMateErr(null);
    setMateBusy(true);
    try {
      const res = await callPortal('requestTeammate', { school_id: schoolId, ...mate });
      qc.setQueryData(key, (old) => old && { ...old, members: [...old.members, res.member] });
      setMate({ name: '', email: '', title: '' });
      toast.success('Request sent', { description: 'We will send them an invitation shortly.' });
    } catch (err) {
      setMateErr({ field: err.field, message: err.message });
    } finally {
      setMateBusy(false);
    }
  };

  const members = data.members || [];

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="p-5">
        <CardTitle icon={Building2}>School details</CardTitle>
        <form onSubmit={saveSchool} className="grid sm:grid-cols-2 gap-3" noValidate>
          {SCHOOL_FIELDS.map(([k, label, type]) => (
            <div key={k} className={k === 'address' || k === 'billing_email' ? 'sm:col-span-2' : ''}>
              <Field label={label} error={schoolErr?.field === k ? schoolErr.message : null}>
                <input
                  className={inputCls}
                  type={type}
                  value={school[k] ?? ''}
                  onChange={(e) => setSchool((s) => ({ ...s, [k]: e.target.value }))}
                  disabled={readOnly}
                  maxLength={k === 'state' ? 2 : 200}
                />
              </Field>
            </div>
          ))}
          {schoolErr && !schoolErr.field && <p role="alert" className="sm:col-span-2 font-barlow text-sm text-rb-red">{schoolErr.message}</p>}
          {!readOnly && <PrimaryButton busy={savingSchool} className="sm:col-span-2">Save school details</PrimaryButton>}
        </form>
      </Card>

      <div className="space-y-5">
        <Card className="p-5">
          <CardTitle icon={UserRound}>Your team on the portal</CardTitle>
          <ul className="divide-y divide-white/[0.06]">
            {members.map((m) => (
              <li key={m.id} className="py-3 flex items-start gap-3">
                <span className="grid place-items-center w-9 h-9 rounded-full bg-white/[0.06] font-anton text-sm shrink-0">
                  {String(m.name || m.email || '?').slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-barlow text-cream flex flex-wrap items-center gap-2">
                    {m.name || m.email}
                    {m.is_primary && <Chip tone="bg-rb-yellow/15 text-rb-yellow"><Star className="w-3 h-3 mr-1" />Main contact</Chip>}
                    {m.status === 'requested' && <Chip>Waiting on invite</Chip>}
                    {m.status === 'invited' && <Chip tone="bg-rb-blue/15 text-rb-blue">Invited</Chip>}
                  </p>
                  <p className="font-barlow text-xs text-cream/50 truncate">{[m.title, m.email].filter(Boolean).join(' · ')}</p>
                </div>
                {m.phone && (
                  <a href={`tel:${m.phone.replace(/[^\d+]/g, '')}`} aria-label={`Call ${m.name}`} className="grid place-items-center w-9 h-9 rounded-full hover:bg-white/10 text-cream/60"><Phone className="w-4 h-4" /></a>
                )}
                <a href={`mailto:${m.email}`} aria-label={`Email ${m.name || m.email}`} className="grid place-items-center w-9 h-9 rounded-full hover:bg-white/10 text-cream/60"><Mail className="w-4 h-4" /></a>
              </li>
            ))}
          </ul>
          {!readOnly && (
            <form onSubmit={requestMate} className="mt-4 pt-4 border-t border-white/[0.06] space-y-3" noValidate>
              <p className="font-barlow-condensed font-bold uppercase tracking-wider text-xs text-cream/70 flex items-center gap-2"><UserPlus className="w-4 h-4" />Add a teammate</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Name" error={mateErr?.field === 'name' ? mateErr.message : null}>
                  <input className={inputCls} value={mate.name} onChange={(e) => setMate((m) => ({ ...m, name: e.target.value }))} maxLength={100} />
                </Field>
                <Field label="Title">
                  <input className={inputCls} value={mate.title} onChange={(e) => setMate((m) => ({ ...m, title: e.target.value }))} placeholder="Secretary, counselor..." maxLength={100} />
                </Field>
                <Field label="Work email" error={mateErr?.field === 'email' ? mateErr.message : null}>
                  <input className={inputCls} type="email" value={mate.email} onChange={(e) => setMate((m) => ({ ...m, email: e.target.value }))} maxLength={120} />
                </Field>
              </div>
              {mateErr && !mateErr.field && <p role="alert" className="font-barlow text-sm text-rb-red">{mateErr.message}</p>}
              <PrimaryButton busy={mateBusy} className="w-full">Request access</PrimaryButton>
              <p className="font-barlow text-xs text-cream/45">For privacy, our team approves every new person and sends their invitation.</p>
            </form>
          )}
        </Card>

        {!readOnly && (
          <Card className="p-5">
            <CardTitle icon={UserRound}>Your details</CardTitle>
            <form onSubmit={saveMe} className="grid sm:grid-cols-2 gap-3" noValidate>
              <Field label="Name"><input className={inputCls} value={me.name} onChange={(e) => setMe((x) => ({ ...x, name: e.target.value }))} maxLength={100} /></Field>
              <Field label="Title"><input className={inputCls} value={me.title} onChange={(e) => setMe((x) => ({ ...x, title: e.target.value }))} maxLength={100} /></Field>
              <Field label="Direct phone"><input className={inputCls} type="tel" value={me.phone} onChange={(e) => setMe((x) => ({ ...x, phone: e.target.value }))} maxLength={30} /></Field>
              <div className="sm:col-span-2"><PrimaryButton busy={savingMe} className="w-full">Save my details</PrimaryButton></div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
