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

document.querySelectorAll('.card-title.clickable').forEach((cardTitle) => {
  cardTitle.addEventListener('click', () => {
    const card = cardTitle.closest('.card');
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