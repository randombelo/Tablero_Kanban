// --- Menú móvil ---
const navToggleBtn = document.getElementById('nav-toggle-btn');
const siteNav = document.querySelector('.site-nav');
let comments = [];            // todas las comments (fuente en memoria)
let currentCommentId = null; //current comment para eliminar
navToggleBtn.addEventListener('click', () => {
  siteNav.classList.toggle('is-open');
});
// --- Modal: nueva tarea ---
const openNewTaskBtn = document.getElementById('open-new-task');
const newTaskOverlay = document.querySelector('.overlay-new-task');
const closeNewTaskBtn = document.getElementById('close-new-task');
const cancelNewTaskBtn = document.getElementById('cancel-new-task');

function openNewTaskModal() {
  newTaskOverlay.classList.add('is-open');
}

function closeNewTaskModal() {
  newTaskOverlay.classList.remove('is-open');
}

openNewTaskBtn.addEventListener('click', openNewTaskModal);
closeNewTaskBtn.addEventListener('click', closeNewTaskModal);
cancelNewTaskBtn.addEventListener('click', closeNewTaskModal);

// Cerrar al hacer clic fuera del modal (en el overlay)
newTaskOverlay.addEventListener('click', (e) => {
  if (e.target === newTaskOverlay) {
    closeNewTaskModal();
  }
});
// --- Modal: detalle / edición de tarjeta ---
const detailOverlay = document.querySelector('.overlay-detail');
const closeDetailBtn = document.getElementById('close-detail');
const cancelDetailBtn = document.getElementById('cancel-detail');
const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-desc');

function openDetailModal(title, description) {
  detailTitle.value = title;
  detailDesc.value = description;
  detailOverlay.classList.add('is-open');
}

function closeDetailModal() {
  detailOverlay.classList.remove('is-open');
}

closeDetailBtn.addEventListener('click', closeDetailModal);
cancelDetailBtn.addEventListener('click', closeDetailModal);

