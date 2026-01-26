/**
 * Gestion de la navigation dynamique
 * @module navigationManager
 */

class NavigationManager {
    constructor() {
        this.currentModel = null;
        this.currentPage = this.getCurrentPage();
    }

    /**
     * Initialise la navigation
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            const modelId = this.getModelFromUrl();
            if (!modelId) {
                throw new Error('Aucun modèle spécifié');
            }

            await this.loadModelInfo(modelId);
            this.updateHeader();
            this.updateSidebar();
            this.highlightCurrentPage();
            this.setupNavigationEvents();
        } catch (error) {
            console.error('Erreur d\'initialisation de la navigation:', error);
            this.showErrorMessage('Erreur de chargement de la navigation');
        }
    }

    /**
     * Récupère l'ID du modèle depuis l'URL
     * @returns {string|null}
     */
    getModelFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('model');
    }

    /**
     * Détermine la page actuelle à partir de l'URL
     * @returns {string}
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').filter(Boolean).pop()?.replace('.html', '') || 'overview';
        return page;
    }

    /**
     * Charge les informations du modèle
     * @param {string} modelId 
     */
    async loadModelInfo(modelId) {
        try {
            const response = await fetch(`/data/models/${modelId}/model-info.json`);
            if (!response.ok) throw new Error('Modèle non trouvé');
            this.currentModel = await response.json();
        } catch (error) {
            console.error('Erreur de chargement du modèle:', error);
            throw error;
        }
    }

    /**
     * Met à jour le header avec les informations du modèle
     */
    updateHeader() {
        const header = document.querySelector('.header');
        if (!header || !this.currentModel) return;

        header.innerHTML = `
            <div class="header-content">
                <h1>${this.currentModel.name}</h1>
                <div class="model-metadata">
                    <span class="model-version">v${this.currentModel.version}</span>
                    <span class="model-update">Dernière mise à jour: ${this.currentModel.lastUpdate}</span>
                </div>
            </div>
            <div class="header-actions">
                <div class="model-selector">
                    <button class="model-select-btn" id="modelSelectBtn">
                        <span>Changer de modèle</span>
                        <i data-feather="chevron-down"></i>
                    </button>
                </div>
            </div>
        `;

        // Initialiser les icônes Feather
        feather.replace();
    }

    /**
     * Met à jour la sidebar avec les liens dynamiques
     */
    updateSidebar() {
        const sidebar = document.querySelector('.sidebar-nav');
        if (!sidebar || !this.currentModel) return;

        const navigationItems = [
            { id: 'overview', name: 'Vue d\'ensemble', icon: 'home' },
            { id: 'data-model', name: 'Modèle de données', icon: 'database' },
            { id: 'kpi-dictionary', name: 'Dictionnaire KPI', icon: 'book-open' },
            { id: 'visuals', name: 'Visuels', icon: 'bar-chart-2' },
            { id: 'update', name: 'Mise à jour', icon: 'refresh-cw' }
        ];

        const navHTML = navigationItems.map(item => `
            <a href="/pages/${item.id}/index.html?model=${this.currentModel.id}" 
               class="nav-item ${this.currentPage === item.id ? 'active' : ''}"
               data-page="${item.id}">
                <i data-feather="${item.icon}"></i>
                <span>${item.name}</span>
            </a>
        `).join('');

        sidebar.innerHTML = `
            <div class="sidebar-title">
                <h2>${this.currentModel.name}</h2>
                <span class="department">${this.currentModel.metadata.department}</span>
            </div>
            <nav class="nav-list">
                ${navHTML}
            </nav>
        `;

        // Initialiser les icônes Feather
        feather.replace();
    }

    /**
     * Met en surbrillance la page active dans la navigation
     */
    highlightCurrentPage() {
        const links = document.querySelectorAll('.nav-item');
        links.forEach(link => {
            const page = link.dataset.page;
            if (page === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Configure les événements de navigation
     */
    setupNavigationEvents() {
        // Gestion du sélecteur de modèle
        const modelSelectBtn = document.getElementById('modelSelectBtn');
        if (modelSelectBtn) {
            modelSelectBtn.addEventListener('click', () => this.showModelSelector());
        }

        // Gestion des liens de navigation
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateTo(href);
            });
        });
    }

    /**
     * Affiche le sélecteur de modèle
     */
    async showModelSelector() {
        try {
            // Charger la liste des modèles disponibles
            const response = await fetch('/data/models/index.json');
            const models = await response.json();

            const modal = document.createElement('div');
            modal.className = 'model-selector-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Sélectionner un modèle</h3>
                    <div class="models-list">
                        ${models.map(model => `
                            <a href="?model=${model.id}" 
                               class="model-item ${model.id === this.currentModel.id ? 'active' : ''}">
                                <span class="model-name">${model.name}</span>
                                <span class="model-department">${model.metadata.department}</span>
                            </a>
                        `).join('')}
                    </div>
                    <button class="modal-close">
                        <i data-feather="x"></i>
                    </button>
                </div>
            `;

            document.body.appendChild(modal);
            feather.replace();

            // Gérer la fermeture
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
            });

            // Fermer en cliquant en dehors
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        } catch (error) {
            console.error('Erreur lors du chargement des modèles:', error);
            this.showErrorMessage('Impossible de charger la liste des modèles');
        }
    }

    /**
     * Navigation vers une nouvelle page
     * @param {string} url 
     */
    navigateTo(url) {
        window.location.href = url;
    }

    /**
     * Affiche un message d'erreur
     * @param {string} message 
     */
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i data-feather="alert-circle"></i>
                <p>${message}</p>
            </div>
            <button class="error-close">
                <i data-feather="x"></i>
            </button>
        `;

        document.body.appendChild(errorDiv);
        feather.replace();

        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Export de la classe
export const navigationManager = new NavigationManager();