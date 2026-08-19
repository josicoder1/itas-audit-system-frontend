import React, { useState } from 'react';
import './NoteEditor.css';

export default function NoteEditor({ committeeId, onNoteCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current user info from session/context
      const authorId = localStorage.getItem('userId') || 'unknown';
      const authorName = localStorage.getItem('userName') || 'Unknown User';
      const authorTitle = localStorage.getItem('userTitle') || '';

      const response = await fetch(`/api/v1/ja/committees/${committeeId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId,
          authorName,
          authorTitle,
          content: title ? `${title}\n\n${content}` : content,
          topic: topic || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const newNote = await response.json();
      onNoteCreated(newNote);
      
      // Reset form
      setTitle('');
      setContent('');
      setTopic('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-editor">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">Topic (optional)</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Findings, Evidence, Questions"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title (optional)</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your research findings, questions, or observations..."
            className="textarea-field"
            rows="8"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Note'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
