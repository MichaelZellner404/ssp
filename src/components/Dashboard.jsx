import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateStats, calculateSubjectStats, formatTime } from '../utils/helpers';

const COLORS = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444'];

export default function Dashboard({ tasks, subjects }) {
  const stats = calculateStats(tasks);

  const subjectData = subjects.map((subject, index) => {
    const subjectStats = calculateSubjectStats(tasks, subject.id);
    return {
      name: subject.name,
      erledigt: subjectStats.done,
      offen: subjectStats.open,
      zeit: subjectStats.totalTime,
      color: subject.color
    };
  });

  const statusData = [
    { name: 'Erledigt', value: stats.done },
    { name: 'Offen', value: stats.open }
  ];

  const totalTime = tasks.reduce((sum, task) => sum + (task.estimatedTimeMinutes || 0), 0);
  const doneTime = tasks
    .filter(t => t.status === 'done')
    .reduce((sum, task) => sum + (task.estimatedTimeMinutes || 0), 0);
  const remainingTime = totalTime - doneTime;

  return (
    <div>
      <h2 style={{ color: '#667eea', fontSize: '1.8rem', marginBottom: '24px' }}>📊 Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.percentDone}%</h3>
          <p>Fortschritt</p>
        </div>
        <div className="stat-card">
          <h3>{stats.done}</h3>
          <p>Erledigt</p>
        </div>
        <div className="stat-card">
          <h3>{stats.open}</h3>
          <p>Offen</p>
        </div>
        <div className="stat-card" style={{ background: stats.overdue > 0 ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>{stats.overdue}</h3>
          <p>Überfällig</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>Noch keine Daten</h3>
          <p>Erstelle Aufgaben, um Statistiken zu sehen.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="card">
              <h3 style={{ marginBottom: '20px', color: '#667eea' }}>Status-Übersicht</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#667eea'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '20px', color: '#667eea' }}>Zeitaufwand</h3>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>Gesamt:</span>
                    <span style={{ color: '#667eea', fontWeight: '700' }}>{formatTime(totalTime)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>Erledigt:</span>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>{formatTime(doneTime)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600' }}>Verbleibend:</span>
                    <span style={{ color: '#f59e0b', fontWeight: '700' }}>{formatTime(remainingTime)}</span>
                  </div>
                </div>
                <div style={{ 
                  height: '20px', 
                  background: '#e5e7eb', 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${stats.percentDone}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {subjects.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '20px', color: '#667eea' }}>Aufgaben pro Fach</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="erledigt" fill="#10b981" name="Erledigt" />
                  <Bar dataKey="offen" fill="#667eea" name="Offen" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {subjects.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '20px', color: '#667eea' }}>Zeitaufwand pro Fach</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {subjectData.map((subject, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: '16px',
                      background: subject.color + '20',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${subject.color}`
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '8px', color: subject.color }}>
                      {subject.name}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>
                      {formatTime(subject.zeit)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                      {subject.erledigt + subject.offen} Aufgaben
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
