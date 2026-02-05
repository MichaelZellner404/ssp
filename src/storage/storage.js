// LocalStorage Manager für Persistenz

const STORAGE_KEYS = {
  SUBJECTS: 'study_planner_subjects',
  TASKS: 'study_planner_tasks'
};

export const Storage = {
  // Subjects
  getSubjects() {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return data ? JSON.parse(data) : [];
  },

  saveSubjects(subjects) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  addSubject(subject) {
    const subjects = this.getSubjects();
    subjects.push(subject);
    this.saveSubjects(subjects);
    return subject;
  },

  updateSubject(id, updates) {
    const subjects = this.getSubjects();
    const index = subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      subjects[index] = { ...subjects[index], ...updates };
      this.saveSubjects(subjects);
      return subjects[index];
    }
    return null;
  },

  deleteSubject(id) {
    const subjects = this.getSubjects();
    const filtered = subjects.filter(s => s.id !== id);
    this.saveSubjects(filtered);
    
    // Lösche auch alle Aufgaben des Fachs
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.subjectId !== id);
    this.saveTasks(filteredTasks);
  },

  // Tasks
  getTasks() {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  addTask(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
    return task;
  },

  updateTask(id, updates) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      
      // Setze completedAt wenn Status auf 'done' gesetzt wird
      if (updates.status === 'done' && !tasks[index].completedAt) {
        tasks[index].completedAt = new Date().toISOString();
      }
      
      this.saveTasks(tasks);
      return tasks[index];
    }
    return null;
  },

  deleteTask(id) {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    this.saveTasks(filtered);
  }
};
