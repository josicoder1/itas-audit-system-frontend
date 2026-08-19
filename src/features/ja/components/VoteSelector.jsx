import React, { useState } from 'react';
import './VoteSelector.css';

export default function VoteSelector({ voteId, onVoteCast }) {
  const [voteChoice, setVoteChoice] = useState('');
  const [rationale, setRationale] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!voteChoice) {
      setError('Please select a vote choice');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const memberId = localStorage.getItem('userId') || 'unknown';
      const memberName = localStorage.getItem('userName') || 'Unknown Member';
      const memberJurisdiction = localStorage.getItem('userJurisdiction') || '';

      const response = await fetch(`/api/v1/ja/votes/${voteId}/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId,
          memberName,
          memberJurisdiction,
          voteChoice,
          rationale: rationale || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cast vote');
      }

      const updatedVote = await response.json();
      onVoteCast(updatedVote);

      // Reset form
      setVoteChoice('');
      setRationale('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vote-selector">
      <h4>Cast Your Vote</h4>
      <form onSubmit={handleSubmit}>
        <div className="vote-options">
          <label className="vote-option">
            <input
              type="radio"
              name="voteChoice"
              value="APPROVE"
              checked={voteChoice === 'APPROVE'}
              onChange={(e) => setVoteChoice(e.target.value)}
              disabled={loading}
            />
            <span className="option-label approve">✓ Approve</span>
          </label>

          <label className="vote-option">
            <input
              type="radio"
              name="voteChoice"
              value="REJECT"
              checked={voteChoice === 'REJECT'}
              onChange={(e) => setVoteChoice(e.target.value)}
              disabled={loading}
            />
            <span className="option-label reject">✗ Reject</span>
          </label>

          <label className="vote-option">
            <input
              type="radio"
              name="voteChoice"
              value="ABSTAIN"
              checked={voteChoice === 'ABSTAIN'}
              onChange={(e) => setVoteChoice(e.target.value)}
              disabled={loading}
            />
            <span className="option-label abstain">~ Abstain</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="rationale">Rationale (optional)</label>
          <textarea
            id="rationale"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Provide your reasoning (visible to other members)"
            className="textarea-field"
            rows="4"
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading || !voteChoice}>
          {loading ? 'Submitting...' : 'Submit Vote'}
        </button>
      </form>
    </div>
  );
}
