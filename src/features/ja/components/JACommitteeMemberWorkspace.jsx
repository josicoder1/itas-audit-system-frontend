import { useState } from 'react';
import ResearchWorkspace from './ResearchWorkspace';
import VotingWorkspace from './VotingWorkspace';
import CaseIntelligence from './CaseIntelligence';
import AuditorNominationPanel from './AuditorNominationPanel';
import CaseOwnershipPanel from './CaseOwnershipPanel';

const TABS = ['Overview', 'Case Intelligence', 'Research Notes', 'Voting', 'Auditor Nominations'];

// Mock case data — in production this would be fetched by caseId
const MOCK_CASE = {
  id: 'ja-case-001',
  caseRef: 'JA-2026-001',
  taxpayerName: 'Addis Ababa Trading PLC',
  tin: 'ETH-TAX-00123456',
  segment: 'Large Taxpayer',
  industry: 'Import/Export',
  riskScore: 87,
  riskPriority: 'HIGH',
  status: 'PENDING_VIABILITY',
  dueDate: '2026-09-15',
  jurisdictions: ['Tax Department East', 'Customs & Excise'],
  mandate: 'Review cross-jurisdictional revenue discrepancy related to import duties and VAT obligations for FY 2025.',
  riskCriteria: [
    'Gross revenue mismatch between customs records and income declaration (>ETB 15M)',
    'Third-party payment data anomaly — 23 high-value unreported transfers',
    'Previous audit adjustment flag (FY 2023)',
  ],
};

const RISK_BG = { HIGH: 'bg-red-100 text-red-700', MEDIUM: 'bg-amber-100 text-amber-700', LOW: 'bg-emerald-100 text-emerald-700' };

export default function JACommitteeMemberWorkspace({ caseId, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview');

  // In production: fetch case by caseId
  const auditCase = MOCK_CASE;

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
            <h2 className="text-xl font-bold text-slate-900">{auditCase.caseRef}</h2>
            <p className="text-sm font-medium text-slate-700 mt-0.5">{auditCase.taxpayerName}</p>
            <p className="text-xs text-slate-500 mt-0.5">TIN: {auditCase.tin} · {auditCase.segment} · {auditCase.industry}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${RISK_BG[auditCase.riskPriority]}`}>
              Risk: {auditCase.riskScore} / 100 — {auditCase.riskPriority}
            </span>
            <span className="text-xs text-slate-500">Due: {auditCase.dueDate}</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200">
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
          <CaseOwnershipPanel caseRef={auditCase.caseRef} />
          <div className="grid gap-4 md:grid-cols-2">
            {/* Mandate */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600 mb-2">Committee Mandate</p>
              <p className="text-sm text-slate-700 leading-relaxed">{auditCase.mandate}</p>
            </div>

            {/* Risk Criteria */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-600 mb-2">Risk Criteria Flagged</p>
              <ul className="space-y-2">
                {auditCase.riskCriteria.map((criterion, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-red-400 shrink-0">▸</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Jurisdictions */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-600 mb-2">Participating Jurisdictions</p>
              <div className="flex flex-wrap gap-2">
                {auditCase.jurisdictions.map((j) => (
                  <span key={j} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                    {j}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Case Intelligence' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <CaseIntelligence />
        </div>
      )}

      {activeTab === 'Research Notes' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ResearchWorkspace />
        </div>
      )}

      {activeTab === 'Voting' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <VotingWorkspace />
        </div>
      )}

      {activeTab === 'Auditor Nominations' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <AuditorNominationPanel isChairperson={false} />
        </div>
      )}
    </div>
  );
}
