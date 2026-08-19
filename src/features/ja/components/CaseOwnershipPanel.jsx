import { useState } from 'react';

const MOCK_CHECKOUT_STATE = {
  isCheckedOut: true,
  checkedOutBy: 'Abeba Zeleke',
  checkedOutAt: '2026-08-19 09:35',
  currentUser: 'Abeba Zeleke',
  lockTimeoutMinutes: 30,
};

export default function CaseOwnershipPanel({ caseRef }) {
  const [checkoutState, setCheckoutState] = useState(MOCK_CHECKOUT_STATE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lockMessage, setLockMessage] = useState('');

  const isCurrentUserOwner = checkoutState.currentUser === checkoutState.checkedOutBy;
  const canCheckout = !checkoutState.isCheckedOut;
  const canCheckin = isCurrentUserOwner && checkoutState.isCheckedOut;

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));
    
    const now = new Date();
    setCheckoutState({
      ...checkoutState,
      isCheckedOut: true,
      checkedOutBy: checkoutState.currentUser,
      checkedOutAt: now.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    });
    setLockMessage(`Case locked by you for 30 minutes. Others cannot edit.`);
    setIsProcessing(false);
  };

  const handleCheckin = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));
    
    setCheckoutState({
      ...checkoutState,
      isCheckedOut: false,
      checkedOutBy: null,
      checkedOutAt: null,
    });
    setLockMessage('Case unlocked. Others can now edit.');
    setIsProcessing(false);
    setTimeout(() => setLockMessage(''), 3000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Case Lock Status</p>
          <h3 className="mt-1 font-mono text-lg font-bold text-slate-900">{caseRef}</h3>
        </div>

        {checkoutState.isCheckedOut && (
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="text-lg">🔒</span>
              <span className="text-xs font-semibold uppercase text-amber-700">Locked</span>
            </div>
            <p className="text-xs text-amber-600">{checkoutState.checkedOutBy}</p>
            <p className="text-xs text-amber-500">{checkoutState.checkedOutAt}</p>
          </div>
        )}

        {!checkoutState.isCheckedOut && (
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="text-lg">🔓</span>
              <span className="text-xs font-semibold uppercase text-emerald-700">Unlocked</span>
            </div>
            <p className="text-xs text-emerald-600">Available for checkout</p>
          </div>
        )}
      </div>

      {/* Lock info */}
      {checkoutState.isCheckedOut && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-medium mb-1">📌 Locked by {checkoutState.checkedOutBy}</p>
          <p>This case is currently being reviewed. Lock expires in ~{checkoutState.lockTimeoutMinutes} minutes.</p>
          {isCurrentUserOwner && (
            <p className="mt-1 text-amber-700 font-medium">You can release this case by clicking "Checkin" below.</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        {canCheckout && (
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Locking...' : '🔒 Checkout (Take Ownership)'}
          </button>
        )}

        {canCheckin && (
          <button
            type="button"
            onClick={handleCheckin}
            disabled={isProcessing}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Unlocking...' : '🔓 Checkin (Release)'}
          </button>
        )}
      </div>

      {/* Feedback message */}
      {lockMessage && (
        <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${lockMessage.includes('unlocked') ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
          ✓ {lockMessage}
        </div>
      )}

      {/* Usage hint */}
      <div className="mt-3 text-xs text-slate-500 italic">
        💡 <strong>Tip:</strong> Checkout to prevent others from editing while you review. Checkin when done.
      </div>
    </div>
  );
}
