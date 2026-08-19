import { useState, useEffect } from 'react';

export default function TeamWorkloadAnalysis() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkload();
  }, []);

  const fetchWorkload = async () => {
    try {
      const res = await fetch('/api/v1/ex/dashboard/team-workload?teamLeaderId=team-leader-1', {
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) setMetrics(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-slate-500 text-sm py-8 text-center">Loading workload…</p>;
  if (!metrics) return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
      <p className="text-slate-500 text-sm">No workload data available.</p>
    </div>
  );

  const utilization = metrics.utilizationPercent ?? 0;
  const utilizationColor = utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900">Team Workload</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Cases', value: metrics.totalCases ?? 0 },
          { label: 'Assigned', value: metrics.assignedCases ?? 0 },
          { label: 'Unassigned', value: metrics.unassignedCases ?? 0 },
          { label: 'Utilization', value: `${Math.round(utilization)}%` },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Capacity bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-2">Team Capacity Utilization</p>
        <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${utilizationColor}`}
            style={{ width: `${Math.min(utilization, 100)}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">{metrics.assignedCases} assigned of {metrics.totalCapacity ?? '—'} max capacity</p>
      </div>

      {/* Per-auditor breakdown */}
      {metrics.auditorsWorkload && Object.keys(metrics.auditorsWorkload).length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <p className="text-sm font-semibold text-slate-900">Auditor Breakdown</p>
          </div>
          <div className="divide-y divide-slate-100">
            {Object.entries(metrics.auditorsWorkload).map(([auditorId, count]) => {
              const pct = (count / 5) * 100;
              const barColor = count >= 5 ? 'bg-red-500' : count >= 4 ? 'bg-amber-500' : 'bg-emerald-500';
              return (
                <div key={auditorId} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{auditorId}</span>
                    <span className={`text-xs font-semibold ${count >= 5 ? 'text-red-600' : count >= 4 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {count}/5 cases
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
