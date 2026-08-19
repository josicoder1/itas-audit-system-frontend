import { useState } from 'react';

// Mock taxpayer data
const MOCK_TAXPAYER_PROFILE = {
  tin: 'ETH-TAX-00123456',
  name: 'Addis Ababa Trading PLC',
  segment: 'Large Taxpayer',
  industry: 'Import/Export',
  registrationDate: '2015-03-12',
  status: 'Active',
  businessAddress: {
    street: 'Kemal Abdulnasser Ave, Building 42',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    postal: '1000',
  },
  contacts: [
    { name: 'Dr. Abebe Tsegaye', title: 'CEO', phone: '+251-11-546-8900', email: 'abebe@aatpl.et' },
    { name: 'Marta Kebede', title: 'CFO', phone: '+251-11-546-8901', email: 'marta@aatpl.et' },
  ],
};

const MOCK_RISK_ASSESSMENT = {
  overallScore: 87,
  riskPriority: 'HIGH',
  components: [
    { name: 'Compliance Risk', score: 92, level: 'High' },
    { name: 'Financial Risk', score: 78, level: 'Medium' },
    { name: 'Operational Risk', score: 85, level: 'High' },
  ],
};

const MOCK_RISK_CRITERIA = [
  { rule: 'Gross revenue mismatch', description: 'Gross revenue differs by >ETB 15M between customs and income tax', flagged: true },
  { rule: 'Third-party data anomaly', description: '23 high-value unreported transfers detected', flagged: true },
  { rule: 'Previous audit flag', description: 'FY 2023 audit adjustment (ETB 2.1M penalty)', flagged: true },
  { rule: 'Filing timeliness', description: 'Late filing in 2 of last 4 years', flagged: false },
];

const MOCK_FILING_HISTORY = [
  { year: 2025, status: 'Filed', date: '2026-02-15', onTime: true },
  { year: 2024, status: 'Filed', date: '2025-02-10', onTime: true },
  { year: 2023, status: 'Filed', date: '2024-03-05', onTime: false, penalty: 'ETB 50K' },
  { year: 2022, status: 'Filed', date: '2023-02-28', onTime: true },
];

const MOCK_PAYMENT_HISTORY = [
  { period: 'Q1 2026', amount: 8500000, date: '2026-04-15', status: 'Paid', daysLate: 0 },
  { period: 'Q4 2025', amount: 7200000, date: '2026-01-25', status: 'Paid', daysLate: 10 },
  { period: 'Q3 2025', amount: 6800000, date: '2025-10-20', status: 'Paid', daysLate: 5 },
  { period: 'Q2 2025', amount: 7500000, date: '2025-07-31', status: 'Paid', daysLate: 0 },
];

const MOCK_PREVIOUS_AUDITS = [
  { year: 2023, type: 'Tax Audit', principal: 'ETH 2,100,000', penalty: 'ETH 420,000', resolution: 'Settled' },
  { year: 2021, type: 'VAT Audit', principal: 'ETH 890,000', penalty: 'ETH 178,000', resolution: 'Settled' },
];

export default function CaseIntelligence() {
  const [expandedSection, setExpandedSection] = useState('profile');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderRiskBadge = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-700';
    if (score >= 60) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  return (
    <div className="space-y-4">
      {/* Taxpayer Profile */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('profile')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">👤</span>
            <h3 className="text-lg font-semibold text-slate-900">Taxpayer Profile</h3>
          </div>
          <span className={`text-slate-400 transition-transform ${expandedSection === 'profile' ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {expandedSection === 'profile' && (
          <div className="px-5 py-4 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">TIN</p>
                <p className="mt-0.5 font-mono text-sm text-slate-900">{MOCK_TAXPAYER_PROFILE.tin}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Segment</p>
                <p className="mt-0.5 text-sm text-slate-900">{MOCK_TAXPAYER_PROFILE.segment}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Industry</p>
                <p className="mt-0.5 text-sm text-slate-900">{MOCK_TAXPAYER_PROFILE.industry}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Registration</p>
                <p className="mt-0.5 text-sm text-slate-900">{MOCK_TAXPAYER_PROFILE.registrationDate}</p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Business Address</p>
              <p className="text-sm text-slate-700">
                {MOCK_TAXPAYER_PROFILE.businessAddress.street}
                <br />
                {MOCK_TAXPAYER_PROFILE.businessAddress.city}, {MOCK_TAXPAYER_PROFILE.businessAddress.region}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Key Contacts</p>
              <div className="space-y-2">
                {MOCK_TAXPAYER_PROFILE.contacts.map((contact, i) => (
                  <div key={i} className="text-sm border-l-2 border-blue-300 pl-3">
                    <p className="font-medium text-slate-800">{contact.name}</p>
                    <p className="text-xs text-slate-500">{contact.title}</p>
                    <p className="text-xs text-blue-600">{contact.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risk Assessment */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('risk')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <h3 className="text-lg font-semibold text-slate-900">Risk Assessment</h3>
            <span className={`ml-auto inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${renderRiskBadge(MOCK_RISK_ASSESSMENT.overallScore)}`}>
              {MOCK_RISK_ASSESSMENT.overallScore} / 100
            </span>
          </div>
          <span className={`text-slate-400 transition-transform ${expandedSection === 'risk' ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {expandedSection === 'risk' && (
          <div className="px-5 py-4 border-t border-slate-100 space-y-3">
            {MOCK_RISK_ASSESSMENT.components.map((comp) => (
              <div key={comp.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{comp.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${renderRiskBadge(comp.score)}`}>{comp.score}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${comp.score >= 80 ? 'bg-red-500' : comp.score >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Criteria */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('criteria')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🎯</span>
            <h3 className="text-lg font-semibold text-slate-900">Risk Criteria</h3>
          </div>
          <span className={`text-slate-400 transition-transform ${expandedSection === 'criteria' ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {expandedSection === 'criteria' && (
          <div className="px-5 py-4 border-t border-slate-100 space-y-2">
            {MOCK_RISK_CRITERIA.map((crit, i) => (
              <div key={i} className={`p-3 rounded-lg border-l-4 ${crit.flagged ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-300'}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">{crit.flagged ? '🚩' : '✓'}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-900">{crit.rule}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{crit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filing History */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('filing')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📋</span>
            <h3 className="text-lg font-semibold text-slate-900">Filing History</h3>
          </div>
          <span className={`text-slate-400 transition-transform ${expandedSection === 'filing' ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {expandedSection === 'filing' && (
          <div className="px-5 py-4 border-t border-slate-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase">
                  <th className="pb-2">Year</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Filed Date</th>
                  <th className="pb-2">On Time</th>
                  <th className="pb-2">Penalty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_FILING_HISTORY.map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 font-mono">{row.year}</td>
                    <td className="py-2">{row.status}</td>
                    <td className="py-2 text-slate-600">{row.date}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${row.onTime ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {row.onTime ? 'Yes' : 'Late'}
                      </span>
                    </td>
                    <td className="py-2 text-slate-600">{row.penalty || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('payment')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">💰</span>
            <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
          </div>
          <span className={`text-slate-400 transition-transform ${expandedSection === 'payment' ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {expandedSection === 'payment' && (
          <div className="px-5 py-4 border-t border-slate-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase">
                  <th className="pb-2">Period</th>
                  <th className="pb-2 text-right">Amount (ETB)</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Days Late</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_PAYMENT_HISTORY.map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 font-medium">{row.period}</td>
                    <td className="py-2 text-right text-slate-900 font-mono">{row.amount.toLocaleString('en-US')}</td>
                    <td className="py-2 text-slate-600">{row.date}</td>
                    <td className="py-2">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={row.daysLate > 0 ? 'text-red-600 font-medium' : 'text-slate-600'}>{row.daysLate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Previous Audits */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('audits')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📊</span>
            <h3 className="text-lg font-semibold text-slate-900">Previous Audits</h3>
          </div>
          <span className={`text-slate-400 transition-transform ${expandedSection === 'audits' ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {expandedSection === 'audits' && (
          <div className="px-5 py-4 border-t border-slate-100 space-y-3">
            {MOCK_PREVIOUS_AUDITS.map((audit, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-900">{audit.year} {audit.type}</h4>
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">{audit.resolution}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Principal</p>
                    <p className="mt-0.5 font-mono font-medium text-slate-900">{audit.principal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Penalty</p>
                    <p className="mt-0.5 font-mono font-medium text-red-600">{audit.penalty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Total</p>
                    <p className="mt-0.5 font-mono font-bold text-slate-900">ETH 2,520,000</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
