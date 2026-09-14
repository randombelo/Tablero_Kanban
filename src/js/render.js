import { state } from './state.js';
import { filterTasksByStatus,filterCommentsByTask } from './utils.js';

//hace mas legible la fecha
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}`;
}
//funcion que previene inyeccion de codigo 
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
//refleja la tarjeta en el DOM
export function renderCard(task,commentCount = 0) {
  const done = task.status === 'done';
  const priorityLabel = { alta: 'Alta', media: 'Media', baja: 'Baja' };
  const article = document.createElement('article');
  article.className = `card${done ? ' is-done' : ''}`;
  article.dataset.id = task.id;
  article.innerHTML = `
    <p class="card-title clickable">${escapeHTML(task.title)}</p>
    <p class="card-desc">${escapeHTML(task.description)}</p>
    <footer class="card-meta">
      <span class="badge priority-${task.priority}">${priorityLabel[task.priority]}</span>
      <time datetime="${escapeHTML(task.dueDate)}">${formatDate(task.dueDate)}</time>
       <span class="comment-count" title="Comentarios">💬 ${commentCount}</span>
    </footer>`;
  return article;
}
//funcion que actualiza los contadores de las estadisticas y de las columnas 
export function updateCounts(tasks) {
  const counts = { todo: 0, doing: 0, done: 0 };
  tasks.forEach(t => counts[t.status]++);
  document.querySelectorAll('.column').forEach(col => {
    const s = col.dataset.status;
    col.querySelector('.count').textContent = counts[s];
  });
  document.querySelector('[data-count="todo"]').textContent = counts.todo;
  document.querySelector('[data-count="doing"]').textContent = counts.doing;
  document.querySelector('[data-count="done"]').textContent = counts.done;
  document.querySelector('[data-count="total"]').textContent = tasks.length;
}
//Refresca los contadores
export function refreshCounts() {
  let total = 0;
  document.querySelectorAll('.column').forEach(col => {
    const status = col.dataset.status;
    const count = col.querySelector('.card-list').children.length;
    total += count;
    col.querySelector('.count').textContent = count;                    // contador de columna
    document.querySelector(`[data-count="${status}"]`).textContent = count;  // contador de stats
  });
  document.querySelector('[data-count="total"]').textContent = total;
}
//funcion que inserta en el modal de detalle algun comentario asociado a la tarea
export function renderComment(comment) {
  const article = document.createElement('article');
  article.className = 'comment';
  article.dataset.id = comment.id;
  article.innerHTML = `
    <div class="comment-head">
      <p class="comment-author">${escapeHTML(comment.author)}</p>
      <button type="button" class="comment-delete-btn" data-id="${comment.id}" aria-label="Eliminar comentario">🗑</button>
    </div>
    <p class="comment-text">${escapeHTML(comment.text)}</p>`;
  return article;
}
//Funcion que carga el tablero
export function renderBoard(tasks) {
  document.querySelectorAll('.column').forEach(col => {
    const status = col.dataset.status;
    const list = col.querySelector('.card-list');
    list.innerHTML = '';
    filterTasksByStatus(tasks, status)
      .forEach((t) => {
        const count =filterCommentsByTask(state.comments, t.id).length
        list.appendChild(renderCard(t, count));
      });
  });
  updateCounts(tasks);
}
//funcion que carga todos los comentarios en el modal de detalle 
export function loadComments(taskId) {
  const list = document.getElementById('comment-list');
  list.innerHTML = '';
  filterCommentsByTask(state.comments, taskId)
    .forEach(c => list.appendChild(renderComment(c)));
}
//funcion que actualiza el contador de los comentarios en la tarjeta.
export function updateCardCommentCount() {
  if (!state.currentTaskId) return;
  const count = filterCommentsByTask(state.comments, state.currentTaskId).length;
  const span = document.querySelector(`.card[data-id="${state.currentTaskId}"] .comment-count`);
  if (span) span.textContent = `💬 ${count}`;
}