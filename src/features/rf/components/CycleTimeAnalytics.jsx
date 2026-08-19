import { useState, useEffect } from 'react';

export default function CycleTimeAnalytics({ dateRange = null, taxCenterCode = null }) {
  const [cycleData, setCycleData] = useState([]);
  const [overallMetrics, setOverallMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, [dateRange, taxCenterCode]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const cycleUrl = new URL('/api/v1/rf/reports/cycle-times', window.location.origin);
      const overallUrl = new URL('/api/v1/rf/reports/overall-metrics', window.location.origin);

      if (dateRange?.startDate) {
        cycleUrl.searchParams.append('startDate', dateRange.startDate);
        overallUrl.searchParams.append('startDate', dateRange.startDate);
      }
      if (dateRange?.endDate) {
        cycleUrl.searchParams.append('endDate', dateRange.endDate);
        overallUrl.searchParams.append('endDate', dateRange.endDate);
      }
      if (taxCenterCode) {
        cycleUrl.searchParams.append('taxCenterCode', taxCenterCode);
      }

      const [cycleRes, overallRes] = await Promise.all([
        fetch(cycleUrl.toString()),
        fetch(overallUrl.toString()),
      ]);

      if (cycleRes.ok && overallRes.ok) {
        const cycle = await cycleRes.json();
        const overall = await overallRes.json();
        setCycleData(cycle);
        setOverallMetrics(overall);
      } else {
        setError('Failed to fetch metrics');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Yoseph / RF</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Audit Cycle Time Analytics</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-slate-500">Loading metrics...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      ) : (
        <>
          {/* Overall Metrics Summary */}
          {overallMetrics && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-600 uppercase">Total Closed Cases</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{overallMetrics.totalCases}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-600 uppercase">Avg Duration (Days)</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{overallMetrics.avgDuration}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-600 uppercase">Fastest (Days)</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{overallMetrics.minDuration}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-600 uppercase">Slowest (Days)</p>
                <p className="mt-2 text-3xl font-bold text-red-600">{overallMetrics.maxDuration}</p>
              </div>
            </div>
          )}

          {/* Tax Center Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Cycle Time by Tax Center</h2>

            {cycleData.length === 0 ? (
              <p className="text-slate-600">No data available yet.</p>
            ) : (
              <div className="space-y-4">
                {cycleData.map((row) => (
                  <div key={row.taxCenterCode}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-slate-900">{row.taxCenterCode}</span>
                      <div className="flex gap-4 text-sm text-slate-600">
                        <span>{row.avgDurationDays} days avg</span>
                        <span>({row.caseCount} cases)</span>
                      </div>
                    </div>
                    <div className="relative h-8 bg-slate-100 rounded-md overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                        style={{
                          width: `${Math.min((row.avgDurationDays / (overallMetrics?.maxDuration || 100)) * 100, 100)}%`,
                        }}
                      >
                        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-semibold text-white">
                          {row.avgDurationDays}d
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Min: {row.minDurationDays}d</span>
                      <span>Max: {row.maxDurationDays}d</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
