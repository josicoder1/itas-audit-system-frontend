import { useState, useEffect } from 'react';

const STATUS_COLORS = {
  DRAFT:     'bg-slate-100 text-slate-600',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  APPROVED:  'bg-emerald-100 text-emerald-700',
  REJECTED:  'bg-red-100 text-red-700',
};
const RISK_COLORS = {
  CRITICAL: 'bg-red-100 text-red-700',
  HIGH:     'bg-orange-100 text-orange-700',
  MEDIUM:   'bg-amber-100 text-amber-700',
  LOW:      'bg-slate-100 text-slate-600',
};
const BLANK = { category: 'COMPLIANCE', title: '', description: '', condition: '', criteria: '', effect: '', cause: '', riskLevel: 'MEDIUM', taxType: 'VAT', auditorNotes: '' };

export default function FindingsTab({ caseId }) {
  const [findings, setFindings] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | finding object
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [submittingAll, setSubmittingAll] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (caseId) { fetchFindings(); fetchEvidence(); }
    else setLoading(false);
  }, [caseId]);

  const fetchFindings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/ex/findings?caseId=${caseId}`, {
        headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) { const d = await res.json(); setFindings(d.findings ?? d); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchEvidence = async () => {
    try {
      const res = await fetch(`/api/v1/ex/findings/evidence?caseId=${caseId}`, {
        headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) { const d = await res.json(); setEvidence(d.evidence ?? []); }
    } catch (e) { console.error(e); }
  };

  const openNew = () => { setForm(BLANK); setEditing('new'); setError(null); };
  const openEdit = (f) => { setForm({ ...f }); setEditing(f); setError(null); };

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      let res;
      if (editing === 'new') {
        res = await fetch(`/api/v1/ex/findings?caseId=${caseId}&category=${form.category}&description=${encodeURIComponent(form.description)}&auditorId=auditor-1&auditorName=Auditor+One`, {
          method: 'POST',
          headers: { 'X-Actor-Id': 'auditor-1' },
        });
      } else {
        res = await fetch(`/api/v1/ex/findings/${editing.id}?condition=${encodeURIComponent(form.condition)}&criteria=${encodeURIComponent(form.criteria)}&effect=${encodeURIComponent(form.effect)}&cause=${encodeURIComponent(form.cause)}`, {
          method: 'PUT',
          headers: { 'X-Actor-Id': 'auditor-1' },
        });
      }
      if (res.ok) { setEditing(null); setSuccess('Saved.'); setTimeout(() => setSuccess(null), 3000); await fetchFindings(); }
      else setError('Failed to save.');
    } catch (e) { setError('Network error.'); }
    finally { setSaving(false); }
  };

  const handleSubmit = async (findingId) => {
    try {
      const res = await fetch(`/api/v1/ex/findings/${findingId}/submit`, {
        method: 'POST', headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) { setSuccess('Finding submitted.'); setTimeout(() => setSuccess(null), 3000); await fetchFindings(); }
      else setError('Submission failed.');
    } catch (e) { setError('Network error.'); }
  };

  const handleSubmitAll = async () => {
    setSubmittingAll(true); setError(null);
    try {
      const res = await fetch(`/api/v1/ex/findings/submit-all?caseId=${caseId}`, {
        method: 'POST', headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) { setSuccess('All findings submitted.'); setTimeout(() => setSuccess(null), 3000); await fetchFindings(); }
      else setError('Batch submit failed.');
    } catch (e) { setError('Network error.'); }
    finally { setSubmittingAll(false); }
  };

  const draftCount = findings.filter((f) => f.status === 'DRAFT').length;
  const fmt = (n) => n != null ? Number(n).toLocaleString('en-ET', { minimumFractionDigits: 2 }) : '—';

  if (loading) return <p className="text-slate-500 text-sm py-8 text-center">Loading findings…</p>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Findings ({findings.length})</h3>
        <div className="flex gap-2">
          {draftCount > 0 && (
            <button type="button" onClick={handleSubmitAll} disabled={submittingAll} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:bg-slate-300">
              {submittingAll ? '…' : `Submit All (${draftCount})`}
            </button>
          )}
          <button type="button" onClick={openNew} className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
            + New Finding
          </button>
        </div>
      </div>

      {success && <div className="rounded-md bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">{success}</div>}
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>}

      {findings.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500 text-sm">No findings yet. Click "New Finding" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {findings.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[f.status] ?? STATUS_COLORS.DRAFT}`}>{f.status}</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${RISK_COLORS[f.riskLevel] ?? RISK_COLORS.LOW}`}>{f.riskLevel}</span>
                    <span className="text-xs text-slate-500">{f.category} · {f.taxType}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 truncate">{f.description || f.title || '(no description)'}</p>
                  {f.auditorRecommendedAdjustmentEtb != null && (
                    <p className="text-xs text-slate-500 mt-0.5">Recommended Adjustment: ETB {fmt(f.auditorRecommendedAdjustmentEtb)}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {f.status === 'DRAFT' && (
                    <>
                      <button type="button" onClick={() => openEdit(f)} className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-2 py-1">Edit</button>
                      <button type="button" onClick={() => handleSubmit(f.id)} className="text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded px-2 py-1">Submit</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Evidence list */}
      {evidence.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <p className="text-sm font-semibold text-slate-900">Evidence Files ({evidence.length})</p>
          </div>
          <div className="divide-y divide-slate-100">
            {evidence.map((e) => (
              <div key={e.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{e.fileName}</p>
                  <p className="text-xs text-slate-500">{e.category} · {e.uploadedByName}</p>
                </div>
                <a href={e.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">Download</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit/Create panel */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">{editing === 'new' ? 'New Finding' : 'Edit Finding'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className={inp}>
                  {['COMPLIANCE', 'ACCURACY', 'VALUATION', 'DISCLOSURE'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Risk Level">
                <select value={form.riskLevel} onChange={(e) => setForm((p) => ({ ...p, riskLevel: e.target.value }))} className={inp}>
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Tax Type">
                <select value={form.taxType} onChange={(e) => setForm((p) => ({ ...p, taxType: e.target.value }))} className={inp}>
                  {['VAT', 'PIT', 'CIT', 'EXCISE', 'WHT'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description *">
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className={inp} />
            </Field>
            <Field label="Condition (what should be)">
              <textarea value={form.condition} onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))} rows={2} className={inp} />
            </Field>
            <Field label="Criteria (standard/rule)">
              <textarea value={form.criteria} onChange={(e) => setForm((p) => ({ ...p, criteria: e.target.value }))} rows={2} className={inp} />
            </Field>
            <Field label="Effect (impact)">
              <textarea value={form.effect} onChange={(e) => setForm((p) => ({ ...p, effect: e.target.value }))} rows={2} className={inp} />
            </Field>
            <Field label="Cause (root cause)">
              <textarea value={form.cause} onChange={(e) => setForm((p) => ({ ...p, cause: e.target.value }))} rows={2} className={inp} />
            </Field>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleSave} disabled={saving} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inp = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500';
