// ===== AUTH MODAL LOGIC =====
// Backend API base URL - configure as needed
const API_BASE_URL = 'http://localhost:5000';

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
  // Ensure a navbar user element exists on every page so we can show name/icon consistently
  let navbarUser = document.getElementById('navbar-user');
  const navRight = document.querySelector('.nav-right');
  if (!navbarUser && navRight) {
    navbarUser = document.createElement('span');
    navbarUser.id = 'navbar-user';
    navbarUser.className = 'navbar-user';
    navbarUser.style.display = 'none';
    navRight.insertBefore(navbarUser, navRight.firstChild);
  }
  const loginGoogle = document.getElementById('login-google');
  const registerGoogle = document.getElementById('register-google');

  // If a user clicked a protected link, we store it here to redirect post-login
  let pendingRedirect = null; // e.g. 'billing.html' or full href

  // Show modal helpers
  function showModal(type) {
    if (!authModal) return;
    authModal.classList.add('show');
    if (type === 'signin') {
      if (signinForm) signinForm.style.display = '';
      if (signupForm) signupForm.style.display = 'none';
      if (modalTitle) modalTitle.textContent = 'Sign In';
    } else {
      if (signinForm) signinForm.style.display = 'none';
      if (signupForm) signupForm.style.display = '';
      if (modalTitle) modalTitle.textContent = 'Sign Up';
    }
    clearFormMessages();
  }
  function hideModal() {
    if (!authModal) return;
    authModal.classList.remove('show');
  }

  if (openSignin) openSignin.onclick = e => { e.preventDefault(); showModal('signin'); };
  if (openSignup) openSignup.onclick = e => { e.preventDefault(); showModal('signup'); };
  if (closeModal) closeModal.onclick = hideModal;
  window.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });
  authModal && authModal.addEventListener('click', e => { if (e.target === authModal) hideModal(); });
  if (switchToSignup) switchToSignup.onclick = e => { e.preventDefault(); showModal('signup'); };
  if (switchToSignin) switchToSignin.onclick = e => { e.preventDefault(); showModal('signin'); };

  // Small toast message helper
  function showToast(msg) {
    let t = document.getElementById('site-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'site-toast';
      t.className = 'site-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }

  // Show error message in the form
  function showFormError(formType, message) {
    let errorDiv = document.getElementById(formType + '-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = formType + '-error';
      errorDiv.style.cssText = 'color: #ef4444; margin-top: 12px; font-size: 14px; padding: 8px; border: 1px solid #fca5a5; border-radius: 4px; background-color: #fee2e2;';
      const form = document.getElementById(formType + '-form');
      if (form) form.insertBefore(errorDiv, form.querySelector('button'));
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  // Clear all error messages
  function clearFormMessages() {
    const errors = document.querySelectorAll('[id$="-error"]');
    errors.forEach(e => e.style.display = 'none');
  }

  // Login API call
  async function loginUser(email, password) {
    try {
      clearFormMessages();
      const response = await fetch(API_BASE_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if user doesn't exist
        if (response.status === 401 && data.msg === 'Invalid credentials') {
          showFormError('signin', 'First sign up - user not found');
        } else {
          showFormError('signin', data.msg || 'Login failed');
        }
        return false;
      }

      // Store JWT token and user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userEmail', email);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      showFormError('signin', 'Connection error - make sure backend is running on ' + API_BASE_URL);
      return false;
    }
  }

  // Register API call
  async function registerUser(name, email, password, role) {
    try {
      clearFormMessages();
      const response = await fetch(API_BASE_URL + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if user already exists (could be 400 or 409)
        if (response.status >= 400 && (data.msg.includes('already') || data.msg.includes('exists'))) {
          showFormError('signup', 'You already signed up - now sign in');
        } else {
          showFormError('signup', data.msg || 'Registration failed');
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Register error:', error);
      showFormError('signup', 'Connection error - make sure backend is running on ' + API_BASE_URL);
      return false;
    }
  }

  signinForm && signinForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const pass = document.getElementById('signin-password').value;
    
    const success = await loginUser(email, pass);
    if (success) {
      hideModal();
      showUser(email);
      showToast('Logged in successfully!');
      // if user was trying to open a protected page, go there now
      if (pendingRedirect) {
        const dest = pendingRedirect;
        pendingRedirect = null;
        setTimeout(() => window.location.href = dest, 500);
      }
    }
  });

  signupForm && signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const roleEl = document.getElementById('signup-role');
    const role = roleEl ? roleEl.value : 'clothes_admin';
    
    if (roleEl && !roleEl.value) {
      showFormError('signup', 'Please select a role');
      return;
    }

    // Map UI roles to backend roles
    const roleMapping = {
      'admin': 'super_admin',
      'cloths': 'clothes_admin',
      'clothes_admin': 'clothes_admin'
    };
    const backendRole = roleMapping[role] || role;

    const success = await registerUser(name, email, password, backendRole);
    if (success) {
      showToast('Sign up successful! Now sign in.');
      // Clear form and switch to signin
      signupForm.reset();
      setTimeout(() => showModal('signin'), 500);
    }
  });

  // Google Auth (replace with real OAuth/Firebase)
  function googleAuth(cb) {
    // TODO: Integrate Firebase or OAuth here
    setTimeout(() => cb({ name: 'Google User' }), 600);
  }
  loginGoogle && loginGoogle.addEventListener('click', function() {
    googleAuth(user => {
      localStorage.setItem('authToken', 'google-token');
      localStorage.setItem('userEmail', user.email || 'user@gmail.com');
      hideModal();
      showUser(user.email || 'google@user.com');
      if (pendingRedirect) { const dest = pendingRedirect; pendingRedirect = null; window.location.href = dest; }
    });
  });
  registerGoogle && registerGoogle.addEventListener('click', function() {
    googleAuth(user => {
      localStorage.setItem('authToken', 'google-token');
      localStorage.setItem('userEmail', user.email || 'user@gmail.com');
      hideModal();
      showUser(user.email || 'google@user.com');
      if (pendingRedirect) { const dest = pendingRedirect; pendingRedirect = null; window.location.href = dest; }
    });
  });

  // Show user in navbar and add logout
  function showUser(name) {
    if (navbarUser) {
      navbarUser.innerHTML = '<i class="fa-solid fa-user-astronaut user-icon" aria-hidden="true"></i>' +
                             '<span class="nav-username">' + name + '</span>';
      navbarUser.style.display = 'inline-flex';
      navbarUser.setAttribute('title', name);
    }
    if (openSignin) openSignin.style.display = 'none';
    if (openSignup) openSignup.style.display = 'none';
    if (!document.getElementById('logout-btn')) {
      const btn = document.createElement('button');
      btn.id = 'logout-btn';
      btn.className = 'logout-btn';
      btn.textContent = 'Logout';
      btn.addEventListener('click', logout);
      const navRight = document.querySelector('.nav-right');
      if (navRight) {
        // keep logout visually next to username
        navRight.appendChild(btn);
      }
    }
  }

  function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    if (navbarUser) navbarUser.style.display = 'none';
    if (openSignin) openSignin.style.display = '';
    if (openSignup) openSignup.style.display = '';
    const btn = document.getElementById('logout-btn');
    if (btn) btn.remove();
    showToast('Logged out');
    // Redirect to home after logout
    setTimeout(() => window.location.href = 'index.html', 500);
  }

  // Restore auth state on load
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    const userEmail = localStorage.getItem('userEmail');
    try {
      if (userEmail) showUser(userEmail);
    } catch (e) {}
  }

  // If the page requested the sign in/up modal via query params, open it and capture redirect
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openSignIn') === '1') showModal('signin');
    if (params.get('openSignUp') === '1') showModal('signup');
    if (params.get('redirect')) pendingRedirect = params.get('redirect');
  } catch (e) {}

  // Protected links: all site pages except index, login and signup require login
  const whitelist = ['index.html','login.html','signup.html',''];
  document.querySelectorAll('#top-navigation a').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = (this.getAttribute('href') || '').trim();
      if (!href || href === '#' || href.startsWith('http')) return; // ignore external or anchor links
      const path = href.split('/').pop();
      const isProtected = !whitelist.includes(path);
      const logged = !!localStorage.getItem('authToken');
      if (isProtected && !logged) {
        e.preventDefault();
        showToast('Please login first');
        // remember where to go after sign-in
        pendingRedirect = href;
        if (authModal) {
          showModal('signin');
        } else {
          window.location.href = 'login.html?openSignIn=1&redirect=' + encodeURIComponent(href);
        }
      }
    });
  });

  // Also protect feature cards (homepage tiles) and redirect after login
  document.querySelectorAll('a.feature-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const href = (this.getAttribute('href') || '').trim();
      if (!href || href === '#' || href.startsWith('http')) return;
      const logged = !!localStorage.getItem('authToken');
      if (!logged) {
        e.preventDefault();
        showToast('Please login first');
        pendingRedirect = href;
        if (authModal) {
          showModal('signin');
        } else {
          window.location.href = 'login.html?openSignIn=1&redirect=' + encodeURIComponent(href);
        }
      }
    });
  });
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
