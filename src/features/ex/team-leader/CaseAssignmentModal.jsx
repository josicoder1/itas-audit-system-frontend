import { useState, useEffect } from 'react';

export default function CaseAssignmentModal({ auditCase, onClose, onAssigned, isReassign = false }) {
  const [auditors, setAuditors] = useState([]);
  const [selectedAuditor, setSelectedAuditor] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingAuditors, setFetchingAuditors] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuditors();
  }, []);

  const fetchAuditors = async () => {
    try {
      const res = await fetch('/api/v1/ex/auditors/available', {
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) setAuditors(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingAuditors(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAuditor) return;
    if (isReassign && !reason.trim()) {
      setError('Reassignment reason is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const endpoint = isReassign
        ? `/api/v1/ex/cases/${auditCase.id}/reassign-auditor`
        : `/api/v1/ex/cases/${auditCase.id}/assign-auditor`;

      const body = isReassign
        ? { newAuditorId: selectedAuditor.auditorId, newAuditorName: selectedAuditor.auditorName, reason }
        : { auditorId: selectedAuditor.auditorId, auditorName: selectedAuditor.auditorName };

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'team-leader-1' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onAssigned();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? data.error ?? 'Assignment failed.');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const capacityColor = (current, max) => {
    if (current >= max) return 'text-red-600';
    if (current >= max - 1) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {isReassign ? 'Reassign Auditor' : 'Assign Auditor'}
        </h3>
        <p className="text-sm text-slate-500 mb-4">Case: <strong>{auditCase.caseRef}</strong></p>

        {fetchingAuditors ? (
          <p className="text-sm text-slate-500 text-center py-4">Loading auditors…</p>
        ) : (
          <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
            {auditors.map((a) => {
              const atCapacity = a.currentCases >= a.capacity;
              return (
                <button
                  key={a.auditorId}
                  type="button"
                  disabled={atCapacity}
                  onClick={() => setSelectedAuditor(a)}
                  className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                    selectedAuditor?.auditorId === a.auditorId
                      ? 'border-emerald-500 bg-emerald-50'
                      : atCapacity
                        ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-900">{a.auditorName}</span>
                  <span className={`text-xs font-semibold ${capacityColor(a.currentCases, a.capacity)}`}>
                    {a.currentCases}/{a.capacity} {atCapacity ? '(Full)' : 'cases'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {selectedAuditor && (
          <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Selected: <strong>{selectedAuditor.auditorName}</strong> — {selectedAuditor.currentCases}/{selectedAuditor.capacity} cases
          </div>
        )}

        {isReassign && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason for Reassignment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter reason…"
            />
          </div>
        )}

        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedAuditor || loading}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300"
          >
            {loading ? 'Saving…' : isReassign ? 'Reassign' : 'Assign'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
