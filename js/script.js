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

  function toggleMenu() {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navbar.classList.toggle('open');

    // focus management
    if (!expanded) {
      const firstLink = navCenter.querySelector('a');
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
    }
  });

  // Close on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navbar.classList.contains('open')) {
      navbar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      menuToggle.focus();
    }
  });

  // Reset on resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navbar.classList.contains('open')) {
      navbar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }
  });
});
