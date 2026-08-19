import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from './NoteEditor';
import NoteCard from './NoteCard';
import './ResearchWorkspace.css';

export default function ResearchWorkspace() {
  const { committeeId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [showNewNote, setShowNewNote] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [committeeId, selectedTopic]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const url = selectedTopic
        ? `/api/v1/ja/committees/${committeeId}/notes?topic=${encodeURIComponent(selectedTopic)}`
        : `/api/v1/ja/committees/${committeeId}/notes`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch notes');
      
      const data = await response.json();
      setNotes(data);
      
      // Extract unique topics
      const uniqueTopics = [...new Set(data.map(n => n.topic).filter(Boolean))];
      setTopics(uniqueTopics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteCreated = (newNote) => {
    setNotes([newNote, ...notes]);
    setShowNewNote(false);
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleNoteDeleted = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  return (
    <div className="research-workspace">
      <div className="workspace-header">
        <h2>Research Workspace</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewNote(!showNewNote)}
        >
          {showNewNote ? 'Cancel' : 'New Note'}
        </button>
      </div>

      {showNewNote && (
        <div className="new-note-section">
          <NoteEditor 
            committeeId={committeeId}
            onNoteCreated={handleNoteCreated}
            onCancel={() => setShowNewNote(false)}
          />
        </div>
      )}

      <div className="topic-filters">
        <div className="filter-group">
          <label>Filter by Topic:</label>
          <select 
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="topic-select"
          >
            <option value="">All Topics</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <div className="notes-count">
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <p>No research notes yet.</p>
          <p>Click "New Note" to start collaborating!</p>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onNoteUpdated={handleNoteUpdated}
              onNoteDeleted={handleNoteDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
