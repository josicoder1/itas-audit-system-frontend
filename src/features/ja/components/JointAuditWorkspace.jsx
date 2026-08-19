import { useState } from 'react';
import JADashboard from './JADashboard';
import JACommitteeMemberWorkspace from './JACommitteeMemberWorkspace';
import JAChairpersonWorkspace from './JAChairpersonWorkspace';

const ROLES = [
  { id: 'member', label: 'Committee Member' },
  { id: 'chairperson', label: 'Chairperson' },
];

export default function JointAuditWorkspace() {
  const [activeRole, setActiveRole] = useState('member');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'case'

  const handleOpenCase = (caseId) => {
    setSelectedCaseId(caseId);
    setView('case');
  };

  const handleBack = () => {
    setSelectedCaseId(null);
    setView('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">JA Cluster</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Joint Audit Workspace</h1>
        <p className="mt-1 text-sm text-slate-500">
          Multi-jurisdictional audit — committee review, voting, team formation, and handoff to execution
        </p>
      </div>

      {/* Role switcher */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {ROLES.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => {
              setActiveRole(role.id);
              handleBack(); // reset to dashboard on role switch
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeRole === role.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Dashboard or case workspace */}
      {view === 'dashboard' && (
        <JADashboard onOpenCase={handleOpenCase} />
      )}

      {view === 'case' && activeRole === 'member' && (
        <JACommitteeMemberWorkspace caseId={selectedCaseId} onBack={handleBack} />
      )}

      {view === 'case' && activeRole === 'chairperson' && (
        <JAChairpersonWorkspace caseId={selectedCaseId} onBack={handleBack} />
      )}
    </div>
  );
}
