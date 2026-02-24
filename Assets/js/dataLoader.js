/**
 * Data Loader - Handles fetching and caching JSON data files
 */
const DataLoader = {
  cache: {},
  basePath: '',

  /**
   * Initialize with base path (for GitHub Pages compatibility)
   * @param {string} basePath - Base path for data files
   */
  init(basePath = '') {
    this.basePath = basePath;
    // Detect if running on GitHub Pages and adjust base path
    if (window.location.hostname.includes('github.io')) {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 1 && pathParts[1]) {
        this.basePath = '/' + pathParts[1];
      }
    }
  },

  /**
   * Get the correct path for a data file
   * @param {string} path - Relative path to data file
   * @returns {string} Full path
   */
  getPath(path) {
    // For file:// protocol (local development), use relative path from HTML file location
    if (window.location.protocol === 'file:') {
      // Get the directory of the current HTML file
      const currentPath = window.location.pathname;
      const lastSlash = currentPath.lastIndexOf('/');
      const currentDir = currentPath.substring(0, lastSlash + 1);

      // Check if we're in a subdirectory (like /pages/documentation/)
      if (currentDir.includes('/pages/') || currentDir.includes('/data-flow/') || currentDir.includes('/glossary/')) {
        // Count directory depth from project root
        const projectRoot = currentDir.split('/pages/')[0].split('/data-flow/')[0].split('/glossary/')[0];
        const relativePath = currentDir.replace(projectRoot, '');
        const depth = (relativePath.match(/\//g) || []).length;
        const prefix = '../'.repeat(depth);
        return prefix + path;
      }
      // We're at root level
      return path;
    }

    // For http/https (web server), calculate relative path based on URL path depth
    // Strip the HTML filename if present, then get the directory path
    const currentPath = window.location.pathname.replace(/\/[^/]+\.html$/, '/');
    // Split into non-empty segments, ignoring trailing slash
    const segments = currentPath.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean);
    // On GitHub Pages, the first segment is the repo name (e.g. "riskmodelsdoc") — treat it as root
    const isGithubPages = window.location.hostname.includes('github.io');
    const depth = isGithubPages ? Math.max(0, segments.length - 1) : segments.length;
    const prefix = '../'.repeat(depth);
    return prefix + path;
  },

  /**
   * Fetch JSON data with caching
   * @param {string} path - Path to JSON file
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Promise<Object>} Parsed JSON data
   */
  async fetch(path, useCache = true) {
    const fullPath = this.getPath(path);

    // Check cache first
    if (useCache && this.cache[fullPath]) {
      return this.cache[fullPath];
    }

    console.log('[DataLoader] Fetching:', fullPath);

    try {
      const response = await fetch(fullPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Cache the result
      if (useCache) {
        this.cache[fullPath] = data;
      }

      console.log('[DataLoader] Loaded successfully:', fullPath);
      return data;
    } catch (error) {
      console.error(`[DataLoader] Error loading data from ${fullPath}:`, error);
      // For file:// protocol, provide helpful message
      if (window.location.protocol === 'file:') {
        console.error('[DataLoader] Note: Loading JSON via file:// protocol may be blocked by browser security (CORS). Try using a local web server instead (e.g., "npx serve" or "python -m http.server").');
      }
      throw error;
    }
  },

  /**
   * Get model ID from URL parameter
   * @returns {string|null} Model ID or null
   */
  getModelIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('model');
  },

  /**
   * Get site configuration
   * @returns {Promise<Object>} Site config
   */
  async getSiteConfig() {
    return this.fetch('data/site.json');
  },

  /**
   * Get categories
   * @returns {Promise<Object>} Categories data
   */
  async getCategories() {
    return this.fetch('data/categories.json');
  },

  /**
   * Get models index
   * @returns {Promise<Object>} Models list
   */
  async getModelsIndex() {
    return this.fetch('data/models/index.json');
  },

  /**
   * Get glossary
   * @returns {Promise<Object>} Glossary data
   */
  async getGlossary() {
    return this.fetch('data/glossary.json');
  },

  /**
   * Get data flow
   * @returns {Promise<Object>} Data flow schema
   */
  async getDataFlow() {
    return this.fetch('data/data-flow.json');
  },

  /**
   * Get model overview
   * @param {string} modelId - Model ID
   * @returns {Promise<Object>} Model overview data
   */
  async getModelOverview(modelId) {
    return this.fetch(`data/models/${modelId}/overview.json`);
  },

  /**
   * Get model data model
   * @param {string} modelId - Model ID
   * @returns {Promise<Object>} Model data model
   */
  async getModelDataModel(modelId) {
    return this.fetch(`data/models/${modelId}/data-model.json`);
  },

  /**
   * Get model KPIs
   * @param {string} modelId - Model ID
   * @returns {Promise<Object>} Model KPIs data
   */
  async getModelKpis(modelId) {
    return this.fetch(`data/models/${modelId}/kpis.json`);
  },

  /**
   * Get model visuals
   * @param {string} modelId - Model ID
   * @returns {Promise<Object>} Model visuals data
   */
  async getModelVisuals(modelId) {
    return this.fetch(`data/models/${modelId}/visuals.json`);
  },

  /**
   * Get model update process
   * @param {string} modelId - Model ID
   * @returns {Promise<Object>} Model update process data
   */
  async getModelUpdateProcess(modelId) {
    return this.fetch(`data/models/${modelId}/update-process.json`);
  },

  /**
   * Get all data for a model
   * @param {string} modelId - Model ID
   * @returns {Promise<Object>} All model data
   */
  async getFullModelData(modelId) {
    const [overview, dataModel, kpis, visuals, updateProcess] = await Promise.all([
      this.getModelOverview(modelId),
      this.getModelDataModel(modelId),
      this.getModelKpis(modelId),
      this.getModelVisuals(modelId),
      this.getModelUpdateProcess(modelId)
    ]);

    return {
      overview,
      dataModel,
      kpis,
      visuals,
      updateProcess
    };
  },

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
  }
};

// Auto-initialize on script load
document.addEventListener('DOMContentLoaded', () => {
  DataLoader.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataLoader;
}
