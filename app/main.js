// main.js — router and header search for DataNusa.
import { ROUTES } from './views.js';
import { SEARCH_INDEX } from './data.js';

const root = document.getElementById('app');
const navLinks = [...document.querySelectorAll('.nav a')];
const searchInput = document.getElementById('site-search');
const searchResults = document.getElementById('search-results');

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const key = hash.split('/')[0];
  const view = ROUTES[key] || ROUTES[''];
  view(root);
  navLinks.forEach((a) => {
    const href = a.getAttribute('href').replace(/^#\/?/, '');
    a.classList.toggle('active', href === key || (href === '' && key === ''));
    if (href === key || (href === '' && key === '')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  document.title = 'DataNusa — Statistik Indonesia';
}

function runSearch(q) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) { searchResults.hidden = true; searchResults.innerHTML = ''; return; }
  const hits = SEARCH_INDEX.filter((item) => item.term.toLowerCase().includes(query)).slice(0, 8);
  if (!hits.length) {
    searchResults.innerHTML = `<li class="search-empty">Tidak ada indikator yang cocok dengan “${q.trim()}”.</li>`;
  } else {
    searchResults.innerHTML = hits.map((h) => `<li><a href="${h.route}"><strong>${h.term}</strong><span>${h.value}</span></a></li>`).join('');
  }
  searchResults.hidden = false;
}

searchInput.addEventListener('input', (e) => runSearch(e.target.value));
searchInput.addEventListener('focus', (e) => runSearch(e.target.value));
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') { searchResults.hidden = true; searchInput.blur(); } });
searchResults.addEventListener('click', () => { searchResults.hidden = true; searchInput.value = ''; });
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-box')) { searchResults.hidden = true; }
});

window.addEventListener('hashchange', route);
route();
