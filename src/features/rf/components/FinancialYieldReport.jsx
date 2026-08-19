import { useState, useEffect } from 'react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function FinancialYieldReport({ dateRange = null, taxCenterCode = null }) {
  const [yieldData, setYieldData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchYieldData();
  }, [dateRange, taxCenterCode]);

  const fetchYieldData = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/v1/rf/reports/financial-yield', window.location.origin);
      
      if (dateRange?.startDate) {
        url.searchParams.append('startDate', dateRange.startDate);
      }
      if (dateRange?.endDate) {
        url.searchParams.append('endDate', dateRange.endDate);
      }
      if (taxCenterCode) {
        url.searchParams.append('taxCenterCode', taxCenterCode);
      }

      const response = await fetch(url.toString());
      
      if (response.ok) {
        const data = await response.json();
        setYieldData(data);
      } else {
        setError('Failed to fetch yield data');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const totalYield = yieldData.reduce((sum, item) => sum + item.totalYield, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Financial Yield by Audit Type</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-slate-500">Loading yield data...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      ) : yieldData.length === 0 ? (
        <p className="text-slate-600">No yield data available yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simple Pie Chart Representation */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {yieldData.reduce((acc, item, index) => {
                  const percentage = (item.totalYield / totalYield) * 100;
                  const circumference = 2 * Math.PI * 45;
                  const offset = circumference - (percentage / 100) * circumference;
                  const startAngle = acc.angle;
                  const endAngle = startAngle + (percentage * 3.6);

                  const element = (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      transform={`rotate(${startAngle} 50 50)`}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  );

                  return {
                    elements: [...acc.elements, element],
                    angle: endAngle,
                  };
                }, { elements: [], angle: -90 }).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">Total Yield</p>
                  <p className="text-2xl font-bold text-slate-900">{totalYield.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-slate-500">ETB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend and Details */}
          <div className="space-y-3">
            {yieldData.map((item, index) => {
              const percentage = ((item.totalYield / totalYield) * 100).toFixed(1);
              return (
                <div key={item.auditType} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.auditType}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Cases: {item.caseCount} | {percentage}% of total
                      </p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-slate-600">
                          Principal: <span className="font-medium text-slate-900">{item.totalPrincipal.toLocaleString('en-US', { maximumFractionDigits: 0 })} ETB</span>
                        </p>
                        <p className="text-slate-600">
                          Penalty: <span className="font-medium text-slate-900">{item.totalPenalty.toLocaleString('en-US', { maximumFractionDigits: 0 })} ETB</span>
                        </p>
                      </div>
                    </div>
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
