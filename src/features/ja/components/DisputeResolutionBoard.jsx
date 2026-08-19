import { useState } from 'react';

const initialDisputes = [
  {
    id: 1,
    raisingJurisdiction: 'Tax Department East',
    opposingJurisdiction: 'Customs & Excise',
    issue: 'Revenue split treatment differs across departments',
    resolution: '',
  },
];

export default function DisputeResolutionBoard() {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [form, setForm] = useState({
    raisingJurisdiction: 'Tax Department East',
    opposingJurisdiction: 'Customs & Excise',
    issue: '',
    resolution: '',
  });

  const addDispute = (event) => {
    event.preventDefault();
    if (!form.issue.trim()) return;

    setDisputes((current) => [
      ...current,
      {
        id: Date.now(),
        raisingJurisdiction: form.raisingJurisdiction,
        opposingJurisdiction: form.opposingJurisdiction,
        issue: form.issue.trim(),
        resolution: form.resolution.trim(),
      },
    ]);

    setForm({ raisingJurisdiction: form.raisingJurisdiction, opposingJurisdiction: form.opposingJurisdiction, issue: '', resolution: '' });
  };

  return (
    <div className="max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Dispute resolution</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Resolution Board</h2>
        </div>
        <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
          {disputes.length} disputes
        </div>
      </div>

      <form onSubmit={addDispute} className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <select
          value={form.raisingJurisdiction}
          onChange={(event) => setForm((current) => ({ ...current, raisingJurisdiction: event.target.value }))}
          className="rounded-md border border-slate-300 bg-white px-3 py-2"
        >
          <option>Tax Department East</option>
          <option>Customs &amp; Excise</option>
          <option>Revenue Intelligence</option>
        </select>
        <select
          value={form.opposingJurisdiction}
          onChange={(event) => setForm((current) => ({ ...current, opposingJurisdiction: event.target.value }))}
          className="rounded-md border border-slate-300 bg-white px-3 py-2"
        >
          <option>Customs &amp; Excise</option>
          <option>Tax Department East</option>
          <option>Revenue Intelligence</option>
        </select>
        <textarea
          value={form.issue}
          onChange={(event) => setForm((current) => ({ ...current, issue: event.target.value }))}
          placeholder="Issue description"
          rows="3"
          className="md:col-span-2 rounded-md border border-slate-300 px-3 py-2"
        />
        <textarea
          value={form.resolution}
          onChange={(event) => setForm((current) => ({ ...current, resolution: event.target.value }))}
          placeholder="Lead auditor binding resolution"
          rows="3"
          className="md:col-span-2 rounded-md border border-slate-300 px-3 py-2"
        />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="rounded-md bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700">
            Log dispute
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {disputes.map((dispute) => (
          <div key={dispute.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800">{dispute.raisingJurisdiction}</p>
                <p className="text-sm text-slate-500">against {dispute.opposingJurisdiction}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${dispute.resolution ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {dispute.resolution ? 'Resolved' : 'Awaiting lead resolution'}
              </span>
            </div>
            <p className="text-sm text-slate-600">{dispute.issue}</p>
            {dispute.resolution ? (
              <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{dispute.resolution}</p>
            ) : (
              <p className="mt-3 text-sm italic text-slate-500">Lead auditor resolution is still required before the audit can proceed.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
