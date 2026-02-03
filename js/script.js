function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.display =
    sidebar.style.display === "none" ? "block" : "none";
}

function login() {
  window.location.href = "dashboard.html";
}

// Mobile navigation toggle + accessibility
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.querySelector('.navbar');
  const navCenter = document.getElementById('top-navigation');

  if (!menuToggle) return;

  // Ensure nav center is hidden by default on mobile
  if (navCenter) navCenter.setAttribute('aria-hidden', 'true');

  function toggleMenu() {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const willBeExpanded = !expanded;
    menuToggle.setAttribute('aria-expanded', String(willBeExpanded));
    navbar.classList.toggle('open');
    if (navCenter) navCenter.setAttribute('aria-hidden', String(!willBeExpanded));

    // focus management
    if (willBeExpanded) {
      const firstLink = navCenter && navCenter.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      menuToggle.focus();
    }
  }

  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navbar.contains(e.target) && navbar.classList.contains('open')) {
      navbar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      if (navCenter) navCenter.setAttribute('aria-hidden','true');
    }
  });

  // Close on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navbar.classList.contains('open')) {
      navbar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      if (navCenter) navCenter.setAttribute('aria-hidden','true');
      menuToggle.focus();
    }
  });

  // Reset on resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navbar.classList.contains('open')) {
      navbar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      if (navCenter) navCenter.setAttribute('aria-hidden','true');
    }
  });
});
