import React, { useState } from 'react';
import CommentThread from './CommentThread';
import './NoteCard.css';

export default function NoteCard({ note, onNoteUpdated, onNoteDeleted }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [saving, setSaving] = useState(false);

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/v1/ja/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) throw new Error('Failed to save note');
      
      const updated = await response.json();
      onNoteUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    try {
      const response = await fetch(`/api/v1/ja/notes/${note.id}/archive`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to archive note');
      
      const updated = await response.json();
      onNoteUpdated(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`/api/v1/ja/notes/${note.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete note');
        onNoteDeleted(note.id);
      } catch (err) {
        console.error(err);
      }
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
    <div className={`note-card ${note.archived ? 'archived' : ''}`}>
      <div className="note-header">
        <div className="note-meta">
          <span className="author-info">
            <strong>{note.authorName}</strong>
            {note.authorTitle && <span className="title"> ({note.authorTitle})</span>}
          </span>
          {note.topic && <span className="topic-badge">{note.topic}</span>}
          <span className="timestamp">{formatDate(note.createdAt)}</span>
        </div>
        <div className="note-actions">
          <button
            className="btn-icon"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▼' : '▶'}
          </button>
          {!note.archived && (
            <>
              <button
                className="btn-icon"
                onClick={() => setIsEditing(!isEditing)}
                title="Edit"
              >
                ✎
              </button>
              <button
                className="btn-icon"
                onClick={handleArchive}
                title="Archive"
              >
                ⊡
              </button>
              <button
                className="btn-icon danger"
                onClick={handleDelete}
                title="Delete"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`note-content ${expanded ? 'expanded' : 'collapsed'}`}>
        {isEditing ? (
          <div className="edit-mode">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="textarea-field"
              rows="6"
            />
            <div className="edit-actions">
              <button
                className="btn btn-primary"
                onClick={handleSaveEdit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(note.content);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="note-text">
            {note.content}
          </div>
        )}
      </div>

      {note.attachments && note.attachments.length > 0 && (
        <div className="attachments">
          <strong>Attachments:</strong>
          <ul>
            {note.attachments.map((att) => (
              <li key={att.id}>
                <a href={att.fileUrl} target="_blank" rel="noopener noreferrer">
                  {att.fileName}
                </a>
                {att.category && <span className="category-badge">{att.category}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="note-footer">
        <button
          className="btn-link"
          onClick={() => setShowComments(!showComments)}
        >
          {note.comments.length} comment{note.comments.length !== 1 ? 's' : ''}
        </button>
      </div>

      {showComments && (
        <CommentThread
          noteId={note.id}
          comments={note.comments}
          onCommentAdded={(updatedNote) => onNoteUpdated(updatedNote)}
        />
      )}
    </div>
  );
}
