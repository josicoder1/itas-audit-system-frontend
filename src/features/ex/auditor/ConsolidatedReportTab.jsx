import { useState, useEffect } from 'react';

const STATUS_COLORS = {
  DRAFT:       'bg-slate-100 text-slate-600',
  FOR_REVIEW:  'bg-amber-100 text-amber-700',
  SUBMITTED:   'bg-blue-100 text-blue-700',
  CLOSED:      'bg-emerald-100 text-emerald-700',
};

export default function ConsolidatedReportTab({ caseId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signature, setSignature] = useState('');
  const [showSignOff, setShowSignOff] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ executiveSummary: '', auditScope: '', keyFindings: '' });

  useEffect(() => {
    if (caseId) fetchReport();
    else setLoading(false);
  }, [caseId]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/v1/ex/reports?caseId=${caseId}`, {
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
        setForm({
          executiveSummary: data.executiveSummary ?? '',
          auditScope: data.auditScope ?? '',
          keyFindings: data.keyFindings ?? '',
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true); setError(null);
    try {
      const res = await fetch(`/api/v1/ex/reports?caseId=${caseId}`, {
        method: 'POST',
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) { await fetchReport(); setSuccess('Report generated.'); setTimeout(() => setSuccess(null), 3000); }
      else { const d = await res.json().catch(() => ({})); setError(d.error ?? 'Generation failed.'); }
    } catch (e) { setError('Network error.'); }
    finally { setGenerating(false); }
  };

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/v1/ex/reports?caseId=${caseId}&executiveSummary=${encodeURIComponent(form.executiveSummary)}&auditScope=${encodeURIComponent(form.auditScope)}&keyFindings=${encodeURIComponent(form.keyFindings)}`, {
        method: 'PUT',
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) { await fetchReport(); setSuccess('Saved.'); setTimeout(() => setSuccess(null), 3000); }
      else setError('Save failed.');
    } catch (e) { setError('Network error.'); }
    finally { setSaving(false); }
  };

  const handleSubmitForReview = async () => {
    setSubmittingReview(true); setError(null);
    try {
      const res = await fetch(`/api/v1/ex/reports/submit-for-review?caseId=${caseId}&reviewerId=team-leader-1&reviewerName=Team+Leader`, {
        method: 'POST',
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) { await fetchReport(); setSuccess('Report sent for review.'); setTimeout(() => setSuccess(null), 3000); }
      else setError('Failed to submit for review.');
    } catch (e) { setError('Network error.'); }
    finally { setSubmittingReview(false); }
  };

  const handleFinalSubmit = async () => {
    if (!signature.trim()) { setError('Signature is required.'); return; }
    setSubmitting(true); setError(null);
    try {
      const res = await fetch(`/api/v1/ex/reports/submit?caseId=${caseId}&submitterId=team-leader-1&submitterName=Team+Leader&signature=${encodeURIComponent(signature)}`, {
        method: 'POST',
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) { await fetchReport(); setShowSignOff(false); setSuccess('Report submitted to committee.'); setTimeout(() => setSuccess(null), 4000); }
      else setError('Submission failed.');
    } catch (e) { setError('Network error.'); }
    finally { setSubmitting(false); }
  };

  const fmt = (n) => n != null ? Number(n).toLocaleString('en-ET', { minimumFractionDigits: 2 }) : '—';
  const isReadOnly = report?.status === 'SUBMITTED' || report?.status === 'CLOSED';

  if (loading) return <p className="text-slate-500 text-sm py-8 text-center">Loading report…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Consolidated Report</h3>
        <div className="flex items-center gap-3">
          {report && (
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${STATUS_COLORS[report.status] ?? STATUS_COLORS.DRAFT}`}>
              {report.status}
            </span>
          )}
          {!report && (
            <button type="button" onClick={handleGenerate} disabled={generating} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300">
              {generating ? 'Generating…' : 'Generate Report'}
            </button>
          )}
        </div>
      </div>

      {success && <div className="rounded-md bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">{success}</div>}
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>}

      {!report ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500 text-sm">No report generated yet. All findings must be submitted first.</p>
        </div>
      ) : (
        <>
          {/* Financial summary cards */}
          {report.financials && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: 'Principal', value: fmt(report.financials.principalAdjustmentEtb) },
                { label: 'Penalties', value: fmt(report.financials.penaltiesEtb) },
                { label: 'Interest', value: fmt(report.financials.interestEtb) },
                { label: 'Net Adjustment', value: fmt(report.financials.netAdjustmentEtb), bold: true },
                { label: 'Realization Rate', value: report.financials.realizationRatePct != null ? `${Number(report.financials.realizationRatePct).toFixed(1)}%` : '—' },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
                  <p className={`mt-1 text-base font-bold ${c.bold ? 'text-emerald-700' : 'text-slate-900'}`}>{c.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Findings breakdown */}
          {report.findings && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: 'Total', value: report.findings.total ?? 0 },
                { label: 'Critical', value: report.findings.critical ?? 0, color: 'text-red-700' },
                { label: 'High', value: report.findings.high ?? 0, color: 'text-orange-700' },
                { label: 'Medium', value: report.findings.medium ?? 0, color: 'text-amber-700' },
                { label: 'Low', value: report.findings.low ?? 0, color: 'text-slate-600' },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
                  <p className={`mt-1 text-xl font-bold ${c.color ?? 'text-slate-900'}`}>{c.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Editable text sections */}
          <div className="space-y-4">
            {[
              { key: 'executiveSummary', label: 'Executive Summary' },
              { key: 'auditScope', label: 'Audit Scope' },
              { key: 'keyFindings', label: 'Key Findings' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                <textarea
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  disabled={isReadOnly}
                  rows={4}
                  className={`w-full rounded-md border px-3 py-2 text-sm text-slate-900 ${
                    isReadOnly ? 'border-slate-200 bg-slate-100 cursor-not-allowed text-slate-500' : 'border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          {!isReadOnly && (
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleSave} disabled={saving} className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:bg-slate-300">
                {saving ? 'Saving…' : 'Save Draft'}
              </button>
              {report.status === 'DRAFT' && (
                <button type="button" onClick={handleSubmitForReview} disabled={submittingReview} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:bg-slate-300">
                  {submittingReview ? '…' : 'Submit for Review'}
                </button>
              )}
              {report.status === 'FOR_REVIEW' && (
                <button type="button" onClick={() => setShowSignOff(true)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Final Submission →
                </button>
              )}
            </div>
          )}

          {/* Sign-off panel */}
          {showSignOff && (
            <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-5 space-y-4">
              <h4 className="text-base font-bold text-blue-900">⚠ Final Submission — This cannot be undone</h4>
              <p className="text-sm text-blue-800">
                You are submitting this report to the committee. The CM cluster will receive a closure request.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Digital Signature (your full name) *</label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter your full name as signature…"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleFinalSubmit} disabled={submitting || !signature.trim()} className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:bg-slate-300">
                  {submitting ? 'Submitting…' : 'Confirm & Submit Report'}
                </button>
                <button type="button" onClick={() => { setShowSignOff(false); setSignature(''); setError(null); }} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
