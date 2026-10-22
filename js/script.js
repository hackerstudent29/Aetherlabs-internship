/**
 * Aether Labs — Core UI & Interaction Scripts
 *
 * Modules:
 * - Mobile navigation drawer
 * - Segmented control pill indicator
 * - Portfolio category filtering & URL state
 * - Architecture explorer tabs
 * - Accordion disclosures
 * - Project specification modal (<dialog>)
 * - Engineering lifecycle stepper
 * - Card spotlight & scroll reveal observers
 * - Contact form validation
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

  var PROJECT_BLUEPRINTS = {
    'atlas-ai': {
      title: 'Atlas AI — Enterprise Knowledge Synthesis',
      discipline: 'AI Engineering',
      serviceParam: 'AI Engineering',
      summary:
        'A production Retrieval-Augmented Generation (RAG) and reasoning engine designed for high-consequence technical and compliance corpora. Every generated statement is verified against source spans before leaving the inference gateway.',
      metrics: [
        { label: 'Citation Attribution Accuracy', value: '99.2%', fill: '99%' },
        { label: 'P95 Hybrid Retrieval Latency', value: '180 ms', fill: '84%' },
        { label: 'Hallucination Rejection Rate', value: '99.8%', fill: '99%' }
      ],
      specs: [
        { term: 'Ingestion Pipeline', detail: 'AST-aware semantic chunking + hierarchical document graphs' },
        { term: 'Search Index', detail: 'Reciprocal Rank Fusion combining dense HNSW vectors and BM25 lexical search' },
        { term: 'Verification Gate', detail: 'Deterministic entailment pass with sentence-level citation anchors' },
        { term: 'Evaluation Harness', detail: '1,240 automated golden benchmark queries run on every pull request' }
      ]
    },
    'pulse-commerce': {
      title: 'Pulse Commerce — Composable Edge Storefront',
      discipline: 'Web Development',
      serviceParam: 'Digital Product Development & Web Development',
      summary:
        'An ultra-responsive digital commerce platform architected for flagship hardware launches. Built with semantic HTML, zero-bloat client scripts, and distributed edge inventory synchronization.',
      metrics: [
        { label: 'Largest Contentful Paint (LCP)', value: '0.48s', fill: '96%' },
        { label: 'Core Web Vitals Assessment', value: '100 / 100', fill: '100%' },
        { label: 'Simulated Checkout Conversion Uplift', value: '+38.4%', fill: '88%' }
      ],
      specs: [
        { term: 'Rendering Strategy', detail: 'Edge-streamed HTML with progressive vanilla JS island hydration' },
        { term: 'State Synchronization', detail: 'Optimistic cart mutations backed by idempotent edge KV locks' },
        { term: 'Accessibility Standard', detail: 'WCAG 2.2 Level AA verified with full keyboard checkout flow' },
        { term: 'Visual Stability', detail: '0.00 Cumulative Layout Shift (CLS) across all 7 target viewports' }
      ]
    },
    'flowdesk': {
      title: 'Flowdesk — Autonomous Operations Pipeline',
      discipline: 'Automation',
      serviceParam: 'Intelligent Automation',
      summary:
        'A deterministic workflow orchestration engine that automates multi-step document intake, policy compliance checks, and ERP ledger synchronization while routing ambiguous edge cases to human operators.',
      metrics: [
        { label: 'Manual Triage Time Reduction', value: '74%', fill: '74%' },
        { label: 'Cryptographic Audit Trail Coverage', value: '100%', fill: '100%' },
        { label: 'Schema Extraction Precision', value: '99.1%', fill: '99%' }
      ],
      specs: [
        { term: 'Orchestration Engine', detail: 'Event-driven state machine with durable execution checkpoints' },
        { term: 'Safety Escalation', detail: 'Automatic human-in-the-loop review queue when confidence < 0.99' },
        { term: 'Idempotency Guarantee', detail: 'Deterministic transaction keys prevent duplicate ERP ledger writes' },
        { term: 'Observability', detail: 'Full input-to-commit lineage log exportable for compliance audits' }
      ]
    },
    'nova-cloud': {
      title: 'Nova Cloud — Multi-Region Infrastructure Mesh',
      discipline: 'Cloud Solutions',
      serviceParam: 'Cloud Solutions',
      summary:
        'A declarative multi-region cloud control plane engineered for active-active service availability, strict regional data residency, and automated FinOps compute rightsizing.',
      metrics: [
        { label: 'Multi-Region Target Availability', value: '99.99%', fill: '100%' },
        { label: 'Idle Compute Cost Reduction', value: '-31%', fill: '82%' },
        { label: 'Automated Region Failover Window', value: '< 15s', fill: '92%' }
      ],
      specs: [
        { term: 'Provisioning Model', detail: 'Immutable Infrastructure-as-Code modules with zero manual drift' },
        { term: 'Traffic Routing', detail: 'Anycast global load balancing with health-checked canary rollouts' },
        { term: 'Telemetry & Tracing', detail: 'OpenTelemetry distributed traces correlated with container cost metrics' },
        { term: 'Security Posture', detail: 'Zero-trust mTLS service mesh and least-privilege workload identities' }
      ]
    }
  };

  var LIFECYCLE_STAGES = {
    specification: {
      index: 'Phase 01 · Specification',
      title: 'Formalize system invariants and measurable acceptance criteria before code.',
      description:
        'We begin every engagement by writing a concise architectural specification. Together with your stakeholders, we define exact input/output schemas, P95 latency budgets, security boundaries, and failure recovery rules.',
      deliverables: [
        { term: 'System Architecture RFC', detail: 'Written boundary diagram, data flow, and trade-off analysis' },
        { term: 'Latency & Reliability Budget', detail: 'Explicit P50/P95 response targets and throughput ceilings' },
        { term: 'Evaluation Dataset Seed', detail: 'Initial benchmark test cases representing real production inputs' }
      ]
    },
    architecture: {
      index: 'Phase 02 · Architecture',
      title: 'Compose modular interfaces decoupled from vendor lock-in.',
      description:
        'We structure codebases with clean boundary interfaces so foundation models, vector stores, payment gateways, or cloud providers can be upgraded or swapped without rewriting core domain logic.',
      deliverables: [
        { term: 'Typed Domain Contracts', detail: 'Strict schema validation at every API and model boundary' },
        { term: 'Provider-Agnostic Adapters', detail: 'Clean abstraction layer over LLM and cloud infrastructure SDKs' },
        { term: 'Tokenized UI System', detail: 'Accessible HTML/CSS components built on a 4px spatial grid' }
      ]
    },
    verification: {
      index: 'Phase 03 · Verification',
      title: 'Prove system behavior against deterministic and adversarial test suites.',
      description:
        'Before any deployment reaches production, it must pass automated unit tests, integration checks, citation grounding evaluations, and multi-viewport accessibility audits.',
      deliverables: [
        { term: 'Automated CI/CD Gates', detail: 'Zero-regression unit, contract, and evaluation suite runner' },
        { term: 'Adversarial Edge-Case Suite', detail: 'Malformed input, timeout, and rate-limit resilience verification' },
        { term: 'WCAG 2.2 AA & Web Vitals Audit', detail: 'Verified keyboard navigation, contrast, and layout stability' }
      ]
    },
    operation: {
      index: 'Phase 04 · Operation',
      title: 'Transition to production with full telemetry and team ownership.',
      description:
        'We deploy using declarative Infrastructure-as-Code and hand over the complete repository, operational runbooks, and telemetry dashboards so your internal engineers can operate with confidence.',
      deliverables: [
        { term: 'Declarative Deployment Manifests', detail: 'Reproducible staging and production environment definitions' },
        { term: 'Live Telemetry & Drift Alerts', detail: 'Structured logs, latency histograms, and token cost monitors' },
        { term: 'Engineering Handoff Sessions', detail: 'Architecture walkthroughs and maintainer documentation' }
      ]
    }
  };

  /**
   * Pure function: normalizes and validates a portfolio filter category.
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
   * Pure function: returns blueprint data for a given project ID.
   */
  function getProjectBlueprint(projectId) {
    if (!projectId || typeof projectId !== 'string') {
      return null;
    }
    return PROJECT_BLUEPRINTS[projectId.trim()] || null;
  }

  /**
   * Pure function: returns engineering lifecycle stage details.
   */
  function getLifecycleStage(stageKey) {
    if (!stageKey || typeof stageKey !== 'string') {
      return LIFECYCLE_STAGES.specification;
    }
    return LIFECYCLE_STAGES[stageKey.trim().toLowerCase()] || LIFECYCLE_STAGES.specification;
  }

  /**
   * Pure function: validates contact form fields and returns structured result.
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
   * Positions the sliding pill inside a .segmented-controls container
   * across both single-row desktop and multi-row mobile grid layouts.
   */
  function updateSegmentedPill(container) {
    if (!container) {
      return;
    }
    var pill = container.querySelector('.segmented-pill-indicator');
    if (!pill) {
      pill = document.createElement('span');
      pill.className = 'segmented-pill-indicator';
      pill.setAttribute('aria-hidden', 'true');
      container.appendChild(pill);
    }

    var activeBtn =
      container.querySelector('[aria-selected="true"]') ||
      container.querySelector('[aria-pressed="true"]') ||
      container.querySelector('.is-active');

    if (!activeBtn) {
      container.classList.remove('has-pill');
      return;
    }

    container.classList.add('has-pill');
    var offsetLeft = activeBtn.offsetLeft;
    var offsetTop = activeBtn.offsetTop;
    var width = activeBtn.offsetWidth;
    var height = activeBtn.offsetHeight;
    pill.style.width = width + 'px';
    pill.style.height = height + 'px';
    pill.style.transform = 'translate3d(' + offsetLeft + 'px, ' + offsetTop + 'px, 0)';
  }

  function initAllSegmentedPills() {
    var containers = Array.prototype.slice.call(
      document.querySelectorAll('.segmented-controls')
    );
    containers.forEach(function (container) {
      updateSegmentedPill(container);
    });

    window.addEventListener('resize', function () {
      containers.forEach(function (container) {
        updateSegmentedPill(container);
      });
    });
  }

  /**
   * Toast notification helper.
   */
  var toastTimer = null;
  function showToast(message) {
    if (typeof document === 'undefined') {
      return;
    }
    var toast = document.querySelector('[data-ui-toast]');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ui-toast';
      toast.setAttribute('data-ui-toast', '');
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3600);
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
   * Initializes WAI-ARIA Tabs component ([data-ui-tabs]) with sliding pill and keyboard navigation.
   */
  function initTabs() {
    var tabGroups = Array.prototype.slice.call(
      document.querySelectorAll('[data-ui-tabs]')
    );

    tabGroups.forEach(function (group) {
      var tablist = group.querySelector('[role="tablist"]');
      var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(group.querySelectorAll('[role="tabpanel"]'));

      if (!tablist || tabs.length === 0) {
        return;
      }

      function activateTab(targetTab, shouldFocus) {
        var targetPanelId = targetTab.getAttribute('aria-controls');

        tabs.forEach(function (tab) {
          var isSelected = tab === targetTab;
          tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
          tab.setAttribute('tabindex', isSelected ? '0' : '-1');
          tab.classList.toggle('is-active', isSelected);
        });

        panels.forEach(function (panel) {
          if (panel.id === targetPanelId) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
        });

        if (tablist.classList.contains('segmented-controls')) {
          updateSegmentedPill(tablist);
        }

        if (shouldFocus) {
          targetTab.focus();
        }
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
          activateTab(tab, false);
        });

        tab.addEventListener('keydown', function (event) {
          var nextIndex = null;
          if (event.key === 'ArrowRight') {
            nextIndex = (index + 1) % tabs.length;
          } else if (event.key === 'ArrowLeft') {
            nextIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (event.key === 'Home') {
            nextIndex = 0;
          } else if (event.key === 'End') {
            nextIndex = tabs.length - 1;
          }
          if (nextIndex !== null) {
            event.preventDefault();
            activateTab(tabs[nextIndex], true);
          }
        });
      });

      if (tablist.classList.contains('segmented-controls')) {
        updateSegmentedPill(tablist);
      }
    });
  }

  /**
   * Initializes accordion disclosure components ([data-ui-accordion]).
   */
  function initAccordions() {
    var accordions = Array.prototype.slice.call(
      document.querySelectorAll('[data-ui-accordion]')
    );

    accordions.forEach(function (accordion) {
      var triggers = Array.prototype.slice.call(
        accordion.querySelectorAll('.ui-accordion-trigger')
      );

      triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var isExpanded = trigger.getAttribute('aria-expanded') === 'true';
          var panelId = trigger.getAttribute('aria-controls');
          var panel = panelId ? document.getElementById(panelId) : null;

          triggers.forEach(function (otherTrigger) {
            if (otherTrigger !== trigger) {
              otherTrigger.setAttribute('aria-expanded', 'false');
              var otherId = otherTrigger.getAttribute('aria-controls');
              var otherPanel = otherId ? document.getElementById(otherId) : null;
              if (otherPanel) {
                otherPanel.classList.remove('is-open');
              }
            }
          });

          var nextState = !isExpanded;
          trigger.setAttribute('aria-expanded', nextState ? 'true' : 'false');
          if (panel) {
            panel.classList.toggle('is-open', nextState);
          }
        });
      });
    });
  }

  /**
   * Helper: safely renders specification items without innerHTML.
   */
  function renderSpecItems(container, items) {
    if (!container || !Array.isArray(items)) {
      return;
    }
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    items.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'spec-item';
      var term = document.createElement('span');
      term.className = 'spec-term';
      term.textContent = item.term;
      var detail = document.createElement('span');
      detail.className = 'spec-detail';
      detail.textContent = item.detail;
      row.appendChild(term);
      row.appendChild(detail);
      container.appendChild(row);
    });
  }

  /**
   * Initializes interactive 4-Stage Engineering Lifecycle Stepper on about.html.
   */
  function initLifecycleStepper() {
    var stepper = document.querySelector('[data-lifecycle-stepper]');
    if (!stepper) {
      return;
    }

    var buttons = Array.prototype.slice.call(
      stepper.querySelectorAll('[data-stage-key]')
    );
    var stageIndexEl = document.getElementById('lifecycle-stage-index');
    var stageTitleEl = document.getElementById('lifecycle-stage-title');
    var stageDescEl = document.getElementById('lifecycle-stage-desc');
    var stageListEl = document.getElementById('lifecycle-stage-deliverables');

    function selectStage(stageKey) {
      var data = getLifecycleStage(stageKey);
      buttons.forEach(function (btn) {
        var isMatch = btn.getAttribute('data-stage-key') === stageKey;
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      if (stageIndexEl) stageIndexEl.textContent = data.index;
      if (stageTitleEl) stageTitleEl.textContent = data.title;
      if (stageDescEl) stageDescEl.textContent = data.description;
      renderSpecItems(stageListEl, data.deliverables);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectStage(btn.getAttribute('data-stage-key'));
      });
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

      updateSegmentedPill(filterContainer);

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

    var params = new URLSearchParams(window.location.search);
    var initialCategory = params.get('category');
    if (initialCategory) {
      applyFilter(initialCategory);
    } else {
      updateSegmentedPill(filterContainer);
    }
  }

  /**
   * Initializes interactive Project Blueprint Modal (<dialog>) on portfolio.html.
   */
  function initProjectModal() {
    var modal = document.getElementById('project-blueprint-modal');
    if (!modal) {
      return;
    }

    var triggers = Array.prototype.slice.call(
      document.querySelectorAll('[data-open-blueprint]')
    );
    var closeBtn = modal.querySelector('[data-close-modal]');
    var disciplineEl = document.getElementById('modal-project-discipline');
    var titleEl = document.getElementById('modal-project-title');
    var summaryEl = document.getElementById('modal-project-summary');
    var metersEl = document.getElementById('modal-project-meters');
    var specsEl = document.getElementById('modal-project-specs');
    var ctaLinkEl = document.getElementById('modal-project-cta');
    var lastFocusedTrigger = null;

    function openBlueprint(projectId, triggerEl) {
      var data = getProjectBlueprint(projectId);
      if (!data) {
        return;
      }
      lastFocusedTrigger = triggerEl || null;

      if (disciplineEl) disciplineEl.textContent = data.discipline + ' · Architectural Blueprint';
      if (titleEl) titleEl.textContent = data.title;
      if (summaryEl) summaryEl.textContent = data.summary;

      if (metersEl) {
        while (metersEl.firstChild) {
          metersEl.removeChild(metersEl.firstChild);
        }
        data.metrics.forEach(function (m) {
          var row = document.createElement('div');
          row.className = 'ui-meter-row';
          var labels = document.createElement('div');
          labels.className = 'ui-meter-labels';
          var lblSpan = document.createElement('span');
          lblSpan.textContent = m.label;
          var valSpan = document.createElement('span');
          valSpan.textContent = m.value;
          labels.appendChild(lblSpan);
          labels.appendChild(valSpan);

          var track = document.createElement('div');
          track.className = 'ui-meter-track';
          var fill = document.createElement('div');
          fill.className = 'ui-meter-fill';
          fill.style.width = m.fill;
          track.appendChild(fill);

          row.appendChild(labels);
          row.appendChild(track);
          metersEl.appendChild(row);
        });
      }

      renderSpecItems(specsEl, data.specs);

      if (ctaLinkEl) {
        ctaLinkEl.setAttribute(
          'href',
          'contact.html?service=' + encodeURIComponent(data.serviceParam)
        );
      }

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    }

    function closeModal() {
      if (typeof modal.close === 'function' && modal.open) {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
      if (lastFocusedTrigger) {
        lastFocusedTrigger.focus();
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var id = trigger.getAttribute('data-open-blueprint');
        openBlueprint(id, trigger);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (event) {
      var rect = modal.getBoundingClientRect();
      var clickedInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!clickedInDialog) {
        closeModal();
      }
    });
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
      showToast('Inquiry validated in static demonstration mode.');
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
   * Initializes radial spotlight & subtle pointer tracking on surface cards.
   */
  function initSpotlightCards() {
    var prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return;
    }

    var cards = Array.prototype.slice.call(
      document.querySelectorAll('.surface-card, .project-card')
    );

    cards.forEach(function (card) {
      card.setAttribute('data-spotlight-card', '');

      card.addEventListener('mousemove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        card.style.setProperty('--spot-x', x + 'px');
        card.style.setProperty('--spot-y', y + 'px');
        card.style.setProperty('--spot-opacity', '1');
      });

      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--spot-opacity', '0');
      });
    });
  }

  /**
   * Initializes scroll-triggered staggered reveals and animated metric counters.
   */
  function initScrollRevealAndCounters() {
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

    // Assign subtle stagger delays to sibling cards inside grids
    var grids = Array.prototype.slice.call(
      document.querySelectorAll('.bento-grid, .portfolio-grid, .grid-2, .grid-3, .grid-4')
    );
    grids.forEach(function (grid) {
      var children = Array.prototype.slice.call(
        grid.querySelectorAll('.reveal-on-scroll')
      );
      children.forEach(function (child, idx) {
        child.style.setProperty('--reveal-delay', idx * 70 + 'ms');
      });
    });

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
    initAllSegmentedPills();
    initTabs();
    initAccordions();
    initLifecycleStepper();
    initPortfolioFilters();
    initProjectModal();
    initContactForm();
    initSpotlightCards();
    initScrollRevealAndCounters();
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
    getProjectBlueprint: getProjectBlueprint,
    getLifecycleStage: getLifecycleStage,
    validateContactPayload: validateContactPayload,
    init: init
  };
});
