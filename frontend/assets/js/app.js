const THEME_KEY = 'inventario_theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!protectPage()) return;

  // ---- Sidebar ----
  const toggle = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  const frame = document.getElementById('contentFrame');

  if (toggle && sidebar && mainContent) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    });
  }

  document.querySelectorAll('.sidebar .nav-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      const page = link.getAttribute('data-page');
      if (!page) return;
      event.preventDefault();
      document.querySelectorAll('.sidebar .nav-link').forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      if (frame) frame.src = page;
    });
  });

  // ---- Theme ----
  applyTheme(getStoredTheme());

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = getStoredTheme();
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  hydrateUserLabel();
});
