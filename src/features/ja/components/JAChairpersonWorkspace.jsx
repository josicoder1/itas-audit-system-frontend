import { useState } from 'react';
import CommitteeBuilder from './CommitteeBuilder';
import SharedEvidenceVault from './SharedEvidenceVault';
import DisputeResolutionBoard from './DisputeResolutionBoard';
import DepartmentalLockPanel from './DepartmentalLockPanel';
import ConsolidatedFindingsForm from './ConsolidatedFindingsForm';
import HandoffTransferPanel from './HandoffTransferPanel';
import ResearchWorkspace from './ResearchWorkspace';
import VotingWorkspace from './VotingWorkspace';
import CaseIntelligence from './CaseIntelligence';
import AuditorNominationPanel from './AuditorNominationPanel';
import CaseOwnershipPanel from './CaseOwnershipPanel';

const TABS = ['Overview', 'Case Intelligence', 'Team Formation', 'Evidence Vault', 'Disputes', 'Research', 'Voting', 'Lock & Finalize', 'Handoff'];

// Mock chairperson case — same as committee member but with extra controls
const MOCK_CASE = {
  caseRef: 'JA-2026-001',
  taxpayerName: 'Addis Ababa Trading PLC',
  tin: 'ETH-TAX-00123456',
  status: 'PENDING_VIABILITY',
  dueDate: '2026-09-15',
};

const COMMITTEE_ID = 'committee-ja-001';

export default function JAChairpersonWorkspace({ caseId, onBack }) {
  const [activeTab, setActiveTab] = useState('Team Formation');
  const [viabilityStatus, setViabilityStatus] = useState(null); // null | 'APPROVED' | 'REJECTED'
  const [isSubmittingViability, setIsSubmittingViability] = useState(false);

  const handleViabilityDecision = async (decision) => {
    setIsSubmittingViability(true);
    // In production: POST /api/v1/ja/cases/{caseId}/viability
    await new Promise((r) => setTimeout(r, 600));
    setViabilityStatus(decision);
    setIsSubmittingViability(false);
  };

  return (
    <div className="space-y-4">
      {/* Case header */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            {onBack && (
              <button type="button" onClick={onBack} className="text-xs text-slate-500 hover:text-slate-700 mb-1 font-medium">
                ← Back to dashboard
              </button>
            )}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 mb-1">Chairperson Controls</p>
            <h2 className="text-xl font-bold text-slate-900">{MOCK_CASE.caseRef}</h2>
            <p className="text-sm text-slate-600 mt-0.5">{MOCK_CASE.taxpayerName} · TIN: {MOCK_CASE.tin}</p>
          </div>

          {/* Viability Decision */}
          <div className="flex flex-col items-end gap-2">
            {viabilityStatus ? (
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                viabilityStatus === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                Viability: {viabilityStatus}
              </span>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isSubmittingViability}
                  onClick={() => handleViabilityDecision('APPROVED')}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Approve Viability
                </button>
                <button
                  type="button"
                  disabled={isSubmittingViability}
                  onClick={() => handleViabilityDecision('REJECTED')}
                  className="rounded-md bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}
            <span className="text-xs text-slate-500">Due: {MOCK_CASE.dueDate}</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === 'Overview' && (
        <div className="space-y-4">
          <CaseOwnershipPanel caseRef={MOCK_CASE.caseRef} />
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <CaseIntelligence />
          </div>
        </div>
      )}

      {activeTab === 'Case Intelligence' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <CaseIntelligence />
        </div>
      )}

      {activeTab === 'Team Formation' && (
        <div className="space-y-4">
          <CommitteeBuilder />
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <AuditorNominationPanel isChairperson={true} />
          </div>
        </div>
      )}

      {activeTab === 'Evidence Vault' && <SharedEvidenceVault />}
      {activeTab === 'Disputes' && <DisputeResolutionBoard />}
      {activeTab === 'Research' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ResearchWorkspace />
        </div>
      )}
      {activeTab === 'Voting' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <VotingWorkspace />
        </div>
      )}
      {activeTab === 'Lock & Finalize' && (
        <div className="space-y-4">
          <DepartmentalLockPanel />
          <ConsolidatedFindingsForm />
        </div>
      )}
      {activeTab === 'Handoff' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <HandoffTransferPanel committeeId={COMMITTEE_ID} />
        </div>
      )}
    </div>
  );
}
