import React from 'react';

const CLUSTERS = [
  { id: 'ja', label: 'Joint Audit', short: 'JA', color: 'bg-blue-600' },
  { id: 'ex', label: 'Execution', short: 'EX', color: 'bg-emerald-600' },
];

const Layout = ({ children, activeCluster, onClusterChange }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 bg-slate-800">
          <h1 className="text-xl font-bold">MOR — ITAS</h1>
          <p className="text-sm text-slate-400">Audit Management System</p>
        </div>

        <div className="p-4 border-b border-slate-700">
          <p className="font-semibold text-sm">Planning Auditor</p>
          <p className="text-xs text-slate-400">planning.auditor1@mor.gov.et</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs text-slate-500 uppercase font-bold mb-3">Clusters</p>

          {CLUSTERS.map((cluster) => (
            <button
              key={cluster.id}
              type="button"
              onClick={() => onClusterChange && onClusterChange(cluster.id)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                activeCluster === cluster.id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold text-white ${cluster.color}`}>
                {cluster.short}
              </span>
              <span className="text-sm font-medium">{cluster.label}</span>
              {activeCluster === cluster.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-700 mt-4">
            <p className="text-xs text-slate-500 uppercase font-bold mb-3">More</p>
            <button type="button" className="w-full text-left p-2 rounded text-slate-400 hover:bg-slate-800 hover:text-white text-sm">
              Dashboard
            </button>
            <button type="button" className="w-full text-left p-2 rounded text-slate-400 hover:bg-slate-800 hover:text-white text-sm">
              Reporting &amp; Financials
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">Version 1.0.0-sprint</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            {activeCluster && (
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold text-white ${
                CLUSTERS.find((c) => c.id === activeCluster)?.color ?? 'bg-slate-600'
              }`}>
                {CLUSTERS.find((c) => c.id === activeCluster)?.short}
              </span>
            )}
            <h2 className="text-base font-semibold text-gray-800">
              {CLUSTERS.find((c) => c.id === activeCluster)?.label ?? 'ITAS Audit System'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{new Date().toDateString()}</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              PA
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-auto p-6">
          {children ?? <div className="text-gray-500">Workspace Area</div>}
        </main>
      </div>
    </div>
  );
};

export default Layout;
