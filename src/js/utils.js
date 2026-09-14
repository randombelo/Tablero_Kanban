// --- Filtrado: por estado (renderBoard) ---
export function filterTasksByStatus(tasks, status) {
  return tasks.filter((t) => t.status === status);
}

// --- Filtrado: comentarios de una tarea (contador, loadComments, borrado) ---
export function filterCommentsByTask(comments, taskId) {
  return comments.filter((c) => String(c.taskId) === String(taskId));
}
// --- Validación: nueva tarea (submit del modal) ---
export function validateNewTask(task = {}) {
  const title = String(task.title ?? '').trim();
  const errors = [];
  if (!title) errors.push('El título es obligatorio');
  return { isValid: errors.length === 0, errors, task: { ...task, title } };
}