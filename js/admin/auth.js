const ADMIN_PASSWORD = 'admin123';

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function isAuthenticated() {
  return sessionStorage.getItem('admin_auth') === hashPassword(ADMIN_PASSWORD);
}

function login(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('admin_auth', hashPassword(ADMIN_PASSWORD));
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem('admin_auth');
}

function requireAuth() {
  if (!isAuthenticated()) {
    showLogin();
    return false;
  }
  showAdmin();
  return true;
}

function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
}

function showAdmin() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('login-password').value;
    if (login(password)) {
      errorEl.textContent = '';
      showAdmin();
      form.reset();
      window.dispatchEvent(new CustomEvent('admin:login'));
    } else {
      errorEl.textContent = 'Invalid password';
    }
  });
}

const auth = {
  isAuthenticated,
  login,
  logout,
  requireAuth,
  showLogin,
  showAdmin,
  initLoginForm
};
