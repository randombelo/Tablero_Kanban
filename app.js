// --- Menú móvil ---
const navToggleBtn = document.getElementById('nav-toggle-btn');
const siteNav = document.querySelector('.site-nav');

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

confirmDeleteBtn.addEventListener('click', () => {
  closeDeleteModal();
});

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

function renderCard(task) {
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
      <span class="comment-count" title="Comentarios">💬 0</span>
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
    tasks.filter(t => t.status === status).forEach(t => list.appendChild(renderCard(t)));
  });
  updateCounts(tasks);
  initSortable(); 
}
function initSortable() {
  document.querySelectorAll('.card-list').forEach(list => {
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
        document.querySelectorAll('.column').forEach(col => {
          const count = col.querySelector('.card-list').children.length;
          col.querySelector('.count').textContent = count;
        });
      }
    });
  });
}

async function fetchAndRender() {
  const { data: tasks } = await axios.get(`${API_BASE}/tasks`);
  renderBoard(tasks);
}
//funcion para crear tarjetas nuevas
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
  await axios.post(`${API_BASE}/tasks`, nueva);
  e.target.reset();
  closeNewTaskModal();
  fetchAndRender();
});

// ===== Modal de detalle (delegación de eventos) =====
document.querySelector('.board').addEventListener('click', (e) => {
  const title = e.target.closest('.card-title.clickable');
  if (!title) return;
  const card = title.closest('.card');
  currentTaskId = card.dataset.id; 
  openDetailModal(title.textContent, card.querySelector('.card-desc').textContent);
});
//Listener para guardar cambios de una edicion.
document.getElementById('detail-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentTaskId) return;
  await axios.patch(`${API_BASE}/tasks/${currentTaskId}`, {
    title: detailTitle.value.trim(),
    description: detailDesc.value.trim()
  });
  closeDetailModal();
  fetchAndRender();
});

// ===== Inicio =====
document.addEventListener('DOMContentLoaded', fetchAndRender);