document.addEventListener('DOMContentLoaded', () => {
  if (!protectPage()) {
    return;
  }

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

      if (frame) {
        frame.src = page;
      }
    });
  });

  hydrateUserLabel();
});
