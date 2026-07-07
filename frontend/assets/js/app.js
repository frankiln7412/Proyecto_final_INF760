const THEME_KEY = 'inventario_theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  /* Propagar al iframe en tiempo real */
  var frame = document.getElementById('contentFrame');
  if (frame) {
    try {
      if (frame.contentDocument) {
        frame.contentDocument.documentElement.setAttribute('data-theme', theme);
      }
    } catch (_) {}
    try {
      frame.contentWindow.postMessage({ type: 'theme-change', theme: theme }, '*');
    } catch (_) {}
  }
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
    if (frame) {
      frame.src = page;
    }
  }
  if (frame) {
    frame.addEventListener('load', function() {
      var t = getStoredTheme();
      try {
        if (frame.contentDocument) {
          frame.contentDocument.documentElement.setAttribute('data-theme', t);
        }
      } catch (_) {}
      try {
        frame.contentWindow.postMessage({ type: 'theme-change', theme: t }, '*');
      } catch (_) {}
    });
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

  // ---- Topbar Search (propagar al iframe) ----
  const topbarSearch = document.getElementById('topbarSearch');
  if (topbarSearch) {
    topbarSearch.addEventListener('input', function() {
      try {
        frame.contentWindow.postMessage({ type: 'search', query: this.value }, '*');
      } catch (_) {}
    });
  }

  // ---- Notif Bell (demo) ----
  const notifBell = document.getElementById('notifBell');
  const notifDot = document.getElementById('notifDot');
  if (notifBell && notifDot) {
    notifDot.style.display = 'none';
    notifBell.addEventListener('click', function(e) {
      e.preventDefault();
      showToast('No hay notificaciones pendientes', 'info');
    });
  }
});
