// Blog JavaScript
let blogData = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('data/blog.json');
    blogData = await response.json();
    renderBlog();
    initBlogFilters();
  } catch (error) {
    console.error('Failed to load blog data:', error);
  }
});

function renderBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const filtered = currentCategory === 'all'
    ? blogData
    : blogData.filter(post => post.category === currentCategory);

  grid.innerHTML = filtered.map(post => `
    <article class="blog-card">
      <div class="blog-card-img">
        <img src="${post.cover}" alt="${post.title}" loading="lazy">
      </div>
      <div class="blog-card-body">
        <span class="blog-card-category">${post.category}</span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="blog-card-meta">
          <span>${formatDate(post.date)}</span>
          <span>${post.readTime}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function initBlogFilters() {
  const buttons = document.querySelectorAll('.blog-category-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderBlog();
    });
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
