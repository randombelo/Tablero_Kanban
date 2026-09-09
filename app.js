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

let currentCard = null;

document.querySelectorAll('.card-title.clickable').forEach((cardTitle) => {
  cardTitle.addEventListener('click', () => {
    const card = cardTitle.closest('.card');
    currentCard = card;
    const desc = card.querySelector('.card-desc').textContent;
    openDetailModal(cardTitle.textContent, desc);
  });
});

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