import { state }                       from './state.js';
import { createTask, updateTask, deleteTask, createComment, deleteComment } from './api.js';
import { renderCard, renderComment, loadComments, updateCardCommentCount, refreshCounts } from './render.js';
import { makeSortable }                from './drag.js';
import { applySearchFilter }           from './search.js';
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

newTaskOverlay.addEventListener('click', (e) => {
  if (e.target === newTaskOverlay) closeNewTaskModal();
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
  if (e.target === detailOverlay) closeDetailModal();
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

confirmDeleteBtn.addEventListener('click', async () => {
  if (!state.currentTaskId) return;
  await deleteTask(state.currentTaskId);
  await Promise.all(
    state.comments
      .filter((c) => String(c.taskId) === String(state.currentTaskId))
      .map((c) => deleteComment(c.id))
  );
  state.comments = state.comments.filter((c) => String(c.taskId) !== String(state.currentTaskId));
  closeDeleteModal();
  const card = document.querySelector(`.card[data-id="${state.currentTaskId}"]`);
  if (card) card.remove();
  applySearchFilter();
  state.currentTaskId = null;
  refreshCounts();
});

deleteOverlay.addEventListener('click', (e) => {
  if (e.target === deleteOverlay) cancelDeletion();
});

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
  const { data: taskCreada } = await createTask(nueva);
  e.target.reset();
  closeNewTaskModal();
  const todoList = document.querySelector('[data-status="todo"] .card-list');
  todoList.appendChild(renderCard(taskCreada));
  applySearchFilter();
  makeSortable(todoList);
  refreshCounts();
});

//Listener para crear un comentario nuevo
document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('new-comment');
  const text = input.value.trim();
  if (!text || !state.currentTaskId) return;
  const nuevo = {
    taskId: Number(state.currentTaskId),
    author: 'Abel',
    text,
    createdAt: new Date().toISOString()
  };
  const { data: commentCreado } = await createComment(nuevo);
  state.comments.push(commentCreado);
  document.getElementById('comment-list').appendChild(renderComment(commentCreado));
  input.value = '';
  updateCardCommentCount();
});

// ===== Modal de detalle (delegación de eventos) =====
document.querySelector('.board').addEventListener('click', (e) => {
  const title = e.target.closest('.card-title.clickable');
  if (!title) return;
  const card = title.closest('.card');
  state.currentTaskId = card.dataset.id;
  openDetailModal(title.textContent, card.querySelector('.card-desc').textContent);
  loadComments(state.currentTaskId);
});

//Listener para guardar cambios de una edicion.
document.getElementById('detail-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevoTitle = detailTitle.value.trim();
  const nuevoDesc = detailDesc.value.trim();
  if (!state.currentTaskId) return;
  await updateTask(state.currentTaskId, {
    title: nuevoTitle,
    description: nuevoDesc
  });
  closeDetailModal();
  const card = document.querySelector(`.card[data-id="${state.currentTaskId}"]`);
  if (card) {
    card.querySelector('.card-title').textContent = nuevoTitle;
    applySearchFilter();
    card.querySelector('.card-desc').textContent = nuevoDesc;
  }
});

//Abre el modal de confirmacion al pulsar la papelera de un comentario
document.getElementById('comment-list').addEventListener('click', (e) => {
  const btn = e.target.closest('.comment-delete-btn');
  if (!btn) return;
  const commentEl = btn.closest('.comment');
  state.currentCommentId = commentEl.dataset.id;
  commentDeleteAuthor.textContent = commentEl.querySelector('.comment-author').textContent;
  commentDeleteOverlay.classList.add('is-open');
});

//obtiene las referencias del modal
const commentDeleteOverlay = document.querySelector('.overlay-comment-delete');
const closeCommentDeleteBtn = document.getElementById('close-comment-delete');
const cancelCommentDeleteBtn = document.getElementById('cancel-comment-delete');
const confirmCommentDeleteBtn = document.getElementById('confirm-comment-delete');
const commentDeleteAuthor = document.getElementById('comment-delete-author');

function closeCommentDeleteModal() {
  state.currentCommentId = null;
  commentDeleteOverlay.classList.remove('is-open');
}
closeCommentDeleteBtn.addEventListener('click', closeCommentDeleteModal);
cancelCommentDeleteBtn.addEventListener('click', closeCommentDeleteModal);

commentDeleteOverlay.addEventListener('click', (e) => {
  if (e.target === commentDeleteOverlay) closeCommentDeleteModal();
});

//listener para confirmar la eliminacion de un comentario
confirmCommentDeleteBtn.addEventListener('click', async () => {
  if (!state.currentCommentId) return;
  await deleteComment(state.currentCommentId);
  document.querySelector(`#comment-list .comment[data-id="${state.currentCommentId}"]`).remove();
  state.comments = state.comments.filter((c) => String(c.id) !== String(state.currentCommentId));
  state.currentCommentId = null;
  closeCommentDeleteModal();
  updateCardCommentCount();
});