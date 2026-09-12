// ===== App: bootstrap / entrada =====
import { state }                                          from './state.js';
import { getAllData }                                     from './api.js';
import { renderBoard }                                    from './render.js';
import { initSortable }                                   from './drag.js';
import './modals.js';   // registra listeners de modales
import './search.js';   // registra listeners de búsqueda
// Carga el tablero y los comentarios
async function fetchAndRender() {
  const { tasks, comments } = await getAllData();
  state.comments = comments;
  renderBoard(tasks);
  initSortable();
}

// ===== Inicio =====
document.addEventListener('DOMContentLoaded', fetchAndRender);