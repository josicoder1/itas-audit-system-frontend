import { useState } from 'react';

export default function ConsolidatedFindingsForm() {
  const [principal, setPrincipal] = useState('');
  const [penalty, setPenalty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/ja/cases/case-123/findings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'lead-auditor',
        },
        body: JSON.stringify({
          principal: parseFloat(principal) || 0,
          penalty: parseFloat(penalty) || 0,
        }),
      });

      if (response.ok) {
        setSubmitMessage('✓ Consolidated findings submitted successfully.');
        setPrincipal('');
        setPenalty('');
      } else {
        setSubmitMessage('✗ Error submitting consolidated findings.');
      }
    } catch (error) {
      setSubmitMessage(`✗ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Final consolidation</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Consolidated Findings Form</h2>
      </div>

      <div className="mb-6 rounded-lg border border-slate-100 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <strong>Note:</strong> All jurisdictions must sign off before submitting consolidated findings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="principal" className="block text-sm font-medium text-slate-700">
            Consolidated Principal (ETB)
          </label>
          <input
            id="principal"
            type="number"
            step="0.01"
            min="0"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label htmlFor="penalty" className="block text-sm font-medium text-slate-700">
            Consolidated Penalty (ETB)
          </label>
          <input
            id="penalty"
            type="number"
            step="0.01"
            min="0"
            value={penalty}
            onChange={(e) => setPenalty(e.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="0.00"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !principal || !penalty}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Consolidated Findings'}
        </button>

        {submitMessage && (
          <div className={`rounded-md p-3 text-sm ${submitMessage.startsWith('✓') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}
