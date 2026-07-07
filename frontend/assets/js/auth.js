const API_URL = window.location.origin;

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) {
    try { if (window.parent && window.parent.showToast) { window.parent.showToast(message, type); return; } } catch (e) {}
    try { if (window.top && window.top.showToast) { window.top.showToast(message, type); return; } } catch (e) {}
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-bg-${type} border-0 show`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getToken() {
  return localStorage.getItem('token');
}

function isAuthenticated() {
  return Boolean(getToken());
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    // Token inválido o expirado: limpiar y redirigir al login
    try {
      // remove token and user, then redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore storage errors
    }
    // If we're on a page under /pages, navigate relatively
    const loginPath = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
    // small delay to allow any UI message to render before redirect
    setTimeout(() => { window.location.href = loginPath; }, 200);
    throw new Error(data.message || 'Token inválido o expirado');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}

async function apiBlobRequest(path) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const loginPath = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
    setTimeout(() => { window.location.href = loginPath; }, 200);
    throw new Error('Token inválido o expirado');
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Error en la descarga');
  }
  return response.blob();
}

async function apiUpload(path, formData) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const loginPath = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
    setTimeout(() => { window.location.href = loginPath; }, 200);
    throw new Error(data.message || 'Token inválido o expirado');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Error al subir archivo');
  }

  return data;
}

async function loginUser(correo, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, password }),
  });
}

function protectPage() {
  if (!isAuthenticated()) {
    window.location.href = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
    return false;
  }
  return true;
}

function hydrateUserLabel() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const label = document.getElementById('userLabel');
  const avatar = document.getElementById('userAvatar');
  if (user) {
    if (label) label.textContent = `${user.nombre} • ${user.rol}`;
    if (avatar) avatar.textContent = (user.nombre || 'U').charAt(0).toUpperCase();
  }
}

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const alertBox = document.getElementById('loginAlert');
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {
      const result = await loginUser(correo, password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = 'index.html';
    } catch (error) {
      alertBox.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  });
}

if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', logout);
}
