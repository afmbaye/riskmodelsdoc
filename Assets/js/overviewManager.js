class OverviewManager {
    constructor() {
        this.modelId = new URLSearchParams(window.location.search).get('model');
        this.overviewData = null;
    }

    /**
     * Initialise la page overview
     */
    async initialize() {
        try {
            await this.loadOverviewData();
            this.renderContent();
        } catch (error) {
            console.error('Erreur lors du chargement de l\'overview:', error);
            this.showError('Impossible de charger les données du modèle');
        }
    }

    /**
     * Charge les données de l'overview
     */
    async loadOverviewData() {
        const response = await fetch(`/data/models/${this.modelId}/overview.json`);
        if (!response.ok) throw new Error('Données non trouvées');
        this.overviewData = await response.json();
    }

    /**
     * Affiche le contenu de la page
     */
    renderContent() {
        const { overview } = this.overviewData;
        
        // Mise à jour du titre et de la description
        document.querySelector('.overview-title').textContent = overview.title;
        document.querySelector('.overview-description').textContent = overview.description;

        // Rendu des fonctionnalités principales
        this.renderMainFeatures(overview.mainFeatures);

        // Rendu des onglets
        this.renderTabs(overview.tabs);

        // Rendu du guide de démarrage rapide
        this.renderQuickStart(overview.quickStart);

        // Mise à jour des informations de mise à jour
        this.renderUpdateInfo(overview.updates);

        // Initialisation des icônes
        feather.replace();
    }

    /**
     * Rendu des fonctionnalités principales
     */
    renderMainFeatures(features) {
        const container = document.querySelector('.features-grid');
        container.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">
                    <i data-feather="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }

    /**
     * Rendu des onglets
     */
    renderTabs(tabs) {
        const container = document.querySelector('.tabs-grid');
        container.innerHTML = tabs.map(tab => `
            <div class="tab-card">
                <div class="tab-content">
                    <div class="tab-header">
                        <i data-feather="${tab.icon}"></i>
                        <h3>${tab.title}</h3>
                    </div>
                    <p>${tab.description}</p>
                    <ul class="tab-features">
                        ${tab.features.map(feature => `
                            <li><i data-feather="check"></i>${feature}</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="tab-preview">
                    <img src="../../assets/images/${this.modelId}/${tab.image}" 
                         alt="Aperçu de l'onglet ${tab.title}">
                </div>
            </div>
        `).join('');
    }

    /**
     * Rendu du guide de démarrage rapide
     */
    renderQuickStart(quickStart) {
        const container = document.querySelector('.quick-start');
        container.innerHTML = `
            <h2>${quickStart.title}</h2>
            <div class="steps-list">
                ${quickStart.steps.map((step, index) => `
                    <div class="step-item">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <p>${step.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Rendu des informations de mise à jour
     */
    renderUpdateInfo(updates) {
        const container = document.querySelector('.update-info');
        container.innerHTML = `
            <div class="info-item">
                <i data-feather="clock"></i>
                <span>Dernière mise à jour: ${updates.lastUpdate}</span>
            </div>
            <div class="info-item">
                <i data-feather="refresh-cw"></i>
                <span>Fréquence: ${updates.frequency} à ${updates.time}</span>
            </div>
        `;
    }

    /**
     * Affiche un message d'erreur
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i data-feather="alert-circle"></i>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(errorDiv);
        feather.replace();
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Export de la classe
export const overviewManager = new OverviewManager();