import { useState } from 'react';

export default function CertificateModal({ closureId, isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSendCertificate = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/v1/cm/closures/${closureId}/certificate`, {
        method: 'POST',
        headers: {
          'X-Actor-Id': 'tax-center-manager',
        },
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send certificate');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
        {success ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl text-emerald-600 mb-3">✓</div>
              <h3 className="text-lg font-bold text-emerald-900">Certificate Sent</h3>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-800">
                The clearance certificate has been successfully sent to the taxpayer.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Send Clearance Certificate</h3>
            <p className="text-sm text-slate-600">
              Send the audit clearance certificate to the taxpayer confirming the case closure.
            </p>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSendCertificate}
                disabled={isSubmitting}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300"
              >
                {isSubmitting ? 'Sending...' : 'Send Certificate'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
