import { useState } from 'react';
import HandoffInbox from './HandoffInbox';
import CasesTable from './CasesTable';
import TeamWorkloadAnalysis from './TeamWorkloadAnalysis';
import UrgentAlertsPanel from './UrgentAlertsPanel';

const TABS = ['Overview', 'Handoff Inbox', 'Cases', 'Workload', 'Alerts'];

export default function TLDashboardPage({ onOpenCase }) {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-4">
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

      {activeTab === 'Overview' && <OverviewTab onOpenCase={onOpenCase} />}
      {activeTab === 'Handoff Inbox' && <HandoffInbox />}
      {activeTab === 'Cases' && <CasesTable onOpenCase={onOpenCase} />}
      {activeTab === 'Workload' && <TeamWorkloadAnalysis />}
      {activeTab === 'Alerts' && <UrgentAlertsPanel onOpenCase={onOpenCase} />}
    </div>
  );
}

function OverviewTab({ onOpenCase }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Cases', value: '—', color: 'bg-slate-100 text-slate-700' },
          { label: 'Assigned', value: '—', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Pending Assignment', value: '—', color: 'bg-amber-50 text-amber-700' },
          { label: 'Overdue', value: '—', color: 'bg-red-50 text-red-700' },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl border border-slate-200 p-4 ${card.color}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{card.label}</p>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CasesTable compact onOpenCase={onOpenCase} />
        <UrgentAlertsPanel compact onOpenCase={onOpenCase} />
      </div>
    </div>
  );
}
