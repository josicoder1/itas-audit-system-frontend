import { useMemo, useState } from 'react';

const initialMembers = [
  { id: 1, actorId: 'auditor-east', jurisdiction: 'Tax Department East' },
  { id: 2, actorId: 'auditor-customs', jurisdiction: 'Customs & Excise' },
];

export default function CommitteeBuilder() {
  const [members, setMembers] = useState(initialMembers);
  const [form, setForm] = useState({ actorId: '', jurisdiction: '' });

  const distinctJurisdictions = useMemo(
    () => new Set(members.map((member) => member.jurisdiction.trim())).size,
    [members],
  );

  const canStartAudit = distinctJurisdictions >= 2;

  const handleAddMember = (event) => {
    event.preventDefault();
    if (!form.actorId.trim() || !form.jurisdiction.trim()) return;

    setMembers((current) => [
      ...current,
      {
        id: Date.now(),
        actorId: form.actorId.trim(),
        jurisdiction: form.jurisdiction.trim(),
      },
    ]);
    setForm({ actorId: '', jurisdiction: '' });
  };

  return (
    <div className="max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Joint Audit</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Committee Builder</h2>
        </div>
        <button
          type="button"
          disabled={!canStartAudit}
          title={
            canStartAudit
              ? 'Ready to start the audit'
              : 'At least two distinct jurisdictions are required before the audit can begin.'
          }
          className={[
            'inline-flex items-center rounded-md px-4 py-2 font-medium shadow-sm transition',
            canStartAudit
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'cursor-not-allowed bg-slate-200 text-slate-500',
          ].join(' ')}
        >
          Start Audit
        </button>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Lead Auditor</p>
          <p className="mt-1 font-semibold text-slate-800">lead.auditor@mor.gov.et</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Members</p>
          <p className="mt-1 font-semibold text-slate-800">{members.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Distinct Jurisdictions</p>
          <p className="mt-1 font-semibold text-slate-800">{distinctJurisdictions}</p>
        </div>
      </div>

      <form onSubmit={handleAddMember} className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_1.2fr_auto]">
        <input
          type="text"
          value={form.actorId}
          onChange={(event) => setForm((current) => ({ ...current, actorId: event.target.value }))}
          placeholder="Member actor id"
          className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-blue-500"
        />
        <input
          type="text"
          value={form.jurisdiction}
          onChange={(event) => setForm((current) => ({ ...current, jurisdiction: event.target.value }))}
          placeholder="Jurisdiction / department"
          className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-blue-500"
        />
        <button type="submit" className="rounded-md border border-blue-600 bg-blue-50 px-4 py-2 font-medium text-blue-700 hover:bg-blue-100">
          Add Member
        </button>
      </form>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Assigned members</h3>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
              <div>
                <p className="font-medium text-slate-800">{member.actorId}</p>
                <p className="text-sm text-slate-500">{member.jurisdiction}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {member.jurisdiction}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
