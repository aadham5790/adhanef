// Projects JavaScript
let projectsData = [];
let currentFilter = 'all';
let currentIndex = 0;
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

  grid.innerHTML = filteredItems.map((item, index) => `
    <div class="project-item" data-index="${index}" onclick="openLightbox(${index})">
      <img src="${item.thumb}" alt="${item.alt}" loading="lazy">
      <div class="project-item-overlay">
        <div>
          <h3>${item.title}</h3>
          <span>${item.category}</span>
        </div>
      </div>
    </div>
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

function openLightbox(index) {
  currentIndex = index;
  const lightbox = document.getElementById('lightbox');
  const img = lightbox.querySelector('img');

  if (filteredItems[index]) {
    img.src = filteredItems[index].full || filteredItems[index].thumb;
    img.alt = filteredItems[index].alt;
  }

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  currentIndex = (currentIndex + direction + filteredItems.length) % filteredItems.length;
  const lightbox = document.getElementById('lightbox');
  const img = lightbox.querySelector('img');

  if (filteredItems[currentIndex]) {
    img.src = filteredItems[currentIndex].full || filteredItems[currentIndex].thumb;
    img.alt = filteredItems[currentIndex].alt;
  }
}

document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('open')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});
