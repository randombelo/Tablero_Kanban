import { updateTask } from './api.js';
import { refreshCounts } from './render.js';
//hace arrastable todas las columnas
export function initSortable() {
  document.querySelectorAll('.card-list').forEach(makeSortable)
}
//Funcion que hace arrastablle cierta columna 
export function makeSortable(list) {
  if (list._sortable) list._sortable.destroy();
  list._sortable = new Sortable(list, {
    group: 'board',
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    onEnd: async (evt) => {
      const cardId = evt.item.dataset.id;
      const newStatus = evt.to.closest('.column').dataset.status;
      evt.item.classList.toggle('is-done', newStatus === 'done');
      await updateTask(cardId, { status: newStatus });
      refreshCounts();
    }
  });
}