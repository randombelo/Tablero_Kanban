// variable global que identifica lo que se pone en el buscador
const searchInput = document.getElementById('search-input');
// mostrar los resultados de la búsqueda
const searchStatus = document.getElementById('search-status');

// Evita refresh por la barra de busqueda
document.getElementById('search-form').addEventListener('submit', (e) => e.preventDefault());

// funcion que aplica el filtro sobre el dom.
export function applySearchFilter() {
  const term = searchInput.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.card').forEach((card) => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    const match = !term || title.includes(term);
    card.classList.toggle('is-filtered', !match);
    if (match) visible++;
  });
  if (term) {
    searchStatus.textContent =
      visible === 0
        ? `Sin resultados para "${term}"`
        : `${visible} resultado${visible === 1 ? '' : 's'} para "${term}"`;
  } else {
    searchStatus.textContent = '';
  }
}
//listener de lo que se pone en el buscador.
searchInput.addEventListener('input', applySearchFilter);