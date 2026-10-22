/**
 * AETHER LABS — VANILLA JAVASCRIPT INTERACTION & VALIDATION MODULE
 * Brand Tagline: Intelligence, engineered.
 *
 * Responsibilities:
 * 1. Accessible mobile navigation toggle (ARIA expanded, Escape key, outside click)
 * 2. Portfolio category filtering (All Projects, AI, Web Development, Automation, Cloud)
 * 3. Contact form client-side validation & transparent demonstration flow
 * 4. Progressive scroll-triggered reveal animations (respecting prefers-reduced-motion)
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AetherLabs = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var VALID_CATEGORIES = ['all', 'ai', 'web', 'automation', 'cloud'];

  var CATEGORY_LABELS = {
    all: 'All Projects',
    ai: 'AI',
    web: 'Web Development',
    automation: 'Automation',
    cloud: 'Cloud'
  };

  /**
   * Pure function: normalizes and validates a portfolio filter category.
   * @param {string} category
   * @returns {string}
   */
  function normalizeCategory(category) {
    if (!category || typeof category !== 'string') {
      return 'all';
    }
    var clean = category.trim().toLowerCase();
    return VALID_CATEGORIES.indexOf(clean) !== -1 ? clean : 'all';
  }

  /**
   * Pure function: filters an array of project descriptors by category.
   * @param {Array<{id: string, title: string, category: string}>} projects
   * @param {string} selectedCategory
   * @returns {Array<{id: string, title: string, category: string}>}
   */
  function filterProjectsData(projects, selectedCategory) {
    if (!Array.isArray(projects)) {
      return [];
    }
    var normalized = normalizeCategory(selectedCategory);
    if (normalized === 'all') {
      return projects.slice();
    }
    return projects.filter(function (project) {
      return project && String(project.category).toLowerCase() === normalized;
    });
  }

  /**
   * Pure function: validates contact form fields and returns structured result.
   * @param {{fullName?: string, email?: string, service?: string, budget?: string, description?: string}} values
   * @returns {{valid: boolean, errors: {fullName?: string, email?: string, service?: string, description?: string}, sanitized: object}}
   */
  function validateContactPayload(values) {
    var raw = values || {};
    var fullName = typeof raw.fullName === 'string' ? raw.fullName.trim() : '';
    var email = typeof raw.email === 'string' ? raw.email.trim() : '';
    var service = typeof raw.service === 'string' ? raw.service.trim() : '';
    var budget = typeof raw.budget === 'string' ? raw.budget.trim() : '';
    var description = typeof raw.description === 'string' ? raw.description.trim() : '';

    var errors = {};

    if (!fullName) {
      errors.fullName = 'Please enter your full name.';
    } else if (fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email) {
      errors.email = 'Please enter your work or contact email address.';
    } else if (!emailPattern.test(email)) {
      errors.email = 'Please enter a valid email address (for example, name@company.com).';
    }

    var allowedServices = [
      'AI Engineering',
      'Digital Product Development & Web Development',
      'Intelligent Automation',
      'Cloud Solutions',
      'Multi-Discipline Advisory'
    ];
    if (!service) {
      errors.service = 'Please select the primary service you are inquiring about.';
    } else if (allowedServices.indexOf(service) === -1) {
      errors.service = 'Please select a valid service category from the list.';
    }

    if (!description) {
      errors.description = 'Please provide a brief description of your project goals and timeline.';
    } else if (description.length < 20) {
      errors.description = 'Please include at least 20 characters so our engineering team can evaluate scope.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
      sanitized: {
        fullName: fullName,
        email: email,
        service: service,
        budget: budget || 'Not specified',
        description: description
      }
    };
  }

  /**
   * Initializes mobile navigation toggle and keyboard accessibility.
   */
  function initMobileNav() {
    var toggleBtn = document.querySelector('[data-menu-toggle]');
    var nav = document.getElementById('primary-navigation');
    if (!toggleBtn || !nav) {
      return;
    }

    function setMenuOpen(isOpen) {
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      nav.classList.toggle('is-open', isOpen);
    }

    toggleBtn.addEventListener('click', function () {
      var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!expanded);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggleBtn.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (toggleBtn.getAttribute('aria-expanded') !== 'true') {
        return;
      }
      var target = event.target;
      if (!nav.contains(target) && !toggleBtn.contains(target)) {
        setMenuOpen(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && toggleBtn.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
      }
    });
  }

  /**
   * Initializes portfolio category filtering on portfolio.html.
   */
  function initPortfolioFilters() {
    var filterContainer = document.querySelector('[data-portfolio-filters]');
    var projectGrid = document.querySelector('[data-portfolio-grid]');
    if (!filterContainer || !projectGrid) {
      return;
    }

    var filterButtons = Array.prototype.slice.call(
      filterContainer.querySelectorAll('[data-filter]')
    );
    var projectCards = Array.prototype.slice.call(
      projectGrid.querySelectorAll('[data-category]')
    );
    var statusText = document.querySelector('[data-filter-status]');

    function applyFilter(category) {
      var activeCategory = normalizeCategory(category);
      var visibleCount = 0;

      filterButtons.forEach(function (button) {
        var btnCategory = normalizeCategory(button.getAttribute('data-filter'));
        var isMatch = btnCategory === activeCategory;
        button.classList.toggle('is-active', isMatch);
        button.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      projectCards.forEach(function (card) {
        var cardCategory = normalizeCategory(card.getAttribute('data-category'));
        var shouldShow = activeCategory === 'all' || cardCategory === activeCategory;

        if (shouldShow) {
          card.removeAttribute('hidden');
          card.classList.remove('is-entering');
          void card.offsetWidth;
          card.classList.add('is-entering');
          visibleCount += 1;
        } else {
          card.setAttribute('hidden', '');
          card.classList.remove('is-entering');
        }
      });

      if (statusText) {
        var label = CATEGORY_LABELS[activeCategory] || 'All Projects';
        statusText.textContent =
          'Showing ' +
          visibleCount +
          ' of ' +
          projectCards.length +
          ' concept ' +
          (visibleCount === 1 ? 'project' : 'projects') +
          ' (' +
          label +
          ')';
      }
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var requested = button.getAttribute('data-filter');
        applyFilter(requested);
      });
    });

    // Support optional URL query parameter ?category=ai|web|automation|cloud
    var params = new URLSearchParams(window.location.search);
    var initialCategory = params.get('category');
    if (initialCategory) {
      applyFilter(initialCategory);
    }
  }

  /**
   * Initializes client-side validation and demonstration submission on contact.html.
   */
  function initContactForm() {
    var form = document.getElementById('aether-contact-form');
    if (!form) {
      return;
    }

    var fields = {
      fullName: form.querySelector('#full-name'),
      email: form.querySelector('#email-address'),
      service: form.querySelector('#requested-service'),
      budget: form.querySelector('#project-budget'),
      description: form.querySelector('#project-description')
    };

    var errorNodes = {
      fullName: document.getElementById('error-full-name'),
      email: document.getElementById('error-email-address'),
      service: document.getElementById('error-requested-service'),
      description: document.getElementById('error-project-description')
    };

    var errorBanner = document.getElementById('form-error-banner');
    var confirmationPanel = document.getElementById('submission-confirmation');
    var summaryName = document.getElementById('summary-name');
    var summaryEmail = document.getElementById('summary-email');
    var summaryService = document.getElementById('summary-service');
    var summaryBudget = document.getElementById('summary-budget');
    var summaryDescription = document.getElementById('summary-description');
    var resetBtn = document.getElementById('reset-demo-form');

    // Pre-select service if passed via URL query string (?service=...)
    var params = new URLSearchParams(window.location.search);
    var preselectedService = params.get('service');
    if (preselectedService && fields.service) {
      var options = Array.prototype.slice.call(fields.service.options);
      options.forEach(function (opt) {
        if (opt.value.toLowerCase() === preselectedService.toLowerCase()) {
          fields.service.value = opt.value;
        }
      });
    }

    function setFieldError(key, message) {
      var input = fields[key];
      var errEl = errorNodes[key];
      if (!input || !errEl) {
        return;
      }
      if (message) {
        input.setAttribute('aria-invalid', 'true');
        errEl.textContent = message;
        errEl.removeAttribute('hidden');
      } else {
        input.setAttribute('aria-invalid', 'false');
        errEl.textContent = '';
        errEl.setAttribute('hidden', '');
      }
    }

    function collectValues() {
      return {
        fullName: fields.fullName ? fields.fullName.value : '',
        email: fields.email ? fields.email.value : '',
        service: fields.service ? fields.service.value : '',
        budget: fields.budget ? fields.budget.value : '',
        description: fields.description ? fields.description.value : ''
      };
    }

    ['fullName', 'email', 'service', 'description'].forEach(function (key) {
      var input = fields[key];
      if (!input) {
        return;
      }
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') {
          var check = validateContactPayload(collectValues());
          setFieldError(key, check.errors[key] || '');
          if (check.valid && errorBanner) {
            errorBanner.setAttribute('hidden', '');
          }
        }
      });
      input.addEventListener('change', function () {
        if (input.getAttribute('aria-invalid') === 'true') {
          var check = validateContactPayload(collectValues());
          setFieldError(key, check.errors[key] || '');
        }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var result = validateContactPayload(collectValues());
      var keys = ['fullName', 'email', 'service', 'description'];
      var firstInvalid = null;

      keys.forEach(function (key) {
        var msg = result.errors[key] || '';
        setFieldError(key, msg);
        if (msg && !firstInvalid && fields[key]) {
          firstInvalid = fields[key];
        }
      });

      if (!result.valid) {
        if (errorBanner) {
          errorBanner.textContent =
            'Please review the highlighted fields below before submitting your inquiry.';
          errorBanner.removeAttribute('hidden');
        }
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      if (errorBanner) {
        errorBanner.setAttribute('hidden', '');
      }

      if (summaryName) summaryName.textContent = result.sanitized.fullName;
      if (summaryEmail) summaryEmail.textContent = result.sanitized.email;
      if (summaryService) summaryService.textContent = result.sanitized.service;
      if (summaryBudget) summaryBudget.textContent = result.sanitized.budget;
      if (summaryDescription) summaryDescription.textContent = result.sanitized.description;

      form.setAttribute('hidden', '');
      if (confirmationPanel) {
        confirmationPanel.removeAttribute('hidden');
        confirmationPanel.focus({ preventScroll: true });
        if (typeof confirmationPanel.scrollIntoView === 'function') {
          confirmationPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        ['fullName', 'email', 'service', 'description'].forEach(function (key) {
          setFieldError(key, '');
        });
        if (errorBanner) {
          errorBanner.setAttribute('hidden', '');
        }
        if (confirmationPanel) {
          confirmationPanel.setAttribute('hidden', '');
        }
        form.removeAttribute('hidden');
        if (fields.fullName) {
          fields.fullName.focus();
        }
      });
    }
  }

  /**
   * Initializes subtle scroll-triggered reveal animations when supported.
   */
  function initScrollReveal() {
    var prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      return;
    }

    document.documentElement.classList.add('js-enabled');
    var targets = Array.prototype.slice.call(
      document.querySelectorAll('.reveal-on-scroll')
    );

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.08
      }
    );

    targets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  function init() {
    if (typeof document === 'undefined') {
      return;
    }
    initMobileNav();
    initPortfolioFilters();
    initContactForm();
    initScrollReveal();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  return {
    normalizeCategory: normalizeCategory,
    filterProjectsData: filterProjectsData,
    validateContactPayload: validateContactPayload,
    init: init
  };
});
