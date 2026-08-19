import React, { useState, useEffect } from 'react';
import '../../../styles/HandoffTransferPanel.css';

const HandoffTransferPanel = ({ committeeId, onHandoffCreated }) => {
  const [handoffs, setHandoffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedHandoff, setSelectedHandoff] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    regionCode: '',
    year: new Date().getFullYear(),
    consolidatedPrincipalEtb: 0,
    consolidatedPenaltyEtb: 0,
    consolidatedInterestEtb: 0,
    keyFindings: '',
    recommendations: ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const chairpersonId = userInfo.userId || '';

  useEffect(() => {
    fetchHandoffs();
  }, [committeeId]);

  const fetchHandoffs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/ja/handoffs/committee/${committeeId}`
      );
      if (!response.ok) throw new Error('Failed to fetch handoffs');
      const data = await response.json();
      setHandoffs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHandoff = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/ja/handoffs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          committeeId,
          auditCaseId: '00000000-0000-0000-0000-000000000000', // To be filled by UI
          ...formData,
          chairpersonId
        }),
        params: new URLSearchParams({
          committeeId,
          auditCaseId: '00000000-0000-0000-0000-000000000000'
        })
      });

      if (!response.ok) throw new Error('Failed to create handoff');
      
      const newHandoff = await response.json();
      setHandoffs([newHandoff, ...handoffs]);
      setShowForm(false);
      setFormData({
        regionCode: '',
        year: new Date().getFullYear(),
        consolidatedPrincipalEtb: 0,
        consolidatedPenaltyEtb: 0,
        consolidatedInterestEtb: 0,
        keyFindings: '',
        recommendations: ''
      });
      
      if (onHandoffCreated) onHandoffCreated(newHandoff);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmHandoff = async (handoffId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/ja/handoffs/${handoffId}/confirm`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to confirm handoff');
      
      const updated = await response.json();
      setHandoffs(handoffs.map(h => h.id === handoffId ? updated : h));
      setSelectedHandoff(null);
      setShowConfirm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelHandoff = async (handoffId) => {
    if (!window.confirm('Are you sure you want to cancel this handoff?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/ja/handoffs/${handoffId}/cancel`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to cancel handoff');
      
      setHandoffs(handoffs.filter(h => h.id !== handoffId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = handoffs.filter(h => h.status === 'PENDING').length;
  const importedCount = handoffs.filter(h => h.status === 'IMPORTED').length;

  return (
    <div className="handoff-transfer-panel">
      <div className="panel-header">
        <h3>Case Handoff to Execution Cluster</h3>
        <button
          className="btn-new-handoff"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancel' : '+ New Handoff'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pendingCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Imported</span>
          <span className="stat-value">{importedCount}</span>
        </div>
        <button
          className="btn-refresh"
          onClick={fetchHandoffs}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {showForm && (
        <div className="handoff-form-card">
          <h4>Create New Handoff</h4>
          <div className="form-group">
            <label>Region Code</label>
            <input
              type="text"
              value={formData.regionCode}
              onChange={(e) => setFormData({ ...formData, regionCode: e.target.value })}
              placeholder="e.g., ADDIS, OROM"
            />
          </div>

          <div className="form-group">
            <label>Fiscal Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              min="2000"
              max="2100"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Principal (ETB)</label>
              <input
                type="number"
                value={formData.consolidatedPrincipalEtb}
                onChange={(e) => setFormData({ ...formData, consolidatedPrincipalEtb: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Penalty (ETB)</label>
              <input
                type="number"
                value={formData.consolidatedPenaltyEtb}
                onChange={(e) => setFormData({ ...formData, consolidatedPenaltyEtb: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Interest (ETB)</label>
              <input
                type="number"
                value={formData.consolidatedInterestEtb}
                onChange={(e) => setFormData({ ...formData, consolidatedInterestEtb: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Key Findings</label>
            <textarea
              value={formData.keyFindings}
              onChange={(e) => setFormData({ ...formData, keyFindings: e.target.value })}
              rows="4"
              placeholder="Summarize major findings from the audit"
            />
          </div>

          <div className="form-group">
            <label>Recommendations</label>
            <textarea
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              rows="4"
              placeholder="List key recommendations for the taxpayer"
            />
          </div>

          <button
            className="btn-submit"
            onClick={handleCreateHandoff}
            disabled={loading || !formData.regionCode}
          >
            {loading ? 'Creating...' : 'Create Handoff'}
          </button>
        </div>
      )}

      <div className="handoffs-list">
        {loading && !handoffs.length && <div className="loading">Loading handoffs...</div>}
        {!loading && handoffs.length === 0 && (
          <div className="empty-state">
            No handoff records yet. Create one to begin transfer to Execution cluster.
          </div>
        )}

        {handoffs.map((handoff) => (
          <div key={handoff.id} className={`handoff-card status-${handoff.status.toLowerCase()}`}>
            <div className="card-header">
              <div>
                <h4>{handoff.caseNumber}</h4>
                <p className="region-year">
                  {handoff.regionCode} - FY {handoff.year}
                </p>
              </div>
              <div className="status-badge" data-status={handoff.status}>
                {handoff.status}
              </div>
            </div>

            <div className="card-content">
              <div className="amount-summary">
                <div className="amount-item">
                  <span>Principal</span>
                  <strong>{handoff.consolidatedPrincipalEtb?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'} ETB</strong>
                </div>
                <div className="amount-item">
                  <span>Penalty</span>
                  <strong>{handoff.consolidatedPenaltyEtb?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'} ETB</strong>
                </div>
                <div className="amount-item">
                  <span>Interest</span>
                  <strong>{handoff.consolidatedInterestEtb?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'} ETB</strong>
                </div>
                <div className="amount-item total">
                  <span>Total</span>
                  <strong>{handoff.totalAdjustmentEtb?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'} ETB</strong>
                </div>
              </div>

              {handoff.keyFindings && (
                <div className="findings-section">
                  <strong>Key Findings:</strong>
                  <p>{handoff.keyFindings}</p>
                </div>
              )}

              {handoff.importStatus && (
                <div className="import-status">
                  <span>Import Status: <strong>{handoff.importStatus}</strong></span>
                  {handoff.importedAt && (
                    <span>Imported: {new Date(handoff.importedAt).toLocaleDateString()}</span>
                  )}
                </div>
              )}
            </div>

            <div className="card-footer">
              {handoff.status === 'PENDING' && (
                <>
                  <button
                    className="btn-confirm"
                    onClick={() => {
                      setSelectedHandoff(handoff);
                      setShowConfirm(true);
                    }}
                  >
                    Confirm & Transfer
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancelHandoff(handoff.id)}
                  >
                    Cancel
                  </button>
                </>
              )}
              {handoff.status === 'IMPORTED' && (
                <div className="success-message">
                  ✓ Successfully transferred to Execution cluster
                </div>
              )}
              {handoff.status === 'FAILED' && (
                <div className="error-message">
                  Transfer failed. Please retry or contact support.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showConfirm && selectedHandoff && (
        <HandoffConfirmationModal
          handoff={selectedHandoff}
          onConfirm={() => handleConfirmHandoff(selectedHandoff.id)}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedHandoff(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default HandoffTransferPanel;