detailOverlay.addEventListener('click', (e) => {
  if (e.target === detailOverlay) {
    closeDetailModal();
  }
});
// --- Modal: confirmar eliminación ---
const deleteTaskBtn = document.getElementById('delete-task-btn');
const deleteOverlay = document.querySelector('.overlay-delete');
const closeDeleteBtn = document.getElementById('close-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const deleteTaskTitle = document.getElementById('delete-task-title');

function openDeleteModal() {
  deleteTaskTitle.textContent = detailTitle.value;
  deleteOverlay.classList.add('is-open');
}

function closeDeleteModal() {
  deleteOverlay.classList.remove('is-open');
}

function cancelDeletion() {
  closeDeleteModal();
  openDetailModal(detailTitle.value, detailDesc.value);
}

deleteTaskBtn.addEventListener('click', () => {
  closeDetailModal();
  openDeleteModal();
});

cancelDeleteBtn.addEventListener('click', cancelDeletion);
closeDeleteBtn.addEventListener('click', cancelDeletion);
//listener para confirmar una eliminacion
confirmDeleteBtn.addEventListener('click', async () => {
  if (!currentTaskId) return;
  await axios.delete(`${API_BASE}/tasks/${currentTaskId}`);
  await Promise.all(
    comments
      .filter((c) => String(c.taskId) === String(currentTaskId))
      .map((c) => axios.delete(`${API_BASE}/comments/${c.id}`))
  );
  comments = comments.filter((c) => String(c.taskId) !== String(currentTaskId));
  closeDeleteModal();
  const card = document.querySelector(`.card[data-id="${currentTaskId}"]`);
  if (card) card.remove();
  currentTaskId = null;
  refreshCounts();
});
//listener del boton cancel deletion
deleteOverlay.addEventListener('click', (e) => {
  if (e.target === deleteOverlay) {
    cancelDeletion();
  }
});
// ===== API con axios =====
const API_BASE = 'http://localhost:3000';

// ===== Render del tablero =====
let currentTaskId = null;
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]}`;
}

function renderCard(task,commentCount = 0) {
  const done = task.status === 'done';
  const priorityLabel = { alta: 'Alta', media: 'Media', baja: 'Baja' };
  const article = document.createElement('article');
  article.className = `card${done ? ' is-done' : ''}`;
  article.dataset.id = task.id;
  article.innerHTML = `
    <p class="card-title clickable">${task.title}</p>
    <p class="card-desc">${task.description}</p>
    <footer class="card-meta">
      <span class="badge priority-${task.priority}">${priorityLabel[task.priority]}</span>
      <time datetime="${task.dueDate}">${formatDate(task.dueDate)}</time>
       <span class="comment-count" title="Comentarios">💬 ${commentCount}</span>
    </footer>`;
  return article;
}

function updateCounts(tasks) {
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

function renderBoard(tasks) {
  document.querySelectorAll('.column').forEach(col => {
    const status = col.dataset.status;
    const list = col.querySelector('.card-list');
    list.innerHTML = '';
    tasks
      .filter((t) => t.status === status)
      .forEach((t) => {
        const count = comments.filter(
          (c) => String(c.taskId) === String(t.id),
        ).length;
        list.appendChild(renderCard(t, count));
      });
  });
  updateCounts(tasks);
  initSortable(); 
}
//Refresca los contadores
function refreshCounts() {
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
//hace arrastable todas las columnas
function initSortable() {
  document.querySelectorAll('.card-list').forEach(makeSortable)
}
//Funcion que hace arrastablle cierta columna 
function makeSortable(list) {
  if (list._sortable) list._sortable.destroy();
  list._sortable = new Sortable(list, {
    group: 'board',
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    onEnd: async (evt) => {
      const cardId = evt.item.dataset.id;
      const newStatus = evt.to.closest('.column').dataset.status;
      await axios.patch(`${API_BASE}/tasks/${cardId}`, { status: newStatus });
      refreshCounts();
    }
  });
}
//carga el tablero y los comentarios con axios
async function fetchAndRender() {
  const [{ data: tasks }, { data: commentsData }] = await Promise.all([
    axios.get(`${API_BASE}/tasks`),
    axios.get(`${API_BASE}/comments`)
  ]);
  comments = commentsData;
  renderBoard(tasks);
}
//Listener para crear tarjetas nuevas
document.getElementById('new-task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nueva = {
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-desc').value.trim(),
    priority: document.getElementById('task-priority').value,
    dueDate: document.getElementById('task-due').value || null,
    status: 'todo'
  };
  if (!nueva.title) return;
  const { data: taskCreada } = await axios.post(`${API_BASE}/tasks`, nueva);
  e.target.reset();
  closeNewTaskModal();
  const todoList = document.querySelector('[data-status="todo"] .card-list');
  todoList.appendChild(renderCard(taskCreada));
  makeSortable(todoList);
  refreshCounts();
});
//funcion que inserta en el modal de detalle algun comentario asociado a la tarea
function renderComment(comment) {
  const article = document.createElement('article');
  article.className = 'comment';
  article.dataset.id = comment.id;
  article.innerHTML = `
    <div class="comment-head">
      <p class="comment-author">${comment.author}</p>
      <button type="button" class="comment-delete-btn" data-id="${comment.id}" aria-label="Eliminar comentario">🗑</button>
    </div>
    <p class="comment-text">${comment.text}</p>`;
  return article;
}
//funcion que carga todos los comentarios en el modal de detalle 
function loadComments(taskId) {
  const list = document.getElementById('comment-list');
  list.innerHTML = '';
  comments
    .filter(c => String(c.taskId) === String(taskId))
    .forEach(c => list.appendChild(renderComment(c)));
}
//Listener para crear un comentario nuevo
document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('new-comment');
  const text = input.value.trim();
  if (!text || !currentTaskId) return;
  const nuevo = {
    taskId: Number(currentTaskId),
    author: 'Abel',
    text,
    createdAt: new Date().toISOString()
  };
  const { data: commentCreado } = await axios.post(`${API_BASE}/comments`, nuevo);
  comments.push(commentCreado);
  document.getElementById('comment-list').appendChild(renderComment(commentCreado));
  input.value = '';
  updateCardCommentCount();
});
// ===== Modal de detalle (delegación de eventos) =====
document.querySelector('.board').addEventListener('click', (e) => {
  const title = e.target.closest('.card-title.clickable');
  if (!title) return;
  const card = title.closest('.card');
  currentTaskId = card.dataset.id; 
  openDetailModal(title.textContent, card.querySelector('.card-desc').textContent);
  loadComments(currentTaskId);
});
//Listener para guardar cambios de una edicion.
document.getElementById('detail-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevoTitle = detailTitle.value.trim();
  const nuevoDesc = detailDesc.value.trim();

  if (!currentTaskId) return;
  await axios.patch(`${API_BASE}/tasks/${currentTaskId}`, {
    title: nuevoTitle,
    description: nuevoDesc
  });
  closeDetailModal();
   const card = document.querySelector(`.card[data-id="${currentTaskId}"]`);
  if (card) {
    card.querySelector('.card-title').textContent = nuevoTitle;
    card.querySelector('.card-desc').textContent = nuevoDesc;
  }
});
//Abre el modal de confirmacion al pulsar la papelera de un comentario
document.getElementById('comment-list').addEventListener('click', (e) => {
  const btn = e.target.closest('.comment-delete-btn');
  if (!btn) return;
  const commentEl = btn.closest('.comment');
  currentCommentId = commentEl.dataset.id;
  commentDeleteAuthor.textContent = commentEl.querySelector('.comment-author').textContent;
  commentDeleteOverlay.classList.add('is-open');
});
//obtiene las referencias del modal
const commentDeleteOverlay = document.querySelector('.overlay-comment-delete');
const closeCommentDeleteBtn = document.getElementById('close-comment-delete');
const cancelCommentDeleteBtn = document.getElementById('cancel-comment-delete');
const confirmCommentDeleteBtn = document.getElementById('confirm-comment-delete');
const commentDeleteAuthor = document.getElementById('comment-delete-author');
//funcion que cierra el modal de confirmacion de eliminacion 
function closeCommentDeleteModal() {
  currentCommentId = null;
  commentDeleteOverlay.classList.remove('is-open');
}
//listener de botones de cerrar y cancelar la operacion
closeCommentDeleteBtn.addEventListener('click', closeCommentDeleteModal);
cancelCommentDeleteBtn.addEventListener('click', closeCommentDeleteModal);

commentDeleteOverlay.addEventListener('click', (e) => {
  if (e.target === commentDeleteOverlay) closeCommentDeleteModal();
});
//funcion que actualiza el contador de los comentarios en la tarjeta.
function updateCardCommentCount() {
  if (!currentTaskId) return;
  const count = comments.filter((c) => String(c.taskId) === String(currentTaskId)).length;
  const span = document.querySelector(`.card[data-id="${currentTaskId}"] .comment-count`);
  if (span) span.textContent = `💬 ${count}`;
}
//listener para confirmar la eliminacion de un comentario
confirmCommentDeleteBtn.addEventListener('click', async () => {
  if (!currentCommentId) return;
  await axios.delete(`${API_BASE}/comments/${currentCommentId}`);
  document.querySelector(`#comment-list .comment[data-id="${currentCommentId}"]`).remove();
  comments = comments.filter((c) => String(c.id) !== String(currentCommentId));
  currentCommentId = null;
  closeCommentDeleteModal();
  updateCardCommentCount();
});

// ===== Inicio =====
document.addEventListener('DOMContentLoaded', fetchAndRender);
//Evita refresh por la barra de busqueda 
document.getElementById('search-form').addEventListener('submit', (e) => e.preventDefault());