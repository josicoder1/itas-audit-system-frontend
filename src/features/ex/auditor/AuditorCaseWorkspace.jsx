import { useState, useEffect } from 'react';
import AuditPlanningTab from './AuditPlanningTab';
import CAATAnalysisTab from './CAATAnalysisTab';
import FindingsTab from './FindingsTab';
import ConsolidatedReportTab from './ConsolidatedReportTab';

const TABS = ['Planning', 'CAAT Analysis', 'Findings', 'Report'];

const STATE_COLORS = {
  CASE_ASSIGNED: 'bg-blue-100 text-blue-700',
  PLANNING: 'bg-purple-100 text-purple-700',
  IN_EXECUTION: 'bg-amber-100 text-amber-700',
  QA: 'bg-indigo-100 text-indigo-700',
  CLOSED: 'bg-emerald-100 text-emerald-700',
};

export default function AuditorCaseWorkspace({ caseId, onBack }) {
  const [activeTab, setActiveTab] = useState('Planning');
  const [auditCase, setAuditCase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) fetchCase();
    else setLoading(false);
  }, [caseId]);

  const fetchCase = async () => {
    try {
      const res = await fetch(`/api/v1/ex/cases?teamLeaderId=team-leader-1`, {
        headers: { 'X-Actor-Id': 'auditor-1' },
      });
      if (res.ok) {
        const cases = await res.json();
        const found = cases.find((c) => c.id === caseId);
        setAuditCase(found ?? null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-slate-500 text-sm py-8 text-center">Loading case…</p>;

  if (!auditCase && caseId) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-slate-500 text-sm mb-3">Case not found.</p>
        {onBack && (
          <button type="button" onClick={onBack} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            ← Back to dashboard
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Case header */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-xs text-slate-500 hover:text-slate-700 mb-1 font-medium"
              >
                ← Back to dashboard
              </button>
            )}
            {auditCase ? (
              <>
                <h2 className="text-xl font-bold text-slate-900">{auditCase.caseRef}</h2>
                <p className="text-sm text-slate-500 mt-0.5">Region: {auditCase.region ?? '—'}</p>
              </>
            ) : (
              <h2 className="text-xl font-bold text-slate-900">Auditor Workspace</h2>
            )}
          </div>
          {auditCase && (
            <div className="flex flex-col items-end gap-1">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATE_COLORS[auditCase.currentState] ?? 'bg-slate-100 text-slate-700'}`}>
                {auditCase.currentState?.replace(/_/g, ' ')}
              </span>
              {auditCase.revenueExposureEtb != null && (
                <span className="text-xs text-slate-500">
                  ETB {Number(auditCase.revenueExposureEtb).toLocaleString('en-ET', { minimumFractionDigits: 2 })}
                </span>
              )}
              {auditCase.dueDate && (
                <span className="text-xs text-slate-500">Due: {auditCase.dueDate}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Planning' && <AuditPlanningTab caseId={caseId} />}
      {activeTab === 'CAAT Analysis' && <CAATAnalysisTab caseId={caseId} />}
      {activeTab === 'Findings' && <FindingsTab caseId={caseId} />}
      {activeTab === 'Report' && <ConsolidatedReportTab caseId={caseId} />}
    </div>
  );
}
