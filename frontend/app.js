const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const sortSelect = document.getElementById('sort');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await searchBooks();
});

sortSelect.addEventListener('change', async () => {
  await searchBooks();
});

async function searchBooks() {
  const query = input.value.trim();
  const sort = sortSelect.value;
  if (!query) return;
  resultsDiv.innerHTML = '<p>Loading...</p>';
  try {
    const res = await fetch(`/api/books?q=${encodeURIComponent(query)}&orderBy=${sort}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    renderResults(data.items || []);
  } catch (err) {
    resultsDiv.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

function renderResults(books) {
  if (!books.length) {
    resultsDiv.innerHTML = '<p>No results found.</p>';
    return;
  }
  resultsDiv.innerHTML = books.map(book => {
    const info = book.volumeInfo;
    return `<div class="book">
      <img src="${(info.imageLinks && info.imageLinks.thumbnail) || 'https://via.placeholder.com/80x120?text=No+Cover'}" alt="Book cover">
      <div class="book-details">
        <div class="book-title">${info.title || 'No Title'}</div>
        <div class="book-author">${(info.authors && info.authors.join(', ')) || 'Unknown Author'}</div>
        <div class="book-desc">${info.description ? info.description.substring(0, 180) + '...' : 'No description available.'}</div>
      </div>
    </div>`;
  }).join('');
} 