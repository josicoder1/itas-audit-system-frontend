import { useState } from 'react';

const AVAILABLE_AUDITORS = [
  { id: 'auditor-001', name: 'Yonas Tadesse', department: 'Tax Audit', experience: 8, specialization: 'Large Taxpayers' },
  { id: 'auditor-002', name: 'Marta Kebede', department: 'Customs Audit', experience: 6, specialization: 'Import/Export' },
  { id: 'auditor-003', name: 'Girma Abate', department: 'Tax Audit', experience: 5, specialization: 'Manufacturing' },
  { id: 'auditor-004', name: 'Lena Assefa', department: 'Revenue Audit', experience: 7, specialization: 'Services' },
  { id: 'auditor-005', name: 'Solomon Bekele', department: 'Customs Audit', experience: 9, specialization: 'Large Taxpayers' },
];

const MOCK_NOMINATIONS = [
  {
    id: 'nom-001',
    auditorId: 'auditor-001',
    auditorName: 'Yonas Tadesse',
    nominatedBy: 'Abeba Zeleke',
    nominatedAt: '2026-08-18',
    rationale: 'Extensive experience with large taxpayers, particularly in import/export sector',
    votes: 3,
  },
  {
    id: 'nom-002',
    auditorId: 'auditor-002',
    auditorName: 'Marta Kebede',
    nominatedBy: 'Kebede Adane',
    nominatedAt: '2026-08-18',
    rationale: 'Strong customs background, familiar with cross-jurisdictional issues',
    votes: 2,
  },
];

export default function AuditorNominationPanel({ isChairperson = false }) {
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [selectedAuditor, setSelectedAuditor] = useState('');
  const [rationale, setRationale] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nominations, setNominations] = useState(MOCK_NOMINATIONS);

  const handleNominate = async (e) => {
    e.preventDefault();
    if (!selectedAuditor || !rationale.trim()) return;

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 400));

    const auditor = AVAILABLE_AUDITORS.find((a) => a.id === selectedAuditor);
    const newNomination = {
      id: `nom-${Date.now()}`,
      auditorId: selectedAuditor,
      auditorName: auditor.name,
      nominatedBy: 'Current User',
      nominatedAt: new Date().toISOString().split('T')[0],
      rationale,
      votes: 0,
    };

    setNominations([...nominations, newNomination]);
    setSelectedAuditor('');
    setRationale('');
    setShowNominationForm(false);
    setIsSubmitting(false);
  };

  const auditorDetails = selectedAuditor ? AVAILABLE_AUDITORS.find((a) => a.id === selectedAuditor) : null;

  return (
    <div className="space-y-4">
      {/* Header with button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">Team Assembly</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">Auditor Nominations</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowNominationForm(!showNominationForm)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {showNominationForm ? 'Cancel' : '+ Nominate'}
        </button>
      </div>

      {/* Nomination form */}
      {showNominationForm && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Auditor</label>
            <select
              value={selectedAuditor}
              onChange={(e) => setSelectedAuditor(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Choose an auditor --</option>
              {AVAILABLE_AUDITORS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.department}, {a.experience} yrs)
                </option>
              ))}
            </select>
          </div>

          {auditorDetails && (
            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Department</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-900">{auditorDetails.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Experience</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-900">{auditorDetails.experience} years</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Specialization</p>
                  <p className="mt-0.5 text-sm text-slate-700">{auditorDetails.specialization}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rationale</label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Why do you recommend this auditor for this case?"
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleNominate}
            disabled={!selectedAuditor || !rationale.trim() || isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Nominating...' : 'Nominate'}
          </button>
        </div>
      )}

      {/* Nominations list */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500 font-semibold uppercase">Current Nominations ({nominations.length})</p>
        {nominations.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">No nominations yet. Start by nominating an auditor above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {nominations.map((nom) => (
              <div key={nom.id} className="rounded-lg border border-slate-200 bg-white p-3.5 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{nom.auditorName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Nominated by {nom.nominatedBy} on {nom.nominatedAt}</p>
                  </div>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                    {nom.votes}
                  </span>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded-md">{nom.rationale}</p>
                {isChairperson && (
                  <div className="mt-3 flex gap-2 justify-end">
                    <button
                      type="button"
                      className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      Appoint as Lead
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Add to Team
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
