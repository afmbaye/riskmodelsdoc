/**
 * Data Flow Page — handles model panel, source grid, category filters and detail slide panel.
 * Descriptions and columns are lazy-loaded per source from data/sources/[id].json.
 */
const DataFlowPage = {
  sources: [],
  models: [],
  categories: [],
  selectedModel: 'all',
  activeCategory: 'all',
  activeSourceCategory: 'all',
  searchQuery: '',

  // ── Init ──────────────────────────────────────────────
  async init() {
    try {
      const prefix = NavigationManager.getPathPrefix();
      const [dfData, modelsData, catsData] = await Promise.all([
        fetch(`${prefix}data/data-flow.json`).then(r => r.json()),
        fetch(`${prefix}data/models/index.json`).then(r => r.json()),
        fetch(`${prefix}data/categories.json`).then(r => r.json())
      ]);

      this.sources    = dfData.sources || [];
      this.models     = (modelsData.models || []).filter(m => m.isActive);
      this.categories = catsData.categories || [];

      this.renderAll();
      this.setupSearch();
      this.setupPanel();
      this.setupLanguageSwitch();

      document.getElementById('dfLoading').style.display = 'none';
      document.getElementById('dfApp').style.display = 'block';
      feather.replace();
    } catch (err) {
      console.error('DataFlowPage error:', err);
      document.getElementById('dfLoading').innerHTML = '<p style="color:var(--error-color)">Erreur de chargement.</p>';
    }
  },

  t(obj) {
    const lang = document.documentElement.lang || 'fr';
    if (!obj) return '';
    return obj[lang] || obj.fr || obj.en || '';
  },

  renderAll() {
    this.updateLabels();
    this.renderModelList();
    this.renderSourceCategoryFilter();
    this.renderSourceGrid();
  },

  updateLabels() {
    const t = this.t.bind(this);
    document.getElementById('pageTitle').textContent       = t({ fr: 'Data Flow', en: 'Data Flow' });
    document.getElementById('pageDescription').textContent = t({ fr: 'Vue d\'ensemble du flux de données depuis les fichiers sources jusqu\'aux modèles Power BI.', en: 'Overview of the data flow from source files to the Power BI models.' });
    document.getElementById('modelPanelTitle').textContent = t({ fr: 'Modèles', en: 'Models' });
    const s = document.getElementById('dfSrcSearch');
    if (s) s.placeholder = t({ fr: 'Rechercher une source…', en: 'Search a source…' });
  },

  // ── Source category filter (above source grid) ───────
  renderSourceCategoryFilter() {
    const t = this.t.bind(this);
    const srcCats = [
      { id: 'all',          label: { fr: 'Toutes', en: 'All' } },
      { id: 'data',         label: { fr: 'Data',   en: 'Data' } },
      { id: 'consolidated', label: { fr: 'Consolidated', en: 'Consolidated' } },
      { id: 'mapping',      label: { fr: 'Mappings', en: 'Mappings' } },
      { id: 'other',        label: { fr: 'Autre',  en: 'Other' } }
    ];

    const container = document.getElementById('dfSrcCatFilter');
    if (!container) return;

    container.innerHTML = srcCats.map(c =>
      `<button class="df-src-cat-chip${this.activeSourceCategory === c.id ? ' active' : ''}" data-src-cat="${c.id}">${t(c.label)}</button>`
    ).join('');

    container.addEventListener('click', e => {
      const btn = e.target.closest('.df-src-cat-chip');
      if (!btn) return;
      this.activeSourceCategory = btn.dataset.srcCat;
      this.renderSourceCategoryFilter();
      this.renderSourceGrid();
      feather.replace();
    });
  },

  // ── Model list (left panel) ───────────────────────────
  renderModelList() {
    const t = this.t.bind(this);

    const filteredModels = this.models;
    const totalSources   = this.sources.length;
    const allActive      = this.selectedModel === 'all';

    let html = `
      <div class="df-model-all-row${allActive ? ' active' : ''}" data-model="all" role="button" tabindex="0">
        <div class="df-model-row-icon"><i data-feather="grid"></i></div>
        <div class="df-model-row-text">
          <div class="df-model-row-name">${t({ fr: 'Tous les modèles', en: 'All models' })}</div>
        </div>
        <span class="df-model-src-count">${totalSources}</span>
      </div>`;

    filteredModels.forEach(model => {
      const srcCount = this.sources.filter(s => s.models.includes(model.id)).length;
      const isActive = this.selectedModel === model.id;
      const cats     = (model.categories || []).slice(0, 2).map(cid => {
        const c = this.categories.find(x => x.id === cid);
        return `<span class="df-model-row-cat">${c ? t(c.label) : cid}</span>`;
      }).join('');

      html += `
        <div class="df-model-row${isActive ? ' active' : ''}" data-model="${model.id}" role="button" tabindex="0">
          <div class="df-model-row-icon"><i data-feather="bar-chart-2"></i></div>
          <div class="df-model-row-text">
            <div class="df-model-row-name">${t(model.name)}</div>
            <div class="df-model-row-cats">${cats}</div>
          </div>
          <span class="df-model-src-count">${srcCount}</span>
        </div>`;
    });

    const list = document.getElementById('dfModelList');
    list.innerHTML = html;

    list.querySelectorAll('[data-model]').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedModel = el.dataset.model;
        this.renderModelList();
        this.renderSourceGrid();
        feather.replace();
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.selectedModel = el.dataset.model;
          this.renderModelList();
          this.renderSourceGrid();
          feather.replace();
        }
      });
    });
  },

  // ── Source grid (right area) ──────────────────────────
  renderSourceGrid() {
    const t = this.t.bind(this);
    const q = this.searchQuery.toLowerCase();

    // Filter by selected model
    let sources = this.selectedModel === 'all'
      ? this.sources
      : this.sources.filter(s => s.models.includes(this.selectedModel));

    // Filter by source category
    if (this.activeSourceCategory !== 'all') {
      sources = sources.filter(s => s.category === this.activeSourceCategory);
    }

    // Filter by search query (name + pattern only — description now in separate file)
    if (q) {
      sources = sources.filter(s =>
        t(s.name).toLowerCase().includes(q) ||
        (s.pattern || '').toLowerCase().includes(q)
      );
    }

    // Update header
    const model = this.models.find(m => m.id === this.selectedModel);
    if (this.selectedModel === 'all') {
      document.getElementById('srcAreaTitle').textContent    = t({ fr: 'Sources de données', en: 'Data Sources' });
      document.getElementById('srcAreaSubtitle').textContent = t({ fr: `${sources.length} sources au total`, en: `${sources.length} sources total` });
    } else if (model) {
      document.getElementById('srcAreaTitle').textContent    = t({ fr: `Sources — ${t(model.name)}`, en: `Sources — ${t(model.name)}` });
      document.getElementById('srcAreaSubtitle').textContent = t({ fr: `${sources.length} source${sources.length > 1 ? 's' : ''} identifiée${sources.length > 1 ? 's' : ''}`, en: `${sources.length} source${sources.length > 1 ? 's' : ''} identified` });
    }

    const catLabels = {
      data:         { fr: 'La Data',     en: 'La Data' },
      consolidated: { fr: 'Consolidé',   en: 'Consolidated' },
      mapping:      { fr: 'Mapping',     en: 'Mapping' },
      other:        { fr: 'Autre',       en: 'Other' }
    };

    const catIcons = {
      data:         'database',
      consolidated: 'layers',
      mapping:      'map',
      other:        'external-link'
    };

    let html = '';
    if (!sources.length) {
      html = `<div class="df-empty-state"><i data-feather="inbox"></i><p>${t({ fr: 'Aucune source pour ce filtre.', en: 'No source for this filter.' })}</p></div>`;
    } else {
      sources.forEach(src => {
        const cat         = src.category || 'other';
        const iconClass   = `df-icon-${cat}`;
        const badgeClass  = `df-badge-${cat}`;
        const badgeLabel  = t(catLabels[cat] || { fr: cat, en: cat });
        const featherIcon = catIcons[cat] || 'file';
        const granularity = t(src.granularity);
        const subcatBadge = (cat === 'other' && src.subcategory)
          ? `<span class="df-source-subcat">${src.subcategory}</span>`
          : '';

        html += `
          <div class="df-source-card" data-source-id="${src.id}">
            <div class="df-source-card-top">
              <div class="df-source-card-icon ${iconClass}">
                <i data-feather="${featherIcon}"></i>
              </div>
              <div class="df-source-card-meta">
                <div class="df-source-card-name">${t(src.name)}</div>
                <div class="df-source-card-pattern">${src.pattern || ''}</div>
                <span class="df-source-card-origin ${badgeClass}">${badgeLabel}</span>${subcatBadge}
              </div>
            </div>
            <div class="df-source-card-footer">
              <span class="df-source-card-granularity">${granularity ? '⊞ ' + granularity : ''}</span>
              <button class="df-source-card-detail-btn" data-source-id="${src.id}" aria-label="${t({ fr: 'Voir détails', en: 'View details' })}">
                ${t({ fr: 'Détails', en: 'Details' })} <i data-feather="chevron-right"></i>
              </button>
            </div>
          </div>`;
      });
    }

    const grid = document.getElementById('dfSourceGrid');
    grid.innerHTML = html;

    // Only detail button opens panel
    grid.querySelectorAll('.df-source-card-detail-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this.openPanel(btn.dataset.sourceId);
      });
    });
  },

  // ── Right slide panel ─────────────────────────────────
  setupPanel() {
    const close = () => {
      document.getElementById('sourcePanel').classList.remove('show');
      document.getElementById('panelOverlay').classList.remove('show');
    };
    document.getElementById('spClose').addEventListener('click', close);
    document.getElementById('panelOverlay').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  },

  async openPanel(sourceId) {
    const t   = this.t.bind(this);
    const src = this.sources.find(s => s.id === sourceId);
    if (!src) return;

    const cat = src.category || 'other';
    const catLabels = {
      data:         { fr: 'Depuis la Data (dossier partagé)',           en: 'From Data team (shared folder)' },
      consolidated: { fr: 'Données consolidées — équipe Risk/Analytics', en: 'Consolidated — Risk/Analytics team' },
      mapping:      { fr: 'Fichier de mapping (référentiel local)',      en: 'Mapping file (local reference)' },
      other:        { fr: src.subcategory ? `Autre — ${src.subcategory}` : 'Autre', en: src.subcategory ? `Other — ${src.subcategory}` : 'Other' }
    };

    const connectedModels = this.models.filter(m => src.models.includes(m.id));
    const modelChips      = connectedModels.map(m =>
      `<span class="df-panel-model-chip">${t(m.name)}</span>`
    ).join('') || '—';

    // Show panel immediately with skeleton
    document.getElementById('spTitle').textContent = t(src.name);
    document.getElementById('spBody').innerHTML = `
      <span class="df-panel-origin-badge ${cat}">${t(catLabels[cat])}</span>

      <p class="df-panel-desc" id="spDesc">
        <span style="display:inline-block;width:16px;height:16px;border:2px solid var(--border-color);border-top-color:var(--primary-color);border-radius:50%;animation:spin 0.8s linear infinite;vertical-align:middle;margin-right:6px;"></span>
        ${t({ fr: 'Chargement…', en: 'Loading…' })}
      </p>

      <div class="df-panel-section">
        <p class="df-panel-section-title">${t({ fr: 'Informations', en: 'Information' })}</p>
        <div class="df-panel-meta-grid">
          <div class="df-panel-meta-item">
            <div class="df-panel-meta-label">${t({ fr: 'Fréquence', en: 'Frequency' })}</div>
            <div class="df-panel-meta-value">${t(src.updateFrequency) || '—'}</div>
          </div>
          <div class="df-panel-meta-item">
            <div class="df-panel-meta-label">${t({ fr: 'Granularité', en: 'Granularity' })}</div>
            <div class="df-panel-meta-value">${t(src.granularity) || '—'}</div>
          </div>
        </div>
        <div style="margin-top:var(--spacing-3)">
          <div class="df-panel-meta-label">${t({ fr: 'Pattern fichier', en: 'File pattern' })}</div>
          <code class="df-panel-pattern">${src.pattern || '—'}</code>
        </div>
      </div>

      <div class="df-panel-section">
        <p class="df-panel-section-title">${t({ fr: 'Modèles utilisant cette source', en: 'Models using this source' })}</p>
        <div class="df-panel-model-chips">${modelChips}</div>
      </div>

      <div class="df-panel-section" id="spColumnsSection">
        <p class="df-panel-section-title">${t({ fr: 'Colonnes principales', en: 'Main columns' })}</p>
        <div class="df-columns-empty">${t({ fr: 'Chargement…', en: 'Loading…' })}</div>
      </div>
    `;

    document.getElementById('sourcePanel').classList.add('show');
    document.getElementById('panelOverlay').classList.add('show');
    feather.replace();

    // Lazy-load detail file
    try {
      const prefix = NavigationManager.getPathPrefix();
      const detail = await fetch(`${prefix}data/sources/${sourceId}.json`).then(r => r.json());

      // Fill description
      const descEl = document.getElementById('spDesc');
      if (descEl) descEl.textContent = t(detail.description) || '';

      // Fill columns
      const cols = detail.columns || [];
      let colsHtml;
      if (cols.length) {
        colsHtml = `<table class="df-columns-table">
          <thead><tr>
            <th>${t({ fr: 'Colonne', en: 'Column' })}</th>
            <th>${t({ fr: 'Type', en: 'Type' })}</th>
            <th>${t({ fr: 'Description', en: 'Description' })}</th>
          </tr></thead>
          <tbody>${cols.map(c => `
            <tr>
              <td><span class="df-col-name">${c.name}</span></td>
              <td><span class="df-col-type">${c.type}</span></td>
              <td class="df-col-desc">${t(c.description)}</td>
            </tr>`).join('')}
          </tbody>
        </table>`;
      } else {
        colsHtml = `<div class="df-columns-empty">${t({ fr: 'Colonnes non documentées pour cette source.', en: 'Columns not yet documented for this source.' })}</div>`;
      }

      const colsSec = document.getElementById('spColumnsSection');
      if (colsSec) {
        colsSec.innerHTML = `
          <p class="df-panel-section-title">${t({ fr: 'Colonnes principales', en: 'Main columns' })}</p>
          ${colsHtml}
        `;
      }
      feather.replace();
    } catch {
      const descEl = document.getElementById('spDesc');
      if (descEl) descEl.textContent = '';
      const colsSec = document.getElementById('spColumnsSection');
      if (colsSec) {
        colsSec.innerHTML = `
          <p class="df-panel-section-title">${t({ fr: 'Colonnes principales', en: 'Main columns' })}</p>
          <div class="df-columns-empty">${t({ fr: 'Colonnes non documentées pour cette source.', en: 'Columns not yet documented for this source.' })}</div>
        `;
      }
    }
  },

  // ── Search ────────────────────────────────────────────
  setupSearch() {
    const input = document.getElementById('dfSrcSearch');
    if (!input) return;
    input.addEventListener('input', () => {
      this.searchQuery = input.value.trim();
      this.renderSourceGrid();
      feather.replace();
    });
  },

  // ── Language switch ───────────────────────────────────
  setupLanguageSwitch() {
    window.addEventListener('languageChanged', () => {
      this.renderAll();
      feather.replace();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => { DataFlowPage.init(); });
