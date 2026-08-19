import { useState, useEffect, useMemo } from 'react';

const AUDIT_TYPES = ['FULL', 'LIMITED', 'ANALYTICAL'];
const SAMPLING_METHODS = ['STATISTICAL', 'JUDGMENT', 'STRATIFIED'];
const CONFIDENCE_LEVELS = [90, 95, 99];

function calcSampleSize(confidenceLevel, expectedDeviationRate, populationSize) {
  if (!confidenceLevel || !expectedDeviationRate || !populationSize) return null;
  const z = confidenceLevel === 99 ? 2.576 : confidenceLevel === 95 ? 1.96 : 1.645;
  const p = Number(expectedDeviationRate) / 100;
  const e = 0.05;
  const n0 = Math.ceil((z * z * p * (1 - p)) / (e * e));
  // Finite population correction
  const n = Math.ceil(n0 / (1 + (n0 - 1) / Number(populationSize)));
  return n;
}

export default function AuditPlanningTab({ caseId }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    fiscalYear: '', auditType: 'FULL', planningMaterialityEtb: '',
    performanceMaterialityPct: '75', trivialThresholdEtb: '',
    auditScope: '', estimatedResourceHours: '',
    samplingMethod: 'STATISTICAL', populationSize: '',
    confidenceLevel: 95, expectedDeviationRate: '',
  });
  const [workItems, setWorkItems] = useState([]);
  const [newItem, setNewItem] = useState({ segmentName: '', procedureName: '', estimatedHours: '' });

  const calculatedSampleSize = useMemo(
    () => calcSampleSize(form.confidenceLevel, form.expectedDeviationRate, form.populationSize),
    [form.confidenceLevel, form.expectedDeviationRate, form.populationSize],
  );

  useEffect(() => {
    if (caseId) fetchPlan();
    else setLoading(false);
  }, [caseId]);

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/v1/ex/cases/${caseId}/plan`, {
        headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
        setForm({
          fiscalYear: data.fiscalYear ?? '',
          auditType: data.auditType ?? 'FULL',
          planningMaterialityEtb: data.planningMaterialityEtb ?? '',
          performanceMaterialityPct: data.performanceMaterialityPct ?? '75',
          trivialThresholdEtb: data.trivialThresholdEtb ?? '',
          auditScope: data.auditScope ?? '',
          estimatedResourceHours: data.estimatedResourceHours ?? '',
          samplingMethod: data.samplingMethod ?? 'STATISTICAL',
          populationSize: data.populationSize ?? '',
          confidenceLevel: data.confidenceLevel ?? 95,
          expectedDeviationRate: data.expectedDeviationRate ?? '',
        });
        setWorkItems(data.workPlanItems ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!caseId) return;
    setSaving(true); setError(null);
    try {
      const url = plan ? `/api/v1/ex/cases/${caseId}/plan` : `/api/v1/ex/cases/${caseId}/plan`;
      const method = plan ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'auditor-1' },
        body: JSON.stringify({ ...form, calculatedSampleSize }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
        setSuccess('Plan saved.');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to save plan.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!plan) return;
    setSubmitting(true); setError(null);
    try {
      const res = await fetch(`/api/v1/ex/cases/${caseId}/plan/submit`, {
        method: 'POST',
        headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
        setSuccess('Plan submitted for approval.');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Submission failed.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddWorkItem = async () => {
    if (!plan || !newItem.segmentName || !newItem.procedureName) return;
    try {
      const res = await fetch(`/api/v1/ex/cases/${caseId}/plan/work-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'auditor-1' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const item = await res.json();
        setWorkItems((prev) => [...prev, item]);
        setNewItem({ segmentName: '', procedureName: '', estimatedHours: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isReadOnly = plan?.status === 'SUBMITTED' || plan?.status === 'APPROVED';
  const f = (field) => ({ value: form[field], disabled: isReadOnly, onChange: (e) => setForm((p) => ({ ...p, [field]: e.target.value })) });

  if (loading) return <p className="text-slate-500 text-sm py-8 text-center">Loading plan…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Audit Plan</h3>
        {plan && (
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            plan.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
            plan.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {plan.status ?? 'DRAFT'}
          </span>
        )}
      </div>

      {success && <div className="rounded-md bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">{success}</div>}
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Fiscal Year"><input type="text" {...f('fiscalYear')} className={inputCls(isReadOnly)} placeholder="e.g. 2025/2026" /></Field>
        <Field label="Audit Type">
          <select {...f('auditType')} className={inputCls(isReadOnly)}>
            {AUDIT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Planning Materiality (ETB)"><input type="number" {...f('planningMaterialityEtb')} className={inputCls(isReadOnly)} /></Field>
        <Field label="Performance Materiality (%)"><input type="number" {...f('performanceMaterialityPct')} className={inputCls(isReadOnly)} /></Field>
        <Field label="Trivial Threshold (ETB)"><input type="number" {...f('trivialThresholdEtb')} className={inputCls(isReadOnly)} /></Field>
        <Field label="Estimated Hours"><input type="number" {...f('estimatedResourceHours')} className={inputCls(isReadOnly)} /></Field>
      </div>

      <Field label="Audit Scope">
        <textarea {...f('auditScope')} rows={3} className={inputCls(isReadOnly)} placeholder="Describe the scope of this audit…" />
      </Field>

      {/* Sampling */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
        <p className="text-sm font-semibold text-slate-700">Statistical Sampling</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Method">
            <select {...f('samplingMethod')} className={inputCls(isReadOnly)}>
              {SAMPLING_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Population Size"><input type="number" {...f('populationSize')} className={inputCls(isReadOnly)} /></Field>
          <Field label="Confidence Level (%)">
            <select {...f('confidenceLevel')} className={inputCls(isReadOnly)}>
              {CONFIDENCE_LEVELS.map((l) => <option key={l} value={l}>{l}%</option>)}
            </select>
          </Field>
          <Field label="Expected Deviation Rate (%)"><input type="number" step="0.1" {...f('expectedDeviationRate')} className={inputCls(isReadOnly)} /></Field>
          <Field label="Calculated Sample Size">
            <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-emerald-700">
              {calculatedSampleSize ?? '—'}
            </div>
          </Field>
        </div>
      </div>

      {/* Work plan */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700">Work Plan</p>
        {workItems.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Segment', 'Procedure', 'Est. Hours', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-semibold text-slate-900">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-4 py-2 text-slate-900">{item.segmentName}</td>
                    <td className="px-4 py-2 text-slate-600">{item.procedureName}</td>
                    <td className="px-4 py-2 text-slate-600">{item.estimatedHours ?? '—'}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isReadOnly && plan && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input value={newItem.segmentName} onChange={(e) => setNewItem((p) => ({ ...p, segmentName: e.target.value }))} placeholder="Segment" className={inputCls(false)} />
            <input value={newItem.procedureName} onChange={(e) => setNewItem((p) => ({ ...p, procedureName: e.target.value }))} placeholder="Procedure" className={`sm:col-span-2 ${inputCls(false)}`} />
            <input type="number" value={newItem.estimatedHours} onChange={(e) => setNewItem((p) => ({ ...p, estimatedHours: e.target.value }))} placeholder="Hours" className={inputCls(false)} />
            <button type="button" onClick={handleAddWorkItem} className="sm:col-span-4 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              + Add Work Item
            </button>
          </div>
        )}
      </div>

      {!isReadOnly && (
        <div className="flex gap-3">
          <button type="button" onClick={handleSave} disabled={saving} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300">
            {saving ? 'Saving…' : plan ? 'Save Changes' : 'Create Plan'}
          </button>
          {plan && (
            <button type="button" onClick={handleSubmit} disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300">
              {submitting ? 'Submitting…' : 'Submit for Approval'}
            </button>
          )}
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

function inputCls(disabled) {
  return `w-full rounded-md border px-3 py-2 text-sm text-slate-900 ${
    disabled
      ? 'border-slate-200 bg-slate-100 cursor-not-allowed text-slate-500'
      : 'border-slate-300 bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
  }`;
}
