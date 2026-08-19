import { useState, useEffect } from 'react';

export default function HandoffInbox() {
  const [handoffs, setHandoffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [importing, setImporting] = useState(false);
  const [notes, setNotes] = useState('');
  const [successRef, setSuccessRef] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchHandoffs(); }, []);

  const fetchHandoffs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/ex/handoff/pending', {
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) setHandoffs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selected) return;
    setImporting(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/ex/handoff/${selected.id}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'team-leader-1' },
        body: JSON.stringify({ assignedTeamLeaderId: 'team-leader-1', notes }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccessRef(data.caseRef);
        setSelected(null);
        setNotes('');
        await fetchHandoffs();
      } else {
        setError('Import failed. Please try again.');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900">JA Handoff Inbox</h2>

      {successRef && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between">
          <span className="text-sm text-emerald-800 font-medium">
            ✓ Case imported — reference: <strong>{successRef}</strong>
          </span>
          <button type="button" onClick={() => setSuccessRef(null)} className="text-emerald-600 hover:text-emerald-800 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-slate-500 text-sm py-8 text-center">Loading handoffs…</p>
      ) : handoffs.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500 text-sm">No pending handoff records.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {['Case Number', 'Region', 'Year', 'Total Adjustment (ETB)', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-slate-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {handoffs.map((h) => (
                <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{h.caseNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{h.regionCode}</td>
                  <td className="px-4 py-3 text-slate-600">{h.year}</td>
                  <td className="px-4 py-3 text-slate-900">
                    {h.totalAdjustmentEtb != null
                      ? Number(h.totalAdjustmentEtb).toLocaleString('en-ET', { minimumFractionDigits: 2 })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700">
                      {h.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(h)}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      Import
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Import modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Import Handoff</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Case Number</span>
                <span className="font-medium text-slate-900">{selected.caseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Region</span>
                <span className="font-medium text-slate-900">{selected.regionCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Year</span>
                <span className="font-medium text-slate-900">{selected.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Adjustment (ETB)</span>
                <span className="font-medium text-slate-900">
                  {selected.totalAdjustmentEtb != null
                    ? Number(selected.totalAdjustmentEtb).toLocaleString('en-ET', { minimumFractionDigits: 2 })
                    : '—'}
                </span>
              </div>
            </div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Import notes…"
            />
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleImport}
                disabled={importing}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300"
              >
                {importing ? 'Importing…' : 'Confirm Import'}
              </button>
              <button
                type="button"
                onClick={() => { setSelected(null); setNotes(''); setError(null); }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
