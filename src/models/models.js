// Datenmodelle gemäß Spezifikation

export class Subject {
  constructor(name, color) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.color = color;
    this.createdAt = new Date().toISOString();
  }
}

export class Task {
  constructor(subjectId, title, description, type, difficulty, dueDate, estimatedTimeMinutes) {
    this.id = crypto.randomUUID();
    this.subjectId = subjectId;
    this.title = title;
    this.description = description;
    this.type = type; // 'homework' | 'exam' | 'project'
    this.difficulty = difficulty; // 1-5
    this.dueDate = dueDate;
    this.estimatedTimeMinutes = estimatedTimeMinutes;
    this.status = 'open'; // 'open' | 'in_progress' | 'done'
    this.createdAt = new Date().toISOString();
    this.completedAt = null;
  }
}

export const TaskTypes = {
  HOMEWORK: 'homework',
  EXAM: 'exam',
  PROJECT: 'project'
};

export const TaskStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};
