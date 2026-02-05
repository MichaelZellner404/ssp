import React, { useState, useMemo } from 'react';
import { Task, TaskTypes, TaskStatus } from '../models/models';
import { calculatePriority, sortTasks, formatDate, isOverdue, isDueToday } from '../utils/helpers';

export default function TaskManager({ tasks, subjects, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Formularfelder
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(TaskTypes.HOMEWORK);
  const [difficulty, setDifficulty] = useState(3);
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(60);

  // Filter
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('open');

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Status-Filter
    if (filterStatus === 'open') {
      filtered = filtered.filter(t => t.status === 'open' || t.status === 'in_progress');
    } else if (filterStatus === 'done') {
      filtered = filtered.filter(t => t.status === 'done');
    } else if (filterStatus === 'today') {
      filtered = filtered.filter(t => isDueToday(t) && t.status !== 'done');
    } else if (filterStatus === 'overdue') {
      filtered = filtered.filter(t => isOverdue(t));
    }

    // Fach-Filter
    if (filterSubject !== 'all') {
      filtered = filtered.filter(t => t.subjectId === filterSubject);
    }

    // Typ-Filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    return sortTasks(filtered);
  }, [tasks, filterSubject, filterType, filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTask) {
      onUpdate(editingTask.id, {
        subjectId,
        title,
        description,
        type,
        difficulty,
        dueDate,
        estimatedTimeMinutes: estimatedTime
      });
    } else {
      const newTask = new Task(
        subjectId,
        title,
        description,
        type,
        difficulty,
        dueDate,
        estimatedTime
      );
      onAdd(newTask);
    }
    
    closeModal();
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setSubjectId(task.subjectId);
      setTitle(task.title);
      setDescription(task.description);
      setType(task.type);
      setDifficulty(task.difficulty);
      setDueDate(task.dueDate);
      setEstimatedTime(task.estimatedTimeMinutes);
    } else {
      setEditingTask(null);
      setSubjectId(subjects[0]?.id || '');
      setTitle('');
      setDescription('');
      setType(TaskTypes.HOMEWORK);
      setDifficulty(3);
      setDueDate('');
      setEstimatedTime(60);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const getSubjectName = (subjectId) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unbekannt';
  };

  const getSubjectColor = (subjectId) => {
    return subjects.find(s => s.id === subjectId)?.color || '#999';
  };

  const getTypeLabel = (type) => {
    const labels = {
      homework: '📝 Hausaufgabe',
      exam: '📋 Prüfung',
      project: '🎯 Projekt'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (task) => {
    if (task.status === 'done') {
      return <span style={{ background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>✓ Erledigt</span>;
    }
    if (isOverdue(task)) {
      return <span style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>⚠ Überfällig</span>;
    }
    if (isDueToday(task)) {
      return <span style={{ background: '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>🔥 Heute</span>;
    }
    if (task.status === 'in_progress') {
      return <span style={{ background: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>⏳ In Arbeit</span>;
    }
    return <span style={{ background: '#6b7280', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>○ Offen</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ color: '#667eea', fontSize: '1.8rem' }}>✅ Aufgaben & Prüfungen</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => openModal()}
          disabled={subjects.length === 0}
        >
          + Neue Aufgabe
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>Erst Fächer erstellen</h3>
          <p>Bevor du Aufgaben anlegen kannst, musst du mindestens ein Fach erstellen.</p>
        </div>
      ) : (
        <>
          <div className="filters">
            <select 
              className="filter-button" 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '8px 16px' }}
            >
              <option value="all">Alle Aufgaben</option>
              <option value="open">Offen</option>
              <option value="done">Erledigt</option>
              <option value="today">Heute fällig</option>
              <option value="overdue">Überfällig</option>
            </select>

            <select 
              className="filter-button" 
              value={filterSubject} 
              onChange={e => setFilterSubject(e.target.value)}
              style={{ padding: '8px 16px' }}
            >
              <option value="all">Alle Fächer</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>

            <select 
              className="filter-button" 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
              style={{ padding: '8px 16px' }}
            >
              <option value="all">Alle Typen</option>
              <option value="homework">Hausaufgaben</option>
              <option value="exam">Prüfungen</option>
              <option value="project">Projekte</option>
            </select>
          </div>

          {filteredAndSortedTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <h3>Keine Aufgaben gefunden</h3>
              <p>Erstelle eine neue Aufgabe oder ändere die Filter.</p>
            </div>
          ) : (
            <div>
              {filteredAndSortedTasks.map(task => {
                const priority = calculatePriority(task);
                const subjectColor = getSubjectColor(task.subjectId);
                
                return (
                  <div 
                    key={task.id} 
                    className="card" 
                    style={{ 
                      borderLeft: `6px solid ${subjectColor}`,
                      opacity: task.status === 'done' ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '1.3rem', color: '#333' }}>{task.title}</h3>
                          {getStatusBadge(task)}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.9rem', color: '#666' }}>
                          <span style={{ color: subjectColor, fontWeight: '600' }}>
                            {getSubjectName(task.subjectId)}
                          </span>
                          <span>{getTypeLabel(task.type)}</span>
                          <span>📅 {formatDate(task.dueDate)}</span>
                          <span>⏱ {task.estimatedTimeMinutes} Min.</span>
                          <span>{'⭐'.repeat(task.difficulty)}</span>
                        </div>
                      </div>
                      <div style={{ 
                        background: priority >= 70 ? '#ef4444' : priority >= 50 ? '#f59e0b' : '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '1.2rem'
                      }}>
                        {priority}
                      </div>
                    </div>

                    {task.description && (
                      <p style={{ color: '#666', marginBottom: '16px', fontSize: '0.95rem' }}>
                        {task.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {task.status !== 'done' && (
                        <>
                          <button 
                            className="btn btn-success" 
                            style={{ padding: '8px 16px' }}
                            onClick={() => onUpdate(task.id, { status: TaskStatus.DONE })}
                          >
                            ✓ Erledigt
                          </button>
                          {task.status === 'open' && (
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '8px 16px' }}
                              onClick={() => onUpdate(task.id, { status: TaskStatus.IN_PROGRESS })}
                            >
                              ⏳ In Arbeit
                            </button>
                          )}
                        </>
                      )}
                      {task.status === 'done' && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '8px 16px' }}
                          onClick={() => onUpdate(task.id, { status: TaskStatus.OPEN, completedAt: null })}
                        >
                          ↺ Wieder öffnen
                        </button>
                      )}
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '8px 16px' }}
                        onClick={() => openModal(task)}
                      >
                        ✏ Bearbeiten
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '8px 16px' }}
                        onClick={() => {
                          if (window.confirm('Aufgabe wirklich löschen?')) {
                            onDelete(task.id);
                          }
                        }}
                      >
                        🗑 Löschen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingTask ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Fach *</label>
                <select value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Titel *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="z.B. Hausaufgabe Seite 42-45"
                  required
                />
              </div>

              <div className="form-group">
                <label>Beschreibung</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Zusätzliche Details..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Typ *</label>
                  <select value={type} onChange={e => setType(e.target.value)} required>
                    <option value="homework">Hausaufgabe</option>
                    <option value="exam">Prüfung</option>
                    <option value="project">Projekt</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Schwierigkeit (1-5) *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={difficulty}
                    onChange={e => setDifficulty(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Fälligkeitsdatum *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Geschätzte Zeit (Min.) *</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={estimatedTime}
                    onChange={e => setEstimatedTime(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
