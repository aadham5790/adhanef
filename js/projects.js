// Projects JavaScript
let projectsData = [];
let currentFilter = 'all';
let filteredItems = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('data/projects.json');
    projectsData = await response.json();
    renderProjects();
    initFilters();
  } catch (error) {
    console.error('Failed to load projects data:', error);
  }
});

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  filteredItems = currentFilter === 'all'
    ? projectsData
    : projectsData.filter(item => item.category === currentFilter);

  grid.innerHTML = filteredItems.map((item) => `
    <a href="projects/${item.slug}.html" class="project-item">
      <img
        src="${item.thumb}"
        srcset="${buildSrcSet([
          { src: item.thumb, width: '600w' },
          { src: item.full, width: '1200w' }
        ])}"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
        alt="${item.alt}"
        loading="lazy"
      >
      <div class="project-item-overlay">
        <div>
          <h3>${item.title}</h3>
          <span>${item.category}</span>
        </div>
      </div>
    </a>
  `).join('');
}

function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderProjects();
    });
  });
}
