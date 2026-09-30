// Blog JavaScript
let blogData = [];
let currentCategory = 'all';
let currentPage = 1;
const postsPerPage = 3;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('data/blog.json');
    blogData = await response.json();
    renderBlog();
    initBlogFilters();
    initPagination();
  } catch (error) {
    console.error('Failed to load blog data:', error);
  }
});

function getFilteredPosts() {
  return currentCategory === 'all'
    ? blogData
    : blogData.filter(post => post.category === currentCategory);
}

function renderBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const filtered = getFilteredPosts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / postsPerPage));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * postsPerPage;
  const paginated = filtered.slice(start, start + postsPerPage);

  grid.innerHTML = paginated.map(post => `
    <a href="blog/${post.slug}.html" class="blog-card">
      <div class="blog-card-img">
        <img
          src="${post.cover}"
          srcset="${buildSrcSet([
            { src: post.cover, width: '800w' },
            { src: post.cover, width: '1200w' }
          ])}"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt="${post.title}"
          loading="lazy"
        >
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
    </a>
  `).join('') || '<p class="empty-state">No posts found.</p>';

  renderPagination(totalPages);
}

function initBlogFilters() {
  const buttons = document.querySelectorAll('.blog-category-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      currentPage = 1;
      renderBlog();
    });
  });
}

function initPagination() {
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = Number(btn.dataset.page);
      if (!Number.isNaN(page)) {
        currentPage = page;
        renderBlog();
      }
    });
  });
}

function renderPagination(totalPages) {
  const buttons = document.querySelectorAll('.page-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    const page = Number(btn.dataset.page);
    btn.classList.toggle('active', page === currentPage);
    btn.disabled = page === currentPage;
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
