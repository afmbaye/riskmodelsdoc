# Project Handover - Power BI Documentation Portal

**Date:** 2026-02-26
**Project:** Baobab Group Risk - Power BI Documentation Portal
**Status:** Site fully deployed on GitHub Pages — pilot model (Installment Tracker) 100% documented

---

## 1. What We Were Working On

### Project Goal
Transform a hardcoded Power BI documentation site into a **dynamic, model-agnostic, bilingual (FR/EN)** documentation portal hosted on GitHub Pages. The site documents 16 Power BI models for subsidiary risk analysts, with "Installment Tracker" as the pilot model.

### Phase Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Done | Project cleanup & folder restructure |
| Phase 2 | ✅ Done | Create all JSON data files |
| Phase 3 | ✅ Done | Create core JavaScript modules |
| Phase 4 | ✅ Done | Create shared CSS components |
| Phase 5 | ✅ Done | Build main pages (Home, Data Flow, Glossary) |
| Phase 6 | ✅ Done | Build documentation pages (5 sections) |
| Phase 7 | ✅ Done | Organize screenshots & fix paths |
| Phase 8 | ✅ Done | Deployment to GitHub Pages + UX improvements |

---

## 2. Live Site

**URL:** https://afmbaye.github.io/riskmodelsdoc/

| Page | URL |
|------|-----|
| Home (models list) | `/` |
| Data Flow | `/data-flow/` |
| Glossary | `/glossary/` |
| Documentation → Overview | `/pages/documentation/?model=installment-tracker&section=overview` |
| Documentation → Data Model | `/pages/documentation/?model=installment-tracker&section=data-model` |
| Documentation → KPIs | `/pages/documentation/?model=installment-tracker&section=kpis` |
| Documentation → Visuals | `/pages/documentation/?model=installment-tracker&section=visuals` |
| Documentation → Update Process | `/pages/documentation/?model=installment-tracker&section=update` |

---

## 3. Architecture

### How It Works
- **Pure static site** (HTML + CSS + JS) — no build step, no server
- Content loaded via `fetch()` from JSON files at runtime
- GitHub Pages serves from the `master` branch
- Changes made on `epic-nobel` branch, merged into `master` to deploy

### URL & Path Handling
- `DataLoader.getPath()` calculates `../` prefix based on URL depth
- Special logic for GitHub Pages: excludes repo name segment (`riskmodelsdoc`) from depth count
- `isGithubPages = window.location.hostname.includes('github.io')`

### Bilingual Content
All translatable content uses `{ "fr": "...", "en": "..." }` objects.
Translated via `LanguageManager.t({ fr: '...', en: '...' })`.
Language preference stored in `localStorage`, can be forced via `?lang=en`.

---

## 4. File Structure

### Configuration & Data
```
data/
├── site.json                    # Site config (nav, sidebar sections)
├── categories.json              # 6 model categories with colors
├── glossary.json                # 15+ glossary terms
├── data-flow.json               # Data sources & dictionary schema
│     └── schema: Assets/Images/data-flow/global-schema.png
└── models/
    ├── index.json               # Models list (4 models, 1 active)
    └── installment-tracker/
        ├── overview.json        # Description, tabs, stats, use case
        ├── data-model.json      # Tables (fact/dim), relationships, schema image
        ├── kpis.json            # 17 KPIs with DAX formulas & explanations
        ├── visuals.json         # 9 visuals with screenshots & details
        └── update-process.json  # 4-step update guide with tasks/warnings
```

### Styles (ALL paths use uppercase `Assets/`)
```
Assets/css/
├── main.css          # Entry point (@import all others)
├── variables.css     # Design tokens (colors, spacing, shadows)
├── base.css          # Reset, typography, form defaults
├── layout.css        # Header, sidebar, main content grid
├── components.css    # Buttons, cards, badges, tags, breadcrumb
├── tables.css        # KPI table, models table, glossary
├── modal.css         # Modal & slide-in panel + formula toolbar
├── stepper.css       # Update process stepper with completed states
├── hero.css          # Home page hero section
├── animations.css    # Keyframes & animation utilities
└── errors.css        # Error states & notifications
```

### JavaScript
```
Assets/js/
├── languageManager.js    # FR/EN switching, localStorage, t() function
├── dataLoader.js         # JSON fetching, caching, path handling
├── templateRenderer.js   # Shared HTML rendering utilities
└── navigationManager.js  # Header, sidebar, dropdown rendering
```

### Pages
```
index.html                        # Home - models list with search/filter
data-flow/index.html              # Data flow diagram & dictionary panel
glossary/index.html               # Alphabetical glossary with search
pages/documentation/index.html   # Documentation shell (5 sections, dynamic)
```

