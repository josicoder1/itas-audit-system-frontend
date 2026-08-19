import { useState, useEffect } from 'react';
import CycleTimeAnalytics from './CycleTimeAnalytics';
import FinancialYieldReport from './FinancialYieldReport';

export default function LocalReportingDashboard() {
  const [userTaxCenter, setUserTaxCenter] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check user role and get tax center code
    const userRole = localStorage.getItem('userRole') || 'ROLE_TAX_CENTER_MANAGER';
    const userTaxCenterCode = localStorage.getItem('userTaxCenterCode') || 'ADDIS';

    if (userRole !== 'ROLE_TAX_CENTER_MANAGER') {
      // Access denied - show error after a short delay to ensure state is set
      setTimeout(() => setIsLoaded(true), 100);
      return;
    }

    setUserTaxCenter(userTaxCenterCode);

    // Set default date range (last 30 days)
    const today = new Date();
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateRange({
      startDate: lastMonth.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    });

    setIsLoaded(true);
  }, []);

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilter = () => {
    // Trigger refresh by changing key
    setRefreshKey(prev => prev + 1);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!userTaxCenter) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-900 mb-2">Access Denied</h1>
        <p className="text-red-800">This dashboard is restricted to Tax Center Managers only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tax Center Manager / RF</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Local Reporting Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Audit metrics for {userTaxCenter} tax center</p>
      </div>

      {/* Date Range Filter */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyFilter}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Components - Filtered by Tax Center */}
      <CycleTimeAnalytics 
        key={`cycle-${refreshKey}`} 
        dateRange={dateRange}
        taxCenterCode={userTaxCenter}
      />
      <FinancialYieldReport 
        key={`yield-${refreshKey}`} 
        dateRange={dateRange}
        taxCenterCode={userTaxCenter}
      />
    </div>
  );
}
