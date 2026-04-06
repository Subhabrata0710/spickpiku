/* ============================================================
   SPICK PICU — Shared JavaScript
   Navigation/Footer loader, animations, utilities
   ============================================================ */

(function () {
  'use strict';

  // ---- Configuration ----
  const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbylWQBeozpe4-siOgKvI2jjHR9w0Rf41NxequyJZTk1JNINTdTpPjPPCFmO7I7dXrR93w/exec', // Replace with your deployed Apps Script URL
    ANIMATION_THRESHOLD: 0.15,
    TOAST_DURATION: 4000,
    LOADER_DELAY: 600
  };

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    loadComponent('nav-placeholder', 'nav.html', initNavigation);
    loadComponent('footer-placeholder', 'footer.html');
    initScrollAnimations();
    initSmoothScroll();
    initBackToTop();
    initLoader();
  }

  // ============================================================
  // COMPONENT LOADER
  // ============================================================
  function loadComponent(placeholderId, file, callback) {
    const el = document.getElementById(placeholderId);
    if (!el) return;

    fetch(file)
      .then(r => r.text())
      .then(html => {
        el.innerHTML = html;
        if (callback) callback();
        highlightActiveNav();
      })
      .catch(err => console.warn(`Failed to load ${file}:`, err));
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const mobile = document.querySelector('.nav-mobile');
    const overlay = document.querySelector('.nav-overlay');
    const navbar = document.querySelector('.navbar');

    function openMenu() {
      toggle.classList.add('active');
      mobile.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('active');
      mobile.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toggle && mobile) {
      toggle.addEventListener('click', () => {
        if (mobile.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Close when a link is clicked
      mobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });

      // Close when overlay is clicked
      if (overlay) {
        overlay.addEventListener('click', closeMenu);
      }
    }

    // Navbar scroll effect
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });
    }
  }

  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // ============================================================
  // SCROLL ANIMATIONS (IntersectionObserver)
  // ============================================================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: CONFIG.ANIMATION_THRESHOLD });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Re-observe after components load (delayed for dynamic content)
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => observer.observe(el));
    }, 500);
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // PAGE LOADER
  // ============================================================
  function initLoader() {
    const loader = document.querySelector('.loader-overlay');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }, CONFIG.LOADER_DELAY);
    });
  }

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  window.showToast = function (message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, CONFIG.TOAST_DURATION);
  };

  // ============================================================
  // FORM VALIDATION
  // ============================================================
  window.validateForm = function (formEl) {
    let valid = true;
    const groups = formEl.querySelectorAll('.form-group[data-required]');

    groups.forEach(group => {
      const input = group.querySelector('.form-control');
      if (!input) return;

      group.classList.remove('error');

      if (!input.value.trim()) {
        group.classList.add('error');
        valid = false;
      }

      // Email validation
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          group.classList.add('error');
          valid = false;
        }
      }

      // Phone validation
      if (input.type === 'tel' && input.value.trim()) {
        const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
        if (!phoneRegex.test(input.value.trim())) {
          group.classList.add('error');
          valid = false;
        }
      }
    });

    if (!valid) {
      showToast('Please fill in all required fields correctly.', 'error');
    }

    return valid;
  };

  // ============================================================
  // REGISTRATION — FORM LOGIC
  // ============================================================
  window.initRegistrationForm = function () {
    const roleSelect = document.getElementById('role');
    const attendingSelect = document.getElementById('attending');
    const workshopSelect = document.getElementById('workshop');
    const priceDisplay = document.getElementById('price-amount');
    const priceType = document.getElementById('price-type');
    const priceSection = document.getElementById('price-section');
    const form = document.getElementById('registration-form');
    const submitBtn = document.getElementById('submit-btn');
    const passwordField = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');

    if (!roleSelect || !attendingSelect) return;

    // All attending options
    const allOptions = attendingSelect.querySelectorAll('option');

    // Pricing map (Category -> Role -> Amount)
    const pricing = {
      'Workshop Only': {
        'PGT': 3000,
        'Pediatrician': 3500
      },
      'Workshop + Conference': {
        'PGT': 3500,
        'Pediatrician': 4000
      },
      'Only Conference': {
        'PGT': 1500,
        'Pediatrician': 2500
      },
      'Nursing Workshop': {
        'Nurse': 1500
      }
    };

    // Role change handler — Nurse lock logic
    roleSelect.addEventListener('change', function () {
      const isNurse = this.value === 'Nurse';

      // Lock Attending type for Nurse
      allOptions.forEach(opt => {
        if (opt.value === '') return;
        if (isNurse) {
          // If nurse, only allow Nursing Workshop
          opt.disabled = opt.value !== 'Nursing Workshop';
          opt.style.display = opt.value !== 'Nursing Workshop' ? 'none' : '';
        } else {
          // If not nurse, hide Nursing Workshop
          opt.disabled = opt.value === 'Nursing Workshop';
          opt.style.display = opt.value === 'Nursing Workshop' ? 'none' : '';
        }
      });

      // Auto-select and lock
      if (isNurse) {
        attendingSelect.value = 'Nursing Workshop';
        attendingSelect.disabled = true; // They can't change it
        if (workshopSelect) {
            workshopSelect.value = 'Nursing Workshop';
            workshopSelect.disabled = true; // Lock workshop too
        }
      } else {
        attendingSelect.disabled = false;
        if (attendingSelect.value === 'Nursing Workshop') {
          attendingSelect.value = '';
        }
        if (workshopSelect) {
            workshopSelect.disabled = false;
            if (workshopSelect.value === 'Nursing Workshop') workshopSelect.value = '';
        }
      }

      updatePrice();
      updateWorkshopVisibility();
    });

    // Attending change handler
    attendingSelect.addEventListener('change', function () {
      if (this.value === 'Nursing Workshop') {
          roleSelect.value = 'Nurse';
          this.disabled = true;
          if (workshopSelect) {
              workshopSelect.value = 'Nursing Workshop';
              workshopSelect.disabled = true;
          }
          // Re-trigger role change logic for consistency
          roleSelect.dispatchEvent(new Event('change'));
      }
      updatePrice();
      updateWorkshopVisibility();
    });

    function updatePrice() {
      const attending = attendingSelect.value;
      const role = roleSelect.value;

      if (!attending || !role) {
        priceSection.style.display = 'none';
        return;
      }

      // Determine price category (Pediatrician vs PGT)
      let priceCategory = 'Pediatrician';
      if (role === 'Post Graduate Trainee') {
        priceCategory = 'PGT';
      } else if (role === 'Nurse') {
        priceCategory = 'Nurse';
      }

      const amount = pricing[attending] ? pricing[attending][priceCategory] : null;

      if (amount !== null) {
        priceDisplay.textContent = '₹' + amount.toLocaleString('en-IN');
        priceType.textContent = attending + ' (' + role + ')';
        priceSection.style.display = 'block';
      } else {
        priceSection.style.display = 'none';
      }
    }

    function updateWorkshopVisibility() {
      const workshopGroup = document.getElementById('workshop-group');
      if (!workshopGroup) return;
      const val = attendingSelect.value;
      const isNurse = roleSelect.value === 'Nurse';

      // Show workshop dropdown for any selection involving workshops
      if (val === 'Workshop Only' || val === 'Workshop + Conference' || val === 'Nursing Workshop') {
        workshopGroup.style.display = 'block';
        
        // Hide/Show Nursing Workshop option in the workshop list
        if (workshopSelect) {
          const workshopOptions = workshopSelect.querySelectorAll('option');
          workshopOptions.forEach(opt => {
            if (opt.value === 'Nursing Workshop') {
              opt.style.display = isNurse ? '' : 'none';
              opt.disabled = !isNurse;
            } else if (opt.value !== '') {
              // Non-nursing workshops
              opt.style.display = isNurse ? 'none' : '';
              opt.disabled = isNurse;
            }
          });
          
          if (isNurse) {
            workshopSelect.value = 'Nursing Workshop';
            workshopSelect.disabled = true;
          }
        }
      } else {
        workshopGroup.style.display = 'none';
        if (workshopSelect) {
          workshopSelect.value = '';
          workshopSelect.disabled = false;
        }
      }
    }

    // Password toggle
    if (passwordToggle && passwordField) {
      passwordToggle.addEventListener('click', function () {
        const isPassword = passwordField.type === 'password';
        passwordField.type = isPassword ? 'text' : 'password';
        this.textContent = isPassword ? '🙈' : '👁️';
      });
    }

    // File upload display
    const fileInput = document.getElementById('payment-screenshot');
    const fileName = document.getElementById('file-name');
    if (fileInput && fileName) {
      fileInput.addEventListener('change', function () {
        fileName.textContent = this.files[0] ? this.files[0].name : '';
      });
    }

    // Form submission
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validateForm(this)) return;

        // Check password
        if (passwordField && !passwordField.value.trim()) {
          showToast('Please create a password for your account.', 'error');
          return;
        }

        // Check attending
        if (!attendingSelect.value) {
          showToast('Please select what you are attending.', 'error');
          return;
        }

        // Check screenshot
        const screenshotInput = document.getElementById('payment-screenshot');
        if (!screenshotInput || !screenshotInput.files[0]) {
          showToast('Please upload your payment screenshot.', 'error');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
          // Read file as base64
          const file = screenshotInput.files[0];
          const base64 = await fileToBase64(file);

          const formData = {
            action: 'register',
            firstName: document.getElementById('first-name').value.trim(),
            lastName: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            affiliation: document.getElementById('affiliation').value.trim(),
            designation: document.getElementById('designation').value.trim(),
            password: passwordField.value.trim(),
            role: roleSelect.value,
            attendingType: attendingSelect.value,
            workshopName: workshopSelect ? workshopSelect.value : '',
            foodPreference: document.getElementById('food').value,
            amount: parseInt(priceDisplay.textContent.replace(/[^\d]/g, '')) || 0,
            paymentScreenshot: {
              base64: base64,
              mimeType: file.type,
              fileName: file.name
            }
          };

          const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(formData)
          });

          const result = await response.json();

          if (result.success) {
            showToast(result.message || 'Registration successful! Check your email.', 'success');
            form.reset();
            priceSection.style.display = 'none';
            if (fileName) fileName.textContent = '';
          } else {
            showToast(result.message || 'Registration failed. Please try again.', 'error');
          }
        } catch (err) {
          console.error('Registration error:', err);
          showToast('Network error. Please check your connection and try again.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Registration';
        }
      });
    }

    // Initialize visibility
    updateWorkshopVisibility();
  };

  // ---- File to Base64 Helper ----
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Expose CONFIG for pages that need it
  window.SPICK_CONFIG = CONFIG;

})();
