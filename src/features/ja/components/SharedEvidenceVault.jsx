import { useMemo, useState } from 'react';

const initialEvidence = [
  { id: 1, name: 'invoice-ledger.xlsx', jurisdiction: 'Tax Department East', size: '2.4 MB' },
  { id: 2, name: 'customs-match.csv', jurisdiction: 'Customs & Excise', size: '860 KB' },
];

export default function SharedEvidenceVault() {
  const [items, setItems] = useState(initialEvidence);
  const [form, setForm] = useState({ fileName: '', jurisdiction: 'Tax Department East' });

  const totalSizeLabel = useMemo(() => {
    const totalMb = items.reduce((total, item) => total + Number.parseFloat(item.size), 0);
    return `${totalMb.toFixed(1)} MB`;
  }, [items]);

  const handleUpload = (event) => {
    event.preventDefault();
    if (!form.fileName.trim()) return;

    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        name: form.fileName.trim(),
        jurisdiction: form.jurisdiction,
        size: '1.2 MB',
      },
    ]);

    setForm({ fileName: '', jurisdiction: form.jurisdiction });
  };

  return (
    <div className="max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Shared evidence</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Evidence Vault</h2>
        </div>
        <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
          {items.length} files
        </div>
      </div>

      <form onSubmit={handleUpload} className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.2fr_1fr_auto]">
        <input
          type="text"
          value={form.fileName}
          onChange={(event) => setForm((current) => ({ ...current, fileName: event.target.value }))}
          placeholder="File name or reference"
          className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-violet-500"
        />
        <select
          value={form.jurisdiction}
          onChange={(event) => setForm((current) => ({ ...current, jurisdiction: event.target.value }))}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-violet-500"
        >
          <option>Tax Department East</option>
          <option>Customs &amp; Excise</option>
          <option>Revenue Intelligence</option>
        </select>
        <button type="submit" className="rounded-md bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700">
          Upload evidence
        </button>
      </form>

      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>Repository size</span>
        <span className="font-medium text-slate-700">{totalSizeLabel}</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-800">{item.name}</p>
              <p className="text-sm text-slate-500">{item.size}</p>
            </div>
            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
              {item.jurisdiction}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
