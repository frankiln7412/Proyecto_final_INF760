const THEME_KEY = 'inventario_theme';
const COLOR_KEY = 'inventario_color';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function getStoredColor() {
  return localStorage.getItem(COLOR_KEY) || 'default';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    btn.title = theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro';
  }
}

function applyColor(color) {
  if (color === 'default') {
    document.documentElement.removeAttribute('data-color');
  } else {
    document.documentElement.setAttribute('data-color', color);
  }
  localStorage.setItem(COLOR_KEY, color);
  document.querySelectorAll('.color-picker-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.color === color);
  });
  const dot = document.querySelector('.color-dot');
  if (dot) {
    const activeBtn = document.querySelector('.color-picker-btn.active');
    if (activeBtn) dot.style.background = activeBtn.style.background;
  }
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
  applyColor(getStoredColor());

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = getStoredTheme();
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ---- Color palette ----
  const paletteToggle = document.getElementById('colorPaletteToggle');
  const palettePopover = document.getElementById('colorPalettePopover');
  if (paletteToggle && palettePopover) {
    paletteToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      palettePopover.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!palettePopover.contains(e.target) && e.target !== paletteToggle) {
        palettePopover.classList.remove('show');
      }
    });
  }

  document.querySelectorAll('.color-picker-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyColor(btn.dataset.color);
      palettePopover.classList.remove('show');
    });
  });

  hydrateUserLabel();
});
