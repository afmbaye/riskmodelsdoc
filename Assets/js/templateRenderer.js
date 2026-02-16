/**
 * Template Renderer - Renders JSON data into HTML components
 */
const TemplateRenderer = {
  /**
   * Translate helper - shorthand for LanguageManager.t()
   * @param {Object|string} obj - Bilingual object
   * @returns {string} Translated text
   */
  t(obj) {
    if (typeof LanguageManager !== 'undefined') {
      return LanguageManager.t(obj);
    }
    // Fallback if LanguageManager not loaded
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj['fr'] || obj['en'] || '';
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Render a stat card
   * @param {Object} stat - Stat data { icon, value, label }
   * @returns {string} HTML string
   */
  renderStatCard(stat) {
    return `
      <div class="stat-card">
        <div class="stat-icon">
          <i data-feather="${stat.icon || 'activity'}"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${this.escapeHtml(String(stat.value))}</div>
          <div class="stat-label">${this.escapeHtml(this.t(stat.label))}</div>
        </div>
      </div>
    `;
  },

  /**
   * Render a tab preview card
   * @param {Object} tab - Tab data
   * @returns {string} HTML string
   */
  renderTabCard(tab) {
    return `
      <div class="tab-card" data-tab-id="${tab.id}">
        <div class="tab-card-image">
          <img src="${tab.screenshot}" alt="${this.escapeHtml(tab.name)}" loading="lazy">
        </div>
        <div class="tab-card-content">
          <h3 class="tab-card-title">${this.escapeHtml(tab.name)}</h3>
          <p class="tab-card-description">${this.escapeHtml(this.t(tab.description))}</p>
        </div>
      </div>
    `;
  },

  /**
   * Render a data source card
   * @param {Object} source - Data source data
   * @returns {string} HTML string
   */
  renderDataSourceCard(source) {
    return `
      <div class="source-card">
        <div class="source-icon">
          <i data-feather="${source.icon || 'file'}"></i>
        </div>
        <div class="source-content">
          <h4 class="source-name">${this.escapeHtml(this.t(source.name))}</h4>
          <span class="source-type">${source.type}</span>
          <p class="source-description">${this.escapeHtml(this.t(source.description))}</p>
        </div>
      </div>
    `;
  },

  /**
   * Render a table row for data model tables
   * @param {Object} table - Table data
   * @param {string} tableType - 'fact' or 'dimension'
   * @returns {string} HTML string
   */
  renderTableCard(table, tableType) {
    const badgeClass = tableType === 'fact' ? 'badge-primary' : 'badge-secondary';
    const badgeText = tableType === 'fact' ? 'Fact' : 'Dimension';

    return `
      <div class="table-card">
        <div class="table-card-header">
          <div class="table-icon">
            <i data-feather="${table.icon || 'table'}"></i>
          </div>
          <div class="table-info">
            <h4 class="table-name">${this.escapeHtml(table.name)}</h4>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
        </div>
        <div class="table-card-body">
          <p class="table-description">${this.escapeHtml(this.t(table.description))}</p>
          ${table.screenshot ? `
            <div class="table-screenshot">
              <img src="${table.screenshot}" alt="${this.escapeHtml(table.name)}" loading="lazy">
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render a relationship row
   * @param {Object} rel - Relationship data
   * @returns {string} HTML string
   */
  renderRelationshipRow(rel) {
    return `
      <div class="relationship-row">
        <div class="relationship-tables">
          <span class="table-name">${this.escapeHtml(rel.from.table)}</span>
          <span class="column-name">[${this.escapeHtml(rel.from.column)}]</span>
          <span class="relationship-arrow">
            <i data-feather="arrow-right"></i>
            <span class="cardinality">${rel.cardinality}</span>
          </span>
          <span class="table-name">${this.escapeHtml(rel.to.table)}</span>
          <span class="column-name">[${this.escapeHtml(rel.to.column)}]</span>
        </div>
        <p class="relationship-description">${this.escapeHtml(this.t(rel.description))}</p>
      </div>
    `;
  },

  /**
   * Render a KPI row for the table
   * @param {Object} kpi - KPI data
   * @returns {string} HTML string
   */
  renderKpiRow(kpi) {
    const visualTags = (kpi.visuals || []).map(v =>
      `<span class="visual-tag">${this.escapeHtml(v)}</span>`
    ).join('');

    return `
      <tr data-kpi-id="${kpi.id}">
        <td class="kpi-name">${this.escapeHtml(this.t(kpi.name))}</td>
        <td class="kpi-variable">${this.escapeHtml(kpi.variableName)}</td>
        <td class="kpi-description">${this.escapeHtml(this.t(kpi.description))}</td>
        <td class="kpi-unit">${this.escapeHtml(kpi.unit)}</td>
        <td class="kpi-visuals">${visualTags}</td>
        <td class="kpi-action">
          <button class="view-formula-btn" onclick="showKpiFormula('${kpi.id}')">
            <i data-feather="code"></i>
            <span>${this.t({ fr: 'Voir formule', en: 'View formula' })}</span>
          </button>
        </td>
      </tr>
    `;
  },

  /**
   * Render a visual card
   * @param {Object} visual - Visual data
   * @returns {string} HTML string
   */
  renderVisualCard(visual) {
    const kpiTags = (visual.kpis || []).map(k =>
      `<span class="kpi-tag">${this.escapeHtml(k)}</span>`
    ).join('');

    const filtersList = (visual.filters || []).map(f =>
      `<li><strong>${this.escapeHtml(this.t(f.name))}</strong>: ${this.escapeHtml(this.t(f.description))}</li>`
    ).join('');

    const colorLegend = visual.colorCoding ? `
      <div class="color-legend">
        <h5>${this.escapeHtml(this.t(visual.colorCoding.description))}</h5>
        <div class="legend-items">
          ${visual.colorCoding.legend.map(item => `
            <div class="legend-item">
              <span class="legend-color" style="background-color: ${item.color}"></span>
              <span class="legend-label">${this.escapeHtml(this.t(item.label))}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div class="visual-card" id="visual-${visual.id}">
        <div class="visual-header">
          <h3 class="visual-name">${this.escapeHtml(visual.name)}</h3>
        </div>
        <div class="visual-screenshot">
          <img src="${visual.screenshot}" alt="${this.escapeHtml(visual.name)}" loading="lazy">
        </div>
        <div class="visual-content">
          <div class="visual-section">
            <h4>${this.t({ fr: 'Objectif', en: 'Objective' })}</h4>
            <p>${this.escapeHtml(this.t(visual.objective))}</p>
          </div>
          <div class="visual-section">
            <h4>${this.t({ fr: 'KPIs utilises', en: 'KPIs used' })}</h4>
            <div class="kpi-tags">${kpiTags}</div>
          </div>
          <div class="visual-section">
            <h4>${this.t({ fr: 'Filtres disponibles', en: 'Available filters' })}</h4>
            <ul class="filters-list">${filtersList}</ul>
          </div>
          <div class="visual-section">
            <h4>${this.t({ fr: 'Comment lire', en: 'How to read' })}</h4>
            <p>${this.escapeHtml(this.t(visual.howToRead))}</p>
          </div>
          ${colorLegend}
        </div>
      </div>
    `;
  },

  /**
   * Render an update step
   * @param {Object} step - Step data
   * @param {boolean} isActive - Whether step is active
   * @returns {string} HTML string
   */
  renderUpdateStep(step, isActive = false) {
    const activeClass = isActive ? 'active' : '';
    const firstTimeOnlyBadge = step.isFirstTimeOnly ?
      `<span class="badge badge-info">${this.t({ fr: 'Premiere fois uniquement', en: 'First time only' })}</span>` : '';

    const tasksList = (step.tasks || []).map(task => {
      const items = task.items ? `
        <ul class="task-items">
          ${task.items.map(item => `<li>${this.escapeHtml(this.t(item))}</li>`).join('')}
        </ul>
      ` : '';
      const details = task.details ? `<p class="task-details">${this.escapeHtml(this.t(task.details))}</p>` : '';

      return `
        <div class="task">
          <p class="task-description">${this.escapeHtml(this.t(task.description))}</p>
          ${details}
          ${items}
        </div>
      `;
    }).join('');

    const warningsList = (step.warnings || []).map(w =>
      `<li><i data-feather="alert-triangle"></i> ${this.escapeHtml(this.t(w))}</li>`
    ).join('');

    const warnings = warningsList ? `
      <div class="step-warnings">
        <ul>${warningsList}</ul>
      </div>
    ` : '';

    return `
      <div class="step ${activeClass}" data-step="${step.order}">
        <div class="step-header">
          <div class="step-number">${step.order}</div>
          <div class="step-title-wrapper">
            <h3 class="step-title">${this.escapeHtml(this.t(step.title))}</h3>
            ${firstTimeOnlyBadge}
          </div>
        </div>
        <div class="step-content">
          <p class="step-description">${this.escapeHtml(this.t(step.description))}</p>
          <div class="step-tasks">${tasksList}</div>
          ${step.screenshot ? `
            <div class="step-screenshot">
              <img src="${step.screenshot}" alt="${this.escapeHtml(this.t(step.title))}" loading="lazy">
            </div>
          ` : ''}
          ${warnings}
        </div>
      </div>
    `;
  },

  /**
   * Render a glossary term
   * @param {Object} term - Term data
   * @returns {string} HTML string
   */
  renderGlossaryTerm(term) {
    const modelTags = (term.relatedModels || []).map(m =>
      `<span class="model-tag">${this.escapeHtml(m)}</span>`
    ).join('');

    return `
      <div class="glossary-term" id="term-${term.id}">
        <h3 class="term-name">${this.escapeHtml(this.t(term.term))}</h3>
        <p class="term-definition">${this.escapeHtml(this.t(term.definition))}</p>
        ${modelTags ? `<div class="term-models">${modelTags}</div>` : ''}
      </div>
    `;
  },

  /**
   * Render a model row for home page table
   * @param {Object} model - Model data
   * @param {Array} categories - All categories
   * @returns {string} HTML string
   */
  renderModelRow(model, categories) {
    const categoryTags = (model.categories || []).map(catId => {
      const cat = categories.find(c => c.id === catId);
      if (!cat) return '';
      return `<span class="category-tag" style="background-color: ${cat.color}20; color: ${cat.color}">${this.escapeHtml(this.t(cat.label))}</span>`;
    }).join('');

    const statusBadge = model.isActive ?
      `<span class="badge badge-success">${this.t({ fr: 'Actif', en: 'Active' })}</span>` :
      `<span class="badge badge-secondary">${this.t({ fr: 'A venir', en: 'Coming soon' })}</span>`;

    const docLink = model.isActive ?
      `<a href="pages/documentation/?model=${model.id}&section=overview" class="doc-link">${this.t({ fr: 'Consulter', en: 'View' })}</a>` :
      `<span class="doc-link disabled">${this.t({ fr: 'Bientôt', en: 'Soon' })}</span>`;

    return `
      <tr data-model-id="${model.id}" data-categories="${(model.categories || []).join(',')}">
        <td class="model-name">${this.escapeHtml(this.t(model.name))}</td>
        <td class="model-description">${this.escapeHtml(this.t(model.description))}</td>
        <td class="model-categories">${categoryTags}</td>
        <td class="model-frequency">${this.escapeHtml(this.t(model.updateFrequency))}</td>
        <td class="model-status">${statusBadge}</td>
        <td class="model-fabric">
          <a href="${model.fabricLink}" target="_blank" class="fabric-link">
            <i data-feather="external-link"></i>
            Fabric
          </a>
        </td>
        <td class="model-doc">${docLink}</td>
      </tr>
    `;
  },

  /**
   * Initialize Feather icons after rendering
   */
  refreshIcons() {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TemplateRenderer;
}
