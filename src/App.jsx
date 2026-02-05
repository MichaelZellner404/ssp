import React, { useState, useEffect } from 'react';
import './App.css';
import { Storage } from './storage/storage';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/SubjectManager';
import TaskManager from './components/TaskManager';

function App() {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    setSubjects(Storage.getSubjects());
    setTasks(Storage.getTasks());
  }, []);

  // Subject-Funktionen
  const addSubject = (subject) => {
    Storage.addSubject(subject);
    setSubjects(Storage.getSubjects());
  };

  const updateSubject = (id, updates) => {
    Storage.updateSubject(id, updates);
    setSubjects(Storage.getSubjects());
  };

  const deleteSubject = (id) => {
    Storage.deleteSubject(id);
    setSubjects(Storage.getSubjects());
    setTasks(Storage.getTasks());
  };

  // Task-Funktionen
  const addTask = (task) => {
    Storage.addTask(task);
    setTasks(Storage.getTasks());
  };

  const updateTask = (id, updates) => {
    Storage.updateTask(id, updates);
    setTasks(Storage.getTasks());
  };

  const deleteTask = (id) => {
    Storage.deleteTask(id);
    setTasks(Storage.getTasks());
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Smart Study Planner</h1>
        <p>Dein intelligenter Lern- und Aufgabenplaner</p>
        
        <nav className="nav">
          <button 
            className={currentView === 'dashboard' ? 'active' : ''} 
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={currentView === 'tasks' ? 'active' : ''} 
            onClick={() => setCurrentView('tasks')}
          >
            ✅ Aufgaben
          </button>
          <button 
            className={currentView === 'subjects' ? 'active' : ''} 
            onClick={() => setCurrentView('subjects')}
          >
            📚 Fächer
          </button>
        </nav>
      </header>

      <main className="content">
        {currentView === 'dashboard' && (
          <Dashboard tasks={tasks} subjects={subjects} />
        )}
        
        {currentView === 'tasks' && (
          <TaskManager 
            tasks={tasks} 
            subjects={subjects}
            onAdd={addTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
        
        {currentView === 'subjects' && (
          <SubjectManager 
            subjects={subjects}
            onAdd={addSubject}
            onUpdate={updateSubject}
            onDelete={deleteSubject}
          />
        )}
      </main>

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        color: 'white',
        opacity: 0.9,
        fontSize: '0.9rem'
      }}>
        <p>Smart Study Planner © 2026 | Offline-first | Daten werden lokal gespeichert</p>
      </footer>
    </div>
  );
}

export default App;
