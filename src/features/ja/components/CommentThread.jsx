import React, { useState } from 'react';
import './CommentThread.css';

export default function CommentThread({ noteId, comments, onCommentAdded }) {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current user info from session/context
      const authorId = localStorage.getItem('userId') || 'unknown';
      const authorName = localStorage.getItem('userName') || 'Unknown User';

      const response = await fetch(`/api/v1/ja/notes/${noteId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId,
          authorName,
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const updatedNote = await response.json();
      onCommentAdded(updatedNote);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="comment-thread">
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <strong>{comment.authorName}</strong>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
            <div className="comment-text">
              {comment.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddComment} className="add-comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          className="textarea-field"
          rows="3"
        />
        {error && <div className="error-message">{error}</div>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
}
