import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VoteSelector from './VoteSelector';
import VoteTally from './VoteTally';
import './VotingWorkspace.css';

export default function VotingWorkspace() {
  const { committeeId } = useParams();
  const [openVote, setOpenVote] = useState(null);
  const [allVotes, setAllVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userVoted, setUserVoted] = useState(false);

  useEffect(() => {
    fetchVotes();
  }, [committeeId]);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/ja/committees/${committeeId}/votes`);
      if (!response.ok) throw new Error('Failed to fetch votes');
      
      const data = await response.json();
      setAllVotes(data);
      
      // Find open vote
      const open = data.find(v => v.status === 'OPEN');
      if (open) {
        setOpenVote(open);
        
        // Check if current user already voted
        const currentUserId = localStorage.getItem('userId') || 'unknown';
        const hasVoted = open.voteRecords.some(r => r.memberId === currentUserId);
        setUserVoted(hasVoted);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteCast = (updatedVote) => {
    setOpenVote(updatedVote);
    setUserVoted(true);
    setAllVotes(allVotes.map(v => v.id === updatedVote.id ? updatedVote : v));
  };

  const handleVoteClosed = (closedVote) => {
    setOpenVote(null);
    setAllVotes(allVotes.map(v => v.id === closedVote.id ? closedVote : v));
  };

  if (loading) {
    return <div className="voting-workspace"><div className="loading">Loading voting data...</div></div>;
  }

  return (
    <div className="voting-workspace">
      <div className="workspace-header">
        <h2>Committee Voting Workspace</h2>
        <button className="btn btn-info" onClick={fetchVotes}>
          Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {openVote ? (
        <div className="active-voting-section">
          <div className="section-title">
            <h3>Active Voting Round</h3>
            {userVoted && <span className="badge badge-success">You Voted</span>}
          </div>
          
          <div className="voting-card">
            <div className="vote-header">
              <h4>{openVote.votingTopic}</h4>
              <span className="round-badge">Round {openVote.votingRound}</span>
            </div>

            {openVote.description && (
              <div className="vote-description">
                <strong>Description:</strong> {openVote.description}
              </div>
            )}

            <div className="voting-content">
              <div className="vote-selector-section">
                {!userVoted && (
                  <VoteSelector 
                    voteId={openVote.id}
                    onVoteCast={handleVoteCast}
                  />
                )}
                {userVoted && (
                  <div className="vote-confirmed">
                    <div className="checkmark">✓</div>
                    <p>Your vote has been recorded.</p>
                  </div>
                )}
              </div>

              <div className="vote-tally-section">
                <VoteTally 
                  voteId={openVote.id}
                  vote={openVote}
                  onVoteClosed={handleVoteClosed}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-active-voting">
          <p>No active voting round at this time.</p>
        </div>
      )}

      {allVotes.length > 0 && (
        <div className="voting-history-section">
          <h3>Voting History</h3>
          <div className="votes-list">
            {allVotes.map(vote => (
              <div key={vote.id} className={`vote-item ${vote.status.toLowerCase()}`}>
                <div className="vote-info">
                  <strong>Round {vote.votingRound}: {vote.votingTopic}</strong>
                  <span className={`status-badge ${vote.status.toLowerCase()}`}>
                    {vote.status}
                  </span>
                  {vote.status !== 'OPEN' && (
                    <span className={`result-badge ${vote.result.toLowerCase()}`}>
                      {vote.result}
                    </span>
                  )}
                </div>
                <div className="vote-summary">
                  <span>{vote.voteRecords.length} / {vote.totalMembers} voted</span>
                  {vote.tally && (
                    <span className="consensus">
                      {vote.tally.consensusPct ? vote.tally.consensusPct.toFixed(0) : 0}% approval
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
