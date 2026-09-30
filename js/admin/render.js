import { escapeHtml } from './utils.js';

function renderTable(type) {
  const table = document.getElementById(`table-${type}`);
  if (!table) return;

  const data = state.getAll(type);
  const columns = getColumns(type);

  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  thead.innerHTML = `<tr>${columns.map(col => `<th>${col.label}</th>`).join('')}<th>Actions</th></tr>`;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${columns.length + 1}" class="empty-state">No items yet</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(item => {
    const cells = columns.map(col => {
      let value = item[col.key];
      if (Array.isArray(value)) {
        value = value.length > 0 ? `${value.length} item${value.length > 1 ? 's' : ''}` : 'None';
      } else if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
      }
      return `<td>${escapeHtml(String(value ?? ''))}</td>`;
    }).join('');

    return `<tr>${cells}<td class="actions">
      <button class="btn btn-sm btn-secondary" data-action="edit" data-type="${type}" data-id="${item.id}">Edit</button>
      <button class="btn btn-sm btn-danger" data-action="delete" data-type="${type}" data-id="${item.id}">Delete</button>
    </td></tr>`;
  }).join('');
}

function getColumns(type) {
  switch (type) {
    case 'services':
      return [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'price', label: 'Price' },
        { key: 'unit', label: 'Unit' },
        { key: 'popular', label: 'Popular' }
      ];
    case 'projects':
      return [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'subcategory', label: 'Subcategory' },
        { key: 'description', label: 'Description' }
      ];
    case 'blog':
      return [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'category', label: 'Category' },
        { key: 'date', label: 'Date' }
      ];
    default:
      return [];
  }
}

function renderDashboard() {
  document.getElementById('stat-services').textContent = state.getAll('services').length;
  document.getElementById('stat-projects').textContent = state.getAll('projects').length;
  document.getElementById('stat-blog').textContent = state.getAll('blog').length;
}

const render = {
  renderTable,
  renderDashboard,
  getColumns,
  escapeHtml
};
