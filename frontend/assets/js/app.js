const THEME_KEY = 'inventario_theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

/* Stock Pulse — actualizado desde dashboard */
function updateStockPulse(data) {
  if (!data || !data.total_productos) {
    document.getElementById('pulseOk').style.width = '100%';
    document.getElementById('pulseWarn').style.width = '0%';
    document.getElementById('pulseCrit').style.width = '0%';
    return;
  }
  const total = data.total_productos;
  const bajos = data.productos_stock_bajo || [];
  let crit = 0, warn = 0;
  bajos.forEach((p) => {
    if (p.stock / p.stock_minimo <= 0.5) crit++;
    else warn++;
  });
  const ok = total - crit - warn;
  const okPct = (ok / total) * 100;
  const warnPct = (warn / total) * 100;
  const critPct = (crit / total) * 100;

  document.getElementById('pulseOk').style.width = okPct + '%';
  document.getElementById('pulseWarn').style.width = warnPct + '%';
  document.getElementById('pulseCrit').style.width = critPct + '%';
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

  function navigateTo(page, trigger) {
    if (!page) return;
    document.querySelectorAll('.sidebar .nav-link, .bottom-nav a').forEach((item) => item.classList.remove('active'));
    if (trigger) trigger.classList.add('active');
    if (frame) frame.src = page;
  }

  document.querySelectorAll('.sidebar .nav-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      navigateTo(link.getAttribute('data-page'), link);
      event.preventDefault();
    });
  });

  // ---- Bottom Nav (mobile) ----
  document.querySelectorAll('.bottom-nav a').forEach((link) => {
    link.addEventListener('click', (event) => {
      navigateTo(link.getAttribute('data-page'), link);
      event.preventDefault();
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
