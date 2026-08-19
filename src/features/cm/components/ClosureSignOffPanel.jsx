import { useState } from 'react';
import LedgerReceiptBadge from './LedgerReceiptBadge';
import CertificateModal from './CertificateModal';

export default function ClosureSignOffPanel({ closure, onClose, onRefresh }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signOffResponse, setSignOffResponse] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleSignOff = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/cm/closures/${closure.id}/sign-off`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'tax-center-manager',
        },
        body: JSON.stringify({
          principal: closure.principal || 0,
          penalty: closure.penalty || 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSignOffResponse(data);
        setIsConfirming(false);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Failed to sign off closure:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!closure) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Final Sign-Off</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          Closure Sign-Off
        </h3>
      </div>

      {closure.status === 'CLOSED' ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="text-emerald-600 text-xl">✓</div>
            <div>
              <p className="font-semibold text-emerald-900">Case Closed</p>
              <p className="text-sm text-emerald-700 mt-1">
                This case was signed off on {closure.signedOffAt ? new Date(closure.signedOffAt).toLocaleString() : 'N/A'}
              </p>
              <p className="text-sm text-emerald-700">
                by Manager: {closure.managerSignatureId}
              </p>
            </div>
          </div>
        </div>
      ) : signOffResponse ? (
        <div className="space-y-6">
          <LedgerReceiptBadge 
            receiptId={signOffResponse.ledgerReceiptId}
            principal={signOffResponse.principal}
            penalty={signOffResponse.penalty}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="flex-1 rounded-md bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              Send Clearance Certificate
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
          <CertificateModal 
            closureId={closure.id}
            isOpen={showCertificateModal}
            onClose={() => setShowCertificateModal(false)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="font-semibold text-slate-900 mb-3">Case Summary</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p><strong>Audit Case:</strong> {closure.auditCaseId}</p>
              <p><strong>Tax Center:</strong> {closure.taxCenterCode}</p>
              <p><strong>Current Status:</strong> {closure.status}</p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Important:</strong> Once you sign off, this case will be <strong>CLOSED</strong> and cannot be modified by any system.
            </p>
          </div>

          {!isConfirming ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="flex-1 rounded-md bg-red-600 px-4 py-3 text-center font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Finalize and Close Case
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-red-300 bg-red-50 p-6">
              <h4 className="font-bold text-red-900 mb-3 text-lg">Confirm Case Closure</h4>
              <p className="text-sm text-red-800 mb-4">
                Are you absolutely certain you want to close this case? This action is <strong>irreversible</strong> and the case will be frozen permanently.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSignOff}
                  disabled={isSubmitting}
                  className="flex-1 rounded-md bg-red-700 px-4 py-2 text-center font-semibold text-white hover:bg-red-800 disabled:bg-slate-300"
                >
                  {isSubmitting ? 'Processing...' : 'Yes, Close Case'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  disabled={isSubmitting}
                  className="flex-1 rounded-md border border-red-300 px-4 py-2 text-center font-medium text-red-800 hover:bg-red-100 disabled:bg-slate-100"
                >
                  No, Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
