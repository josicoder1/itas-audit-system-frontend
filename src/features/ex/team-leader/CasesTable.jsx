import { useState, useEffect } from 'react';
import CaseAssignmentModal from './CaseAssignmentModal';

const STATE_COLORS = {
  CASE_ASSIGNED: 'bg-blue-100 text-blue-700',
  PLANNING: 'bg-purple-100 text-purple-700',
  IN_EXECUTION: 'bg-amber-100 text-amber-700',
  QA: 'bg-indigo-100 text-indigo-700',
  CLOSED: 'bg-emerald-100 text-emerald-700',
};

export default function CasesTable({ compact = false, onOpenCase }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState('');
  const [assignTarget, setAssignTarget] = useState(null);

  useEffect(() => { fetchCases(); }, [filterState]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ teamLeaderId: 'team-leader-1' });
      if (filterState) params.set('state', filterState);
      const res = await fetch(`/api/v1/ex/cases?${params}`, {
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) setCases(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const displayed = compact ? cases.slice(0, 5) : cases;

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex-1">Cases</h2>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All States</option>
            {Object.keys(STATE_COLORS).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      )}

      {compact && <h3 className="text-base font-semibold text-slate-900">Recent Cases</h3>}

      {loading ? (
        <p className="text-slate-500 text-sm py-4 text-center">Loading…</p>
      ) : displayed.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-slate-500 text-sm">No cases found.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {['Case Ref', 'Region', 'State', 'Due Date', 'Revenue Exposure', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((c) => {
                const isOverdue = c.dueDate && new Date(c.dueDate) < new Date() && c.currentState !== 'CLOSED';
                return (
                  <tr key={c.id} className={`border-b border-slate-100 hover:bg-slate-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-slate-900">{c.caseRef}</td>
                    <td className="px-4 py-3 text-slate-600">{c.region ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${STATE_COLORS[c.currentState] ?? 'bg-slate-100 text-slate-700'}`}>
                        {c.currentState?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isOverdue ? 'font-semibold text-red-600' : 'text-slate-600'}`}>
                      {c.dueDate ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-900 text-right">
                      {c.revenueExposureEtb != null
                        ? Number(c.revenueExposureEtb).toLocaleString('en-ET', { minimumFractionDigits: 2 })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {!c.assignedAuditorId && (
                        <button
                          type="button"
                          onClick={() => setAssignTarget(c)}
                          className="mr-3 text-xs font-medium text-amber-600 hover:text-amber-700"
                        >
                          Assign
                        </button>
                      )}
                      {onOpenCase && (
                        <button
                          type="button"
                          onClick={() => onOpenCase(c.id)}
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          Open
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {assignTarget && (
        <CaseAssignmentModal
          auditCase={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={() => { setAssignTarget(null); fetchCases(); }}
        />
      )}
    </div>
  );
}
