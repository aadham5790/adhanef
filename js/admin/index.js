function setupAdmin() {
  state.init().then(() => {
    render.renderDashboard();

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        showSection(section);

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      auth.logout();
      window.location.reload();
    });

    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleAction);
    });

    document.getElementById('download-all-btn').addEventListener('click', exportApi.downloadAll);
  });
}

function initAdmin() {
  auth.initLoginForm();
  if (auth.requireAuth()) {
    setupAdmin();
  }

  window.addEventListener('admin:login', () => {
    setupAdmin();
  });
}

function showSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.classList.remove('hidden');
    if (sectionId !== 'dashboard') {
      render.renderTable(sectionId);
    } else {
      render.renderDashboard();
    }
  }
}

function handleAction(e) {
  const action = e.target.dataset.action;
  const type = e.target.dataset.type;

  switch (action) {
    case 'create':
      forms.openModal(`New ${type.slice(0, -1)}`, forms.getFormHtml(type), (data) => {
        if (type === 'services' || type === 'projects' || type === 'blog') {
          state.add(type, data);
          showToast(`${type.slice(0, -1)} created successfully`, 'success');
          render.renderTable(type);
          render.renderDashboard();
        }
      });
      break;

    case 'edit':
      const id = e.target.dataset.id;
      const item = state.getById(type, id);
      if (item) {
        forms.openModal(`Edit ${type.slice(0, -1)}`, forms.getFormHtml(type, item), (data) => {
          state.update(type, id, data);
          showToast(`${type.slice(0, -1)} updated successfully`, 'success');
          render.renderTable(type);
          render.renderDashboard();
        });
      }
      break;

    case 'delete':
      if (confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
        state.remove(type, e.target.dataset.id);
        showToast(`${type.slice(0, -1)} deleted`, 'success');
        render.renderTable(type);
        render.renderDashboard();
      }
      break;

    case 'download':
      exportApi.downloadJson(type);
      break;
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

document.addEventListener('DOMContentLoaded', initAdmin);
