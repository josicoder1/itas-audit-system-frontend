import React, { useState, useEffect } from 'react';
import './VoteTally.css';

export default function VoteTally({ voteId, vote, onVoteClosed }) {
  const [tally, setTally] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (vote && vote.tally) {
      setTally(vote.tally);
    }
  }, [vote]);

  const handleCloseVoting = async () => {
    if (!window.confirm('Are you sure you want to close voting? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/ja/votes/${voteId}/close`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to close voting');

      const closedVote = await response.json();
      onVoteClosed(closedVote);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!tally) return <div className="vote-tally">Loading vote tally...</div>;

  const isChairperson = localStorage.getItem('userRole') === 'CHAIRPERSON';
  const allVoted = tally.pendingCount === 0;

  return (
    <div className="vote-tally">
      <h4>Voting Summary</h4>

      <div className="tally-summary">
        <div className="tally-item">
          <div className="tally-label">Total Votes Cast</div>
          <div className="tally-value">{tally.totalVotes} / {vote.totalMembers}</div>
          <div className="tally-bar">
            <div
              className="tally-bar-fill"
              style={{ width: `${(tally.totalVotes / vote.totalMembers) * 100}%` }}
            />
          </div>
        </div>

        <div className="vote-counts">
          <div className="count-card approve">
            <div className="count-label">Approve</div>
            <div className="count-value">{tally.approveCount}</div>
          </div>

          <div className="count-card reject">
            <div className="count-label">Reject</div>
            <div className="count-value">{tally.rejectCount}</div>
          </div>

          <div className="count-card abstain">
            <div className="count-label">Abstain</div>
            <div className="count-value">{tally.abstainCount}</div>
          </div>

          <div className="count-card pending">
            <div className="count-label">Pending</div>
            <div className="count-value">{tally.pendingCount}</div>
          </div>
        </div>
      </div>

      {tally.consensusPct !== null && (
        <div className="consensus-display">
          <div className="consensus-label">Consensus Level</div>
          <div className="consensus-bar">
            <div
              className="consensus-bar-fill"
              style={{
                width: `${Math.min(tally.consensusPct, 100)}%`,
                backgroundColor: tally.consensusPct >= 50 ? '#4caf50' : '#ff9800',
              }}
            />
          </div>
          <div className="consensus-value">{tally.consensusPct.toFixed(1)}% Approval</div>
        </div>
      )}

      {vote.status === 'OPEN' && isChairperson && allVoted && (
        <button
          className="btn btn-primary btn-close-voting"
          onClick={handleCloseVoting}
          disabled={loading}
        >
          {loading ? 'Closing...' : 'Close Voting'}
        </button>
      )}

      {vote.status === 'CLOSED' && (
        <div className="voting-result">
          <strong>Result: </strong>
          <span className={`result-badge ${vote.result.toLowerCase()}`}>
            {vote.result}
          </span>
          {vote.finalizedAt && (
            <div className="finalized-date">
              Finalized: {new Date(vote.finalizedAt).toLocaleString()}
            </div>
          )}
        </div>
      )}

      <button
        className="btn-link show-details"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide' : 'Show'} Voting Details
      </button>

      {showDetails && vote.voteRecords && vote.voteRecords.length > 0 && (
        <div className="voting-details">
          <h5>Member Votes</h5>
          <div className="details-list">
            {vote.voteRecords.map((record) => (
              <div key={record.id} className={`detail-item ${record.voteChoice.toLowerCase()}`}>
                <div className="member-info">
                  <strong>{record.memberName}</strong>
                  {record.memberJurisdiction && (
                    <span className="jurisdiction">({record.memberJurisdiction})</span>
                  )}
                </div>
                <div className="vote-info">
                  <span className={`vote-choice ${record.voteChoice.toLowerCase()}`}>
                    {record.voteChoice}
                  </span>
                  <span className="vote-time">
                    {new Date(record.votedAt).toLocaleTimeString()}
                  </span>
                </div>
                {record.rationale && (
                  <div className="rationale">
                    <strong>Rationale:</strong> {record.rationale}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
