import { useState, useEffect } from 'react';

const DISPOSITION_COLORS = {
  PENDING:  'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  AMENDED:  'bg-blue-100 text-blue-700',
  REJECTED: 'bg-red-100 text-red-700',
};
const RISK_COLORS = {
  CRITICAL: 'bg-red-100 text-red-700',
  HIGH:     'bg-orange-100 text-orange-700',
  MEDIUM:   'bg-amber-100 text-amber-700',
  LOW:      'bg-slate-100 text-slate-600',
};

export default function CAATAnalysisTab({ caseId }) {
  const [anomalies, setAnomalies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [amendModal, setAmendModal] = useState(null);
  const [amendAmount, setAmendAmount] = useState('');
  const [amendReason, setAmendReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (caseId) { fetchAnomalies(); fetchSummary(); }
    else setLoading(false);
  }, [caseId]);

  const fetchAnomalies = async () => {
    try {
      const res = await fetch(`/api/v1/ex/cases/${caseId}/caat/anomalies`, {
        headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) setAnomalies(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`/api/v1/ex/cases/${caseId}/caat/summary`, {
        headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) setSummary(await res.json());
    } catch (e) { console.error(e); }
  };

  const runAnalysis = async () => {
    setRunning(true); setError(null);
    try {
      const res = await fetch(`/api/v1/ex/cases/${caseId}/caat/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'auditor-1' },
        body: JSON.stringify({ analysisType: 'ALL' }),
      });
      if (res.ok) { await fetchAnomalies(); await fetchSummary(); setActiveIdx(0); }
      else setError('Analysis failed.');
    } catch (e) { setError('Network error.'); }
    finally { setRunning(false); }
  };

  const dispose = async (anomalyId, disposition, extra = {}) => {
    setProcessing(true); setError(null);
    try {
      const res = await fetch(`/api/v1/ex/cases/${caseId}/caat/anomalies/${anomalyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'auditor-1' },
        body: JSON.stringify({ disposition, ...extra }),
      });
      if (res.ok) {
        await fetchAnomalies(); await fetchSummary();
        setAmendModal(null); setRejectTarget(null);
        setAmendAmount(''); setAmendReason(''); setRejectReason('');
        // Move to next pending
        setActiveIdx((i) => Math.min(i, anomalies.length - 2));
      } else { setError('Action failed.'); }
    } catch (e) { setError('Network error.'); }
    finally { setProcessing(false); }
  };

  const pending = anomalies.filter((a) => a.disposition === 'PENDING');
  const current = pending[activeIdx] ?? null;
  const fmt = (n) => n != null ? Number(n).toLocaleString('en-ET', { minimumFractionDigits: 2 }) : '—';

  if (loading) return <p className="text-slate-500 text-sm py-8 text-center">Loading CAAT analysis…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">CAAT Analysis</h3>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={running}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300"
        >
          {running ? 'Running…' : 'Run Analysis'}
        </button>
      </div>

      {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>}

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Total', value: summary.totalAnomalies ?? 0 },
            { label: 'Pending', value: summary.pendingCount ?? 0, highlight: 'text-amber-700' },
            { label: 'Accepted', value: summary.acceptedCount ?? 0, highlight: 'text-emerald-700' },
            { label: 'Amended', value: summary.amendedCount ?? 0, highlight: 'text-blue-700' },
            { label: 'Rejected', value: summary.rejectedCount ?? 0, highlight: 'text-red-700' },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
              <p className={`text-2xl font-bold mt-1 ${c.highlight ?? 'text-slate-900'}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review queue */}
      {pending.length > 0 && current && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              Review Queue — {activeIdx + 1} of {pending.length} pending
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))} disabled={activeIdx === 0} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">←</button>
              <button type="button" onClick={() => setActiveIdx((i) => Math.min(i + 1, pending.length - 1))} disabled={activeIdx >= pending.length - 1} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">→</button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${RISK_COLORS[current.riskLevel] ?? RISK_COLORS.LOW}`}>
                  {current.riskLevel}
                </span>
                <span className="text-xs text-slate-500">{current.analysisType?.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-sm text-slate-700">{current.description}</p>
              {current.sampleReference && <p className="text-xs text-slate-500 mt-1">Ref: {current.sampleReference}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-500">System Amount</p>
              <p className="text-xl font-bold text-slate-900">ETB {fmt(current.systemCalculatedAmountEtb)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => dispose(current.id, 'ACCEPTED')} disabled={processing} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300">
              {processing ? '…' : 'Accept'}
            </button>
            <button type="button" onClick={() => setAmendModal(current)} disabled={processing} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300">
              Amend
            </button>
            <button type="button" onClick={() => setRejectTarget(current)} disabled={processing} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-300">
              Reject
            </button>
          </div>
        </div>
      )}

      {pending.length === 0 && anomalies.length > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-sm text-emerald-700 font-medium">All anomalies have been reviewed.</p>
        </div>
      )}

      {/* All anomalies table */}
      {anomalies.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Type', 'System Amt (ETB)', 'Amended Amt', 'Variance', 'Risk', 'Disposition'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-semibold text-slate-900 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {anomalies.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-700">{a.analysisType?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-2 text-right font-medium text-slate-900">{fmt(a.systemCalculatedAmountEtb)}</td>
                  <td className="px-4 py-2 text-right text-slate-600">{a.auditorAmendedAmountEtb != null ? fmt(a.auditorAmendedAmountEtb) : '—'}</td>
                  <td className="px-4 py-2 text-right text-slate-600">{a.varianceEtb != null ? fmt(a.varianceEtb) : '—'}</td>
                  <td className="px-4 py-2"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${RISK_COLORS[a.riskLevel] ?? RISK_COLORS.LOW}`}>{a.riskLevel}</span></td>
                  <td className="px-4 py-2"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${DISPOSITION_COLORS[a.disposition] ?? 'bg-slate-100 text-slate-600'}`}>{a.disposition}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Amend modal */}
      {amendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Amend Anomaly</h3>
            <p className="text-xs text-slate-500">System amount: ETB {fmt(amendModal.systemCalculatedAmountEtb)}</p>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amended Amount (ETB) *</label>
              <input type="number" value={amendAmount} onChange={(e) => setAmendAmount(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            {amendAmount && (
              <p className="text-xs text-slate-500">
                Variance: ETB {fmt(Number(amendModal.systemCalculatedAmountEtb) - Number(amendAmount))}
              </p>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reason *</label>
              <textarea value={amendReason} onChange={(e) => setAmendReason(e.target.value)} rows={2} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => dispose(amendModal.id, 'AMENDED', { amendedAmount: Number(amendAmount), dispositionReason: amendReason })} disabled={processing || !amendAmount || !amendReason} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300">
                {processing ? '…' : 'Save Amendment'}
              </button>
              <button type="button" onClick={() => { setAmendModal(null); setAmendAmount(''); setAmendReason(''); }} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reject Anomaly</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reason for Rejection *</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => dispose(rejectTarget.id, 'REJECTED', { dispositionReason: rejectReason })} disabled={processing || !rejectReason} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-300">
                {processing ? '…' : 'Confirm Rejection'}
              </button>
              <button type="button" onClick={() => { setRejectTarget(null); setRejectReason(''); }} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
