// Utility-Funktionen gemäß Spezifikation

/**
 * Berechnet die Priorität einer Aufgabe
 * Formel: priorityScore = min(100, round(urgencyScore + difficultyScore))
 * urgencyScore = 50 / daysLeft
 * difficultyScore = difficulty * 10
 */
export function calculatePriority(task) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const daysLeft = Math.max(1, diffDays);
  
  const urgencyScore = 50 / daysLeft;
  const difficultyScore = task.difficulty * 10;
  
  const priorityScore = Math.min(100, Math.round(urgencyScore + difficultyScore));
  
  return priorityScore;
}

/**
 * Prüft ob eine Aufgabe überfällig ist
 */
export function isOverdue(task) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  return dueDate < today && task.status !== 'done';
}

/**
 * Prüft ob eine Aufgabe heute fällig ist
 */
export function isDueToday(task) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  return dueDate.getTime() === today.getTime();
}

/**
 * Sortiert Aufgaben nach Priorität und Fälligkeit
 */
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const priorityA = calculatePriority(a);
    const priorityB = calculatePriority(b);
    
    // Erst nach Priorität (absteigend)
    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }
    
    // Dann nach Fälligkeitsdatum (aufsteigend)
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
}

/**
 * Formatiert ein Datum für die Anzeige
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatiert Zeit in Stunden und Minuten
 */
export function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}min`;
  }
}

/**
 * Berechnet Statistiken
 */
export function calculateStats(tasks) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const open = tasks.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const overdue = tasks.filter(t => isOverdue(t)).length;
  
  const percentDone = total > 0 ? Math.round((done / total) * 100) : 0;
  
  return {
    total,
    done,
    open,
    overdue,
    percentDone
  };
}

/**
 * Berechnet Statistiken pro Fach
 */
export function calculateSubjectStats(tasks, subjectId) {
  const subjectTasks = tasks.filter(t => t.subjectId === subjectId);
  
  const done = subjectTasks.filter(t => t.status === 'done').length;
  const open = subjectTasks.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  
  const totalTime = subjectTasks.reduce((sum, t) => sum + (t.estimatedTimeMinutes || 0), 0);
  
  return {
    done,
    open,
    totalTime
  };
}