### Images (ALL paths use uppercase `Assets/Images/`)
```
Assets/Images/
├── logos/
│   └── baobab.png
├── data-flow/
│   └── global-schema.png
└── installment-tracker/
    ├── data-model.png           # Full schema diagram
    ├── tab-*.png                # Tab screenshots (overview section)
    ├── fact-*.png               # Fact table screenshots
    ├── dim-*.png                # Dimension table screenshots
    └── visual-*.png             # Visual screenshots
```

---

## 5. Critical Gotchas

### Case-Sensitive Paths (Linux / GitHub Pages)
GitHub Pages runs on Linux — folder names are case-sensitive.
- **Always use `Assets/` (capital A)** in all HTML `href`/`src` attributes and JS paths
- **Always use `pages/` (lowercase p)** for the documentation folder
- If you rename folders, use `git mv` (not OS rename) to ensure Git tracks the change:
  ```bash
  git mv OldName tmpname
  git mv tmpname newname
  ```

### JSON Structure for data-model.json
```javascript
// Correct property access in renderDataModel():
data.tables.fact        // NOT data.factTables
data.tables.dimension   // NOT data.dimensionTables
rel.from.table          // NOT rel.fromTable
rel.from.column         // NOT rel.fromColumn
rel.to.table            // NOT rel.toTable
rel.to.column           // NOT rel.toColumn
```

### GitHub Pages Path Depth
`getPath()` in `dataLoader.js` and `getPathPrefix()` in `navigationManager.js` both exclude the repo name segment from depth calculation. Do not remove the `isGithubPages` check.

### Two Worktrees
- **`epic-nobel`** branch: `C:\Users\Adji MBAYE\.claude-worktrees\Documentation\epic-nobel\`
- **`master`** branch: `C:\Users\Adji MBAYE\Downloads\Documentation\`
- After pushing to `epic-nobel`, always merge into `master` and push to deploy:
  ```bash
  cd "C:/Users/Adji MBAYE/Downloads/Documentation"
  git pull && git merge epic-nobel && git push origin master
  ```

---

## 6. UX Improvements (Phase 8)

Implemented in commit `3a0eed1` (feat(ux)):

| Feature | Files Changed |
|---------|--------------|
| Image constraints (aspect-ratio, object-fit) | `Assets/css/components.css` |
| Schema image max-height | `Assets/css/components.css` |
| Step screenshot max-height | `Assets/css/stepper.css` |
| Breadcrumb navigation in all 5 sections | `pages/documentation/index.html` |
| Page header left-border accent | `pages/documentation/index.html` (inline style) |
| Stepper: `completed` state (✓ green) | `Assets/css/stepper.css` + `index.html` |
| DAX modal: toolbar with Copy button | `Assets/css/modal.css` + `index.html` |
| DAX modal: max-height + internal scroll | `Assets/css/modal.css` |

---

## 7. How to Add a New Model

1. Create folder: `data/models/{model-id}/`
2. Add 5 JSON files following the Installment Tracker as template:
   - `overview.json` — name, description, stats, tabs (with screenshots)
   - `data-model.json` — schema image, fact/dimension tables, relationships
   - `kpis.json` — KPI list with DAX formulas, units, visuals used
   - `visuals.json` — visual cards with screenshots, objectives, filters
   - `update-process.json` — steps with tasks, warnings, checklists
3. Add entry to `data/models/index.json` with `"isActive": true`
4. Add screenshots to `Assets/Images/{model-id}/`
5. All image paths in JSON must be relative to repo root (e.g. `Assets/Images/my-model/schema.png`)

---

## 8. Key CSS Variables

```css
--primary-color: #E6007E;      /* Baobab pink */
--secondary-color: #2C5282;    /* Navy blue */
--success-color: #38A169;      /* Green (stepper completed) */
--sidebar-width: 280px;
--header-height: 60px;
```

---

## 9. JavaScript Usage

```javascript
// Translate content
LanguageManager.t({ fr: 'Bonjour', en: 'Hello' });

// Load data
const overview = await DataLoader.getModelOverview('installment-tracker');
const kpis     = await DataLoader.getModelKpis('installment-tracker');

// Compute path prefix (handles GitHub Pages depth)
const prefix = DataLoader.getPath('Assets/css/main.css');
```

---

## 10. Next Steps (Phase 9 — Content Expansion)

1. **Add more models**: Use Installment Tracker JSON as template for the other 15 models
2. **Add real screenshots**: Replace placeholder paths with actual Power BI screenshots
3. **Enable inactive models**: Change `"isActive": false` to `true` in `data/models/index.json`
4. **Expand glossary**: Add more Power BI / risk terminology to `data/glossary.json`
5. **Add data flow details**: Expand `data/data-flow.json` with more data source entries

---

*Last updated: 2026-02-26 — Site live at https://afmbaye.github.io/riskmodelsdoc/*
