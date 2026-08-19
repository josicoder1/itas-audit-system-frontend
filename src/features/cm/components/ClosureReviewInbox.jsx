import { useState, useEffect } from 'react';
import ClosureSignOffPanel from './ClosureSignOffPanel';

export default function ClosureReviewInbox() {
  const [closures, setClosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClosure, setSelectedClosure] = useState(null);
  const [showSignOff, setShowSignOff] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchClosures();
  }, []);

  const fetchClosures = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/cm/closures', {
        headers: {
          'X-Actor-Id': 'tax-center-manager',
          'X-Tax-Center': 'TAX_CENTER_ADDIS_ABABA',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClosures(data);
      }
    } catch (error) {
      console.error('Failed to fetch closures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (closureId) => {
    setActionInProgress(true);
    try {
      const response = await fetch(`/api/v1/cm/closures/${closureId}/approve`, {
        method: 'POST',
        headers: {
          'X-Actor-Id': 'tax-center-manager',
        },
      });

      if (response.ok) {
        await fetchClosures();
        setSelectedClosure(null);
      }
    } catch (error) {
      console.error('Failed to approve closure:', error);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = async (closureId) => {
    if (!rejectReason.trim()) {
      alert('Rejection reason is required');
      return;
    }

    setActionInProgress(true);
    try {
      const response = await fetch(`/api/v1/cm/closures/${closureId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'tax-center-manager',
        },
        body: JSON.stringify({ reason: rejectReason }),
      });

      if (response.ok) {
        await fetchClosures();
        setSelectedClosure(null);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Failed to reject closure:', error);
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Yoseph / CM</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Case Closure Review Inbox</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-slate-500">Loading closures...</p>
        </div>
      ) : closures.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-slate-600">No cases pending review at this time.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Case ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Tax Center</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {closures.map((closure) => (
                  <tr key={closure.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{closure.auditCaseId}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        closure.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-700' :
                        closure.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {closure.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{closure.taxCenterCode}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedClosure(closure)}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedClosure && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Review Closure: {selectedClosure.auditCaseId}
          </h3>

          {showSignOff ? (
            <ClosureSignOffPanel
              closure={selectedClosure}
              onClose={() => {
                setShowSignOff(false);
                setSelectedClosure(null);
              }}
              onRefresh={fetchClosures}
            />
          ) : (
            <>
              <div className="mb-6 space-y-2">
                <p className="text-sm text-slate-600">
                  <strong>Status:</strong> {selectedClosure.status}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Tax Center:</strong> {selectedClosure.taxCenterCode}
                </p>
              </div>

              {selectedClosure.status === 'PENDING_REVIEW' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      id="reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter reason for rejection (leave blank to approve)..."
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedClosure.id)}
                      disabled={actionInProgress}
                      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300"
                    >
                      {actionInProgress ? 'Processing...' : 'Approve Closure'}
                    </button>
                    {rejectReason && (
                      <button
                        type="button"
                        onClick={() => handleReject(selectedClosure.id)}
                        disabled={actionInProgress}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-300"
                      >
                        {actionInProgress ? 'Processing...' : 'Reject Closure'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClosure(null);
                        setRejectReason('');
                      }}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : selectedClosure.status === 'APPROVED' ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                      This closure is approved and ready for final sign-off.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSignOff(true)}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Proceed to Sign-Off
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClosure(null);
                        setRejectReason('');
                      }}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-600 mb-4">This closure has already been {selectedClosure.status.toLowerCase()}.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClosure(null);
                      setRejectReason('');
                    }}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
