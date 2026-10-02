function openModal(title, bodyHtml, onSave) {
  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;

  overlay.classList.remove('hidden');

  const saveBtn = modalBody.querySelector('#modal-save');
  const cancelBtn = modalBody.querySelector('#modal-cancel');

  const close = () => {
    overlay.classList.add('hidden');
    modalBody.innerHTML = '';
  };

  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escHandler);
    }
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const formData = collectFormData(modalBody);
      if (validateForm(formData, modalBody)) {
        onSave(formData);
        close();
      }
    });
  }
}

function collectFormData(container) {
  const data = {};
  const inputs = container.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const key = input.dataset.key;
    if (!key) return;

    if (input.type === 'checkbox') {
      data[key] = input.checked;
    } else if (input.type === 'number') {
      data[key] = input.value ? Number(input.value) : null;
    } else if (input.tagName === 'TEXTAREA' && key === 'features') {
      data[key] = input.value.split('\n').filter(line => line.trim());
    } else {
      data[key] = input.value;
    }
  });
  return data;
}

function validateForm(data, container) {
  const required = container.querySelectorAll('[required]');
  let valid = true;

    required.forEach(field => {
      const key = field.dataset.key;
      const errorEl = container.querySelector(`#error-${key}`);
      const value = data[key];
      // Note: `!value` would reject a valid 0 (e.g. free services).
      if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
      valid = false;
      field.classList.add('form-field-error');
      if (errorEl) {
        errorEl.textContent = 'This field is required';
        errorEl.style.display = 'block';
      }
    } else {
      field.classList.remove('form-field-error');
      if (errorEl) errorEl.style.display = 'none';
    }
  });

  return valid;
}

function getFormHtml(type, item = null) {
  const isEdit = !!item;
  let html = '<form id="modal-form">';

  switch (type) {
    case 'services':
      html += buildServiceForm(item);
      break;
    case 'projects':
      html += buildProjectForm(item);
      break;
    case 'blog':
      html += buildBlogForm(item);
      break;
  }

  html += `<div class="form-actions">
    <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
    <button type="button" class="btn btn-primary" id="modal-save">${isEdit ? 'Update' : 'Create'}</button>
  </div>`;
  html += '</form>';

  return html;
}

function buildServiceForm(item) {
  const data = item || { id: '', name: '', price: 0, currency: 'USD', unit: 'hour', features: [], cta: 'Inquire', popular: false };
  return `
    <div class="form-group">
      <label for="field-id">ID *</label>
      <input type="text" id="field-id" data-key="id" value="${escapeHtml(data.id)}" required ${item ? 'readonly' : ''}>
      <div class="hint">Unique identifier (e.g., consulting, workshop)</div>
    </div>
    <div class="form-group">
      <label for="field-name">Name *</label>
      <input type="text" id="field-name" data-key="name" value="${escapeHtml(data.name)}" required>
    </div>
    <div class="form-group">
      <label for="field-price">Price *</label>
      <input type="number" id="field-price" data-key="price" value="${data.price}" required>
    </div>
    <div class="form-group">
      <label for="field-currency">Currency</label>
      <input type="text" id="field-currency" data-key="currency" value="${escapeHtml(data.currency)}">
    </div>
    <div class="form-group">
      <label for="field-unit">Unit</label>
      <input type="text" id="field-unit" data-key="unit" value="${escapeHtml(data.unit)}">
    </div>
    <div class="form-group">
      <label for="field-features">Features (one per line)</label>
      <textarea id="field-features" data-key="features" rows="4">${escapeHtml((data.features || []).join('\n'))}</textarea>
    </div>
    <div class="form-group">
      <label for="field-cta">CTA Text</label>
      <input type="text" id="field-cta" data-key="cta" value="${escapeHtml(data.cta)}">
    </div>
    <div class="form-group">
      <label for="field-popular">Popular</label>
      <input type="checkbox" id="field-popular" data-key="popular" ${data.popular ? 'checked' : ''}>
    </div>
  `;
}

function buildProjectForm(item) {
  const data = item || { id: Date.now(), title: '', category: '', subcategory: '', thumb: '', full: '', alt: '', description: '' };
  return `
    <div class="form-group">
      <label for="field-id">ID *</label>
      <input type="number" id="field-id" data-key="id" value="${data.id}" required ${item ? 'readonly' : ''}>
    </div>
    <div class="form-group">
      <label for="field-title">Title *</label>
      <input type="text" id="field-title" data-key="title" value="${escapeHtml(data.title)}" required>
    </div>
    <div class="form-group">
      <label for="field-category">Category *</label>
      <input type="text" id="field-category" data-key="category" value="${escapeHtml(data.category)}" required>
    </div>
    <div class="form-group">
      <label for="field-subcategory">Subcategory</label>
      <input type="text" id="field-subcategory" data-key="subcategory" value="${escapeHtml(data.subcategory)}">
    </div>
    <div class="form-group">
      <label for="field-thumb">Thumb URL</label>
      <input type="text" id="field-thumb" data-key="thumb" value="${escapeHtml(data.thumb)}">
    </div>
    <div class="form-group">
      <label for="field-full">Full URL</label>
      <input type="text" id="field-full" data-key="full" value="${escapeHtml(data.full)}">
    </div>
    <div class="form-group">
      <label for="field-alt">Alt Text</label>
      <input type="text" id="field-alt" data-key="alt" value="${escapeHtml(data.alt)}">
    </div>
    <div class="form-group">
      <label for="field-description">Description</label>
      <textarea id="field-description" data-key="description" rows="3">${escapeHtml(data.description)}</textarea>
    </div>
  `;
}

function buildBlogForm(item) {
  const data = item || { id: Date.now(), title: '', slug: '', category: '', excerpt: '', date: new Date().toISOString().split('T')[0], readTime: '', cover: '' };
  return `
    <div class="form-group">
      <label for="field-id">ID *</label>
      <input type="number" id="field-id" data-key="id" value="${data.id}" required ${item ? 'readonly' : ''}>
    </div>
    <div class="form-group">
      <label for="field-title">Title *</label>
      <input type="text" id="field-title" data-key="title" value="${escapeHtml(data.title)}" required>
    </div>
    <div class="form-group">
      <label for="field-slug">Slug *</label>
      <input type="text" id="field-slug" data-key="slug" value="${escapeHtml(data.slug)}" required>
      <div class="hint">URL-friendly version (e.g., my-blog-post)</div>
    </div>
    <div class="form-group">
      <label for="field-category">Category</label>
      <input type="text" id="field-category" data-key="category" value="${escapeHtml(data.category)}">
    </div>
    <div class="form-group">
      <label for="field-excerpt">Excerpt</label>
      <textarea id="field-excerpt" data-key="excerpt" rows="2">${escapeHtml(data.excerpt)}</textarea>
    </div>
    <div class="form-group">
      <label for="field-date">Date</label>
      <input type="date" id="field-date" data-key="date" value="${data.date}">
    </div>
    <div class="form-group">
      <label for="field-readTime">Read Time</label>
      <input type="text" id="field-readTime" data-key="readTime" value="${escapeHtml(data.readTime)}">
    </div>
    <div class="form-group">
      <label for="field-cover">Cover URL</label>
      <input type="text" id="field-cover" data-key="cover" value="${escapeHtml(data.cover)}">
    </div>
  `;
}

const forms = {
  openModal,
  getFormHtml
};
