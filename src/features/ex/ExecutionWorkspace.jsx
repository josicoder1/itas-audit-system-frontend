import { useState } from 'react';
import TLDashboardPage from './team-leader/TLDashboardPage';
import AuditorCaseWorkspace from './auditor/AuditorCaseWorkspace';

export default function ExecutionWorkspace() {
  // Toggle between Team Leader and Auditor view for demo
  const [activeView, setActiveView] = useState('team-leader');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Yoseph / EX</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Execution Cluster</h1>
        <p className="mt-1 text-sm text-slate-500">Audit execution workflow — import, assign, plan, analyse, findings, report</p>
      </div>

      {/* View switcher */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        <button
          type="button"
          onClick={() => { setActiveView('team-leader'); setSelectedCaseId(null); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeView === 'team-leader'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Team Leader View
        </button>
        <button
          type="button"
          onClick={() => setActiveView('auditor')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeView === 'auditor'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Auditor View
        </button>
      </div>

      {activeView === 'team-leader' && (
        <TLDashboardPage onOpenCase={(caseId) => { setSelectedCaseId(caseId); setActiveView('auditor'); }} />
      )}
      {activeView === 'auditor' && (
        <AuditorCaseWorkspace caseId={selectedCaseId} onBack={() => setActiveView('team-leader')} />
      )}
    </div>
  );
}
