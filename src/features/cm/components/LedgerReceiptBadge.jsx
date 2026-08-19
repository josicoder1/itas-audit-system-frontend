export default function LedgerReceiptBadge({ receiptId, principal, penalty }) {
  return (
    <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl text-emerald-600">✓</div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-emerald-900 mb-3">Ledger Posted Successfully</h4>
          <div className="space-y-2 text-sm text-emerald-800">
            <div className="flex justify-between">
              <span className="font-medium">Receipt ID:</span>
              <code className="font-mono bg-emerald-100 px-3 py-1 rounded">{receiptId}</code>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Principal Posted:</span>
              <span>{principal ? principal.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'} ETB</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Penalty Posted:</span>
              <span>{penalty ? penalty.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'} ETB</span>
            </div>
          </div>
          <p className="text-xs text-emerald-700 mt-4 italic">
            The adjustment has been recorded in the external ledger system.
          </p>
        </div>
      </div>
    </div>
  );
}
