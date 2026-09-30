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
  lightbox.setAttribute('aria-hidden', 'false');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.focus();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightbox.setAttribute('aria-hidden', 'true');
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

  if (e.key === 'Escape') {
    closeLightbox();
    return;
  }

  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

function trapFocus(lightbox) {
  const focusable = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  lightbox.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
  lightboxEl.setAttribute('aria-hidden', 'true');
  trapFocus(lightboxEl);
}
