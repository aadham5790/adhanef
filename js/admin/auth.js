import { ADMIN_CONFIG } from './config.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 1000;

let loginAttempts = 0;
let lockoutUntil = 0;

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
  return sessionStorage.getItem('admin_auth') === hashPassword(ADMIN_CONFIG.password);
}

function login(password) {
  const now = Date.now();
  if (now < lockoutUntil) {
    return false;
  }

  if (password === ADMIN_CONFIG.password) {
    sessionStorage.setItem('admin_auth', hashPassword(ADMIN_CONFIG.password));
    loginAttempts = 0;
    return true;
  }

  loginAttempts += 1;
  if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    lockoutUntil = now + LOCKOUT_MS;
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
      const now = Date.now();
      if (now < lockoutUntil) {
        const seconds = Math.ceil((lockoutUntil - now) / 1000);
        errorEl.textContent = `Too many attempts. Try again in ${seconds} seconds.`;
      } else {
        errorEl.textContent = 'Invalid password';
      }
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
