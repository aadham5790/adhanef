function downloadJson(type) {
  const data = state.getAll(type);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${type}.json`, 'success');
}

function downloadAll() {
  const types = ['services', 'projects', 'blog'];
  types.forEach(type => downloadJson(type));
}

const exportApi = {
  downloadJson,
  downloadAll
};
