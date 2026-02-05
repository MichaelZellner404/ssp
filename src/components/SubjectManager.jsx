import React, { useState } from 'react';
import { Subject } from '../models/models';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
];

export default function SubjectManager({ subjects, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSubject) {
      onUpdate(editingSubject.id, { name, color });
    } else {
      const newSubject = new Subject(name, color);
      onAdd(newSubject);
    }
    
    closeModal();
  };

  const openModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setName(subject.name);
      setColor(subject.color);
    } else {
      setEditingSubject(null);
      setName('');
      setColor(PRESET_COLORS[0]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setName('');
    setColor(PRESET_COLORS[0]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Fach und alle zugehörigen Aufgaben wirklich löschen?')) {
      onDelete(id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#667eea', fontSize: '1.8rem' }}>📚 Fächer verwalten</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Neues Fach
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>Noch keine Fächer vorhanden</h3>
          <p>Erstelle dein erstes Fach, um zu starten!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {subjects.map(subject => (
            <div key={subject.id} className="card" style={{ borderLeft: `6px solid ${subject.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <h3 style={{ color: subject.color, fontSize: '1.3rem' }}>{subject.name}</h3>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: subject.color }}></div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '8px' }}
                  onClick={() => openModal(subject)}
                >
                  Bearbeiten
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ flex: 1, padding: '8px' }}
                  onClick={() => handleDelete(subject.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingSubject ? 'Fach bearbeiten' : 'Neues Fach'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Fachname *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="z.B. Mathematik"
                  required
                />
              </div>

              <div className="form-group">
                <label>Farbe *</label>
                <div className="color-picker">
                  {PRESET_COLORS.map(presetColor => (
                    <div
                      key={presetColor}
                      className={`color-option ${color === presetColor ? 'selected' : ''}`}
                      style={{ background: presetColor }}
                      onClick={() => setColor(presetColor)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSubject ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
