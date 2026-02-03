// ===== AUTH MODAL LOGIC =====
document.addEventListener('DOMContentLoaded', function() {
  // Modal elements
  const authModal = document.getElementById('auth-modal');
  const openSignin = document.getElementById('open-signin');
  const openSignup = document.getElementById('open-signup');
  const closeModal = document.getElementById('close-modal');
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToSignin = document.getElementById('switch-to-signin');
  const modalTitle = document.getElementById('modal-title');
  const navbarUser = document.getElementById('navbar-user');
  const loginGoogle = document.getElementById('login-google');
  const registerGoogle = document.getElementById('register-google');

  // Show modal helpers
  function showModal(type) {
    authModal.classList.add('show');
    if (type === 'signin') {
      signinForm.style.display = '';
      signupForm.style.display = 'none';
      modalTitle.textContent = 'Sign In';
    } else {
      signinForm.style.display = 'none';
      signupForm.style.display = '';
      modalTitle.textContent = 'Sign Up';
    }
  }
  function hideModal() {
    authModal.classList.remove('show');
  }

  if (openSignin) openSignin.onclick = e => { e.preventDefault(); showModal('signin'); };
  if (openSignup) openSignup.onclick = e => { e.preventDefault(); showModal('signup'); };
  if (closeModal) closeModal.onclick = hideModal;
  window.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });
  authModal && authModal.addEventListener('click', e => { if (e.target === authModal) hideModal(); });
  if (switchToSignup) switchToSignup.onclick = e => { e.preventDefault(); showModal('signup'); };
  if (switchToSignin) switchToSignin.onclick = e => { e.preventDefault(); showModal('signin'); };

  // Demo local login/signup (replace with real backend or Firebase)
  function fakeAuth(name, cb) {
    setTimeout(() => cb({ name }), 600);
  }
  signinForm && signinForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const pass = document.getElementById('signin-password').value;
    fakeAuth(email.split('@')[0] || 'User', user => {
      hideModal();
      showUser(user.name);
    });
  });
  signupForm && signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    fakeAuth(name, user => {
      hideModal();
      showUser(user.name);
    });
  });

  // Google Auth (replace with real OAuth/Firebase)
  function googleAuth(cb) {
    // TODO: Integrate Firebase or OAuth here
    setTimeout(() => cb({ name: 'Google User' }), 600);
  }
  loginGoogle && loginGoogle.addEventListener('click', function() {
    googleAuth(user => {
      hideModal();
      showUser(user.name);
    });
  });
  registerGoogle && registerGoogle.addEventListener('click', function() {
    googleAuth(user => {
      hideModal();
      showUser(user.name);
    });
  });

  // Show user in navbar
  function showUser(name) {
    if (navbarUser) {
      navbarUser.textContent = name;
      navbarUser.style.display = 'inline-block';
    }
    if (openSignin) openSignin.style.display = 'none';
    if (openSignup) openSignup.style.display = 'none';
  }
});
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
