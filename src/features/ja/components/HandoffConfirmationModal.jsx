import React from 'react';
import '../../../styles/HandoffConfirmationModal.css';

const HandoffConfirmationModal = ({ handoff, onConfirm, onCancel, loading }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Confirm Case Handoff</h3>
          <button className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-body">
          <div className="confirmation-summary">
            <h4>You are about to transfer the following case:</h4>
            
            <div className="case-details">
              <div className="detail-row">
                <span className="label">Case Number:</span>
                <span className="value">{handoff.caseNumber}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Region:</span>
                <span className="value">{handoff.regionCode}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Fiscal Year:</span>
                <span className="value">FY {handoff.year}</span>
              </div>
            </div>

            <div className="amount-box">
              <h5>Total Adjustment Amount</h5>
              <div className="amount-display">
                <span className="currency">ETB</span>
                <span className="value">
                  {handoff.totalAdjustmentEtb?.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  }) || '0'}
                </span>
              </div>
              
              <div className="breakdown">
                <div className="breakdown-item">
                  <span>Principal:</span>
                  <strong>{handoff.consolidatedPrincipalEtb?.toLocaleString('en-US', { 
                    maximumFractionDigits: 2 
                  }) || '0'} ETB</strong>
                </div>
                <div className="breakdown-item">
                  <span>Penalty:</span>
                  <strong>{handoff.consolidatedPenaltyEtb?.toLocaleString('en-US', { 
                    maximumFractionDigits: 2 
                  }) || '0'} ETB</strong>
                </div>
                <div className="breakdown-item">
                  <span>Interest:</span>
                  <strong>{handoff.consolidatedInterestEtb?.toLocaleString('en-US', { 
                    maximumFractionDigits: 2 
                  }) || '0'} ETB</strong>
                </div>
              </div>
            </div>

            {handoff.keyFindings && (
              <div className="findings-box">
                <h5>Key Findings</h5>
                <p>{handoff.keyFindings}</p>
              </div>
            )}

            <div className="confirmation-notice">
              <strong>⚠️ Important</strong>
              <p>
                Once you confirm this handoff, the case will be transferred to the Execution cluster
                for detailed audit procedures, findings documentation, and compliance follow-up.
                This action is irreversible.
              </p>
            </div>

            <div className="confirmation-checklist">
              <h5>Before you proceed, please verify:</h5>
              <ul>
                <li>✓ All consolidation voting is complete</li>
                <li>✓ Consensus has been reached on the case</li>
                <li>✓ All committee members have reviewed findings</li>
                <li>✓ Case number and amounts are correct</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn-cancel-modal"
            onClick={onCancel}
            disabled={loading}
          >
            Go Back
          </button>
          <button
            className="btn-confirm-modal"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Transferring...' : 'Confirm & Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandoffConfirmationModal;
