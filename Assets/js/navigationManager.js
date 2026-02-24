/**
 * Navigation Manager - Handles header, sidebar, and navigation logic
 */
const NavigationManager = {
  currentModel: null,
  currentPage: null,
  siteConfig: null,

  /**
   * Initialize navigation
   */
  async init() {
    try {
      // Determine current page from URL path
      this.currentPage = this.getCurrentPageFromPath();

      // Get model ID from URL if on documentation page
      const modelId = DataLoader.getModelIdFromUrl();

      // Load site config
      this.siteConfig = await DataLoader.getSiteConfig();

      // If we have a model ID, load model info
      if (modelId) {
        try {
          const overview = await DataLoader.getModelOverview(modelId);
          this.currentModel = {
            id: modelId,
            name: overview.name,
            ...overview
          };
        } catch (e) {
          // Model not found - redirect to home with error
          console.error('Model not found:', modelId);
          this.showModelNotFound(modelId);
          return;
        }
      }

      // Render navigation components
      this.renderHeader();
      if (this.currentModel) {
        this.renderSidebar();
      }
      this.setupEventListeners();
      this.highlightActiveLinks();

      // Initialize Feather icons
      if (typeof feather !== 'undefined') {
        feather.replace();
      }
    } catch (error) {
      console.error('Navigation initialization error:', error);
    }
  },

  /**
   * Get current page from URL path
   * @returns {string} Page identifier
   */
  getCurrentPageFromPath() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);

    // Check for known pages
    if (parts.includes('overview')) return 'overview';
    if (parts.includes('data-model')) return 'data-model';
    if (parts.includes('kpi-dictionary')) return 'kpi-dictionary';
    if (parts.includes('visuals')) return 'visuals';
    if (parts.includes('update')) return 'update';
    if (parts.includes('data-flow')) return 'data-flow';
    if (parts.includes('glossary')) return 'glossary';

    // Default to home
    return 'home';
  },

  /**
   * Get relative path prefix based on current location
   * @returns {string} Path prefix (e.g., '../' or '../../')
   */
  getPathPrefix() {
    const path = window.location.pathname;

    // For file:// protocol (local development)
    if (window.location.protocol === 'file:') {
      const lastSlash = path.lastIndexOf('/');
      const currentDir = path.substring(0, lastSlash + 1);

      // Check if we're in a subdirectory
      if (currentDir.includes('/pages/')) {
        // pages/documentation/ = 2 levels deep
        return '../../';
      }
      if (currentDir.includes('/data-flow/') || currentDir.includes('/glossary/')) {
        // data-flow/ or glossary/ = 1 level deep
        return '../';
      }
      // We're at root level
      return '';
    }

    // For http/https, calculate based on URL path segments
    const cleanPath = path.replace(/\/[^/]+\.html$/, '/').replace(/^\//, '').replace(/\/$/, '');
    const segments = cleanPath.split('/').filter(Boolean);
    // On GitHub Pages the first segment is the repo name — treat it as root
    const isGithubPages = window.location.hostname.includes('github.io');
    const depth = isGithubPages ? Math.max(0, segments.length - 1) : segments.length;
    return '../'.repeat(depth);
  },

  /**
   * Render header navigation
   */
  renderHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const t = LanguageManager.t.bind(LanguageManager);
    const prefix = this.getPathPrefix();
    const currentLang = LanguageManager.getLanguageInfo();
    const allLangs = LanguageManager.getAllLanguages();

    header.innerHTML = `
      <div class="header-brand">
        <a href="${prefix}index.html">
          <img src="${prefix}Assets/Images/logos/baobab.png" alt="Baobab">
        </a>
      </div>
      <nav class="header-nav">
        <a href="${prefix}index.html" class="nav-link ${this.currentPage === 'home' ? 'active' : ''}" data-page="home">
          ${t(this.siteConfig?.navigation?.items?.find(i => i.id === 'home')?.label) || 'Accueil'}
        </a>
        <a href="${prefix}data-flow/index.html" class="nav-link ${this.currentPage === 'data-flow' ? 'active' : ''}" data-page="data-flow">
          ${t(this.siteConfig?.navigation?.items?.find(i => i.id === 'data-flow')?.label) || 'Flux de donnees'}
        </a>
        <div class="nav-dropdown">
          <button class="nav-dropdown-button" id="docButton" aria-expanded="false">
            ${t(this.siteConfig?.navigation?.items?.find(i => i.id === 'documentation')?.label) || 'Documentation'}
            <i data-feather="chevron-down"></i>
          </button>
          <div class="nav-dropdown-content" id="docDropdown">
            <div class="dropdown-section">
              <span class="dropdown-title">${t({ fr: 'Modeles', en: 'Models' })}</span>
              <div id="modelsDropdownList">
                <!-- Models will be loaded dynamically -->
              </div>
            </div>
          </div>
        </div>
        <a href="${prefix}glossary/index.html" class="nav-link ${this.currentPage === 'glossary' ? 'active' : ''}" data-page="glossary">
          ${t(this.siteConfig?.navigation?.items?.find(i => i.id === 'glossary')?.label) || 'Glossaire'}
        </a>
        <div class="language-selector">
          <button class="lang-button" id="langButton" aria-expanded="false">
            <img src="${currentLang.flag}" alt="${currentLang.flagAlt}" class="flag-icon">
            <span>${currentLang.name}</span>
            <i data-feather="chevron-down"></i>
          </button>
          <div class="lang-dropdown" id="langDropdown">
            ${allLangs.map(lang => `
              <a href="#" class="lang-option ${lang.code === LanguageManager.currentLanguage ? 'active' : ''}"
                 data-lang="${lang.code}">
                <img src="${lang.flag}" alt="${lang.flagAlt}" class="flag-icon">
                <span>${lang.name}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </nav>
    `;

    // Load models for dropdown
    this.loadModelsDropdown(prefix);
  },

  /**
   * Load models into dropdown
   * @param {string} prefix - Path prefix
   */
  async loadModelsDropdown(prefix) {
    try {
      const modelsData = await DataLoader.getModelsIndex();
      const container = document.getElementById('modelsDropdownList');
      if (!container) return;

      const t = LanguageManager.t.bind(LanguageManager);

      container.innerHTML = modelsData.models
        .filter(m => m.isActive)
        .map(model => `
          <a href="${prefix}pages/documentation/?model=${model.id}&section=overview" class="dropdown-item">
            <i data-feather="chevron-right"></i>
            <span>${t(model.name)}</span>
          </a>
        `).join('');

      if (typeof feather !== 'undefined') {
        feather.replace();
      }
    } catch (error) {
      console.error('Error loading models dropdown:', error);
    }
  },

  /**
   * Render sidebar for documentation pages
   */
  renderSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || !this.currentModel) return;

    const t = LanguageManager.t.bind(LanguageManager);
    const modelId = this.currentModel.id;
    const prefix = this.getPathPrefix();

    const sections = this.siteConfig?.sidebar?.sections || [
      { id: 'overview', label: { fr: 'Vue d\'ensemble', en: 'Overview' }, icon: 'home' },
      { id: 'data-model', label: { fr: 'Modele de donnees', en: 'Data Model' }, icon: 'database' },
      { id: 'kpi-dictionary', label: { fr: 'Dictionnaire des KPIs', en: 'KPI Dictionary' }, icon: 'book-open' },
      { id: 'visuals', label: { fr: 'Visuels', en: 'Visuals' }, icon: 'bar-chart-2' },
      { id: 'update', label: { fr: 'Mise a jour', en: 'Update' }, icon: 'refresh-cw' }
    ];

    sidebar.innerHTML = `
      <div class="sidebar-title">
        <h2>${t(this.currentModel.name)}</h2>
      </div>
      <nav class="nav-menu">
        ${sections.map(section => `
          <a href="${prefix}pages/${section.id}/index.html?model=${modelId}"
             class="nav-item ${this.currentPage === section.id ? 'active' : ''}"
             data-page="${section.id}">
            <i data-feather="${section.icon}"></i>
            <span class="label">${t(section.label)}</span>
          </a>
        `).join('')}
      </nav>
    `;
  },

  /**
   * Setup event listeners for navigation
   */
  setupEventListeners() {
    // Documentation dropdown toggle
    const docButton = document.getElementById('docButton');
    const docDropdown = document.getElementById('docDropdown');

    if (docButton && docDropdown) {
      docButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = docButton.getAttribute('aria-expanded') === 'true';
        docButton.setAttribute('aria-expanded', !isExpanded);
        docDropdown.classList.toggle('show');
      });
    }

    // Language dropdown toggle
    const langButton = document.getElementById('langButton');
    const langDropdown = document.getElementById('langDropdown');

    if (langButton && langDropdown) {
      langButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = langButton.getAttribute('aria-expanded') === 'true';
        langButton.setAttribute('aria-expanded', !isExpanded);
        langDropdown.classList.toggle('show');
      });

      // Language selection
      langDropdown.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = option.dataset.lang;
          LanguageManager.switchLanguage(lang);
        });
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      if (docDropdown) docDropdown.classList.remove('show');
      if (langDropdown) langDropdown.classList.remove('show');
      if (docButton) docButton.setAttribute('aria-expanded', 'false');
      if (langButton) langButton.setAttribute('aria-expanded', 'false');
    });

    // Sidebar group toggles
    document.querySelectorAll('.group-header').forEach(header => {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isExpanded);
        header.parentElement.classList.toggle('collapsed');
      });
    });
  },

  /**
   * Highlight active navigation links
   */
  highlightActiveLinks() {
    // Header nav links
    document.querySelectorAll('.header-nav .nav-link').forEach(link => {
      const page = link.dataset.page;
      if (page === this.currentPage) {
        link.classList.add('active');
      }
    });

    // Sidebar nav items
    document.querySelectorAll('.sidebar .nav-item').forEach(link => {
      const page = link.dataset.page;
      if (page === this.currentPage) {
        link.classList.add('active');
      }
    });
  },

  /**
   * Show model not found page
   * @param {string} modelId - The model ID that wasn't found
   */
  showModelNotFound(modelId) {
    const main = document.querySelector('.main-content') || document.querySelector('main');
    if (!main) return;

    const t = LanguageManager.t.bind(LanguageManager);
    const prefix = this.getPathPrefix();

    main.innerHTML = `
      <div class="error-page">
        <div class="error-icon">
          <i data-feather="alert-circle"></i>
        </div>
        <h1>${t({ fr: 'Modele non trouve', en: 'Model not found' })}</h1>
        <p>${t({
          fr: `Le modele "${modelId}" n'existe pas ou n'est pas encore disponible.`,
          en: `The model "${modelId}" does not exist or is not yet available.`
        })}</p>
        <a href="${prefix}index.html" class="btn btn-primary">
          <i data-feather="home"></i>
          ${t({ fr: 'Retour a l\'accueil', en: 'Back to home' })}
        </a>
      </div>
    `;

    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  },

  /**
   * Update page title
   * @param {string} pageTitle - Page title to append
   */
  updatePageTitle(pageTitle) {
    const siteName = LanguageManager.t(this.siteConfig?.site?.name) || 'Documentation';
    const modelName = this.currentModel ? LanguageManager.t(this.currentModel.name) : '';

    if (modelName && pageTitle) {
      document.title = `${pageTitle} - ${modelName} | ${siteName}`;
    } else if (pageTitle) {
      document.title = `${pageTitle} | ${siteName}`;
    } else {
      document.title = siteName;
    }
  }
};

// Auto-initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
  NavigationManager.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationManager;
}
