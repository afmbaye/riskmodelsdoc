/**
 * Utilitaires pour la gestion des modèles et leurs données
 * @module modelUtils
 */

/**
 * Classe principale pour la gestion des modèles
 */
class ModelManager {
    constructor() {
        this.baseUrl = '/data/models';
        this.currentModel = null;
    }

    /**
     * Récupère l'ID du modèle depuis l'URL
     * @returns {string|null} L'ID du modèle ou null si non trouvé
     */
    static getModelFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('model');
    }

    /**
     * Charge les données d'un fichier JSON pour un modèle
     * @param {string} modelId - L'ID du modèle
     * @param {string} fileType - Le type de fichier (model-info, data-model, etc.)
     * @returns {Promise<Object>} Les données du fichier JSON
     */
    async loadModelData(modelId, fileType) {
        try {
            const response = await fetch(`${this.baseUrl}/${modelId}/${fileType}.json`);
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement des données: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erreur lors du chargement de ${fileType} pour ${modelId}:`, error);
            this.handleError(error);
            return null;
        }
    }

    /**
     * Initialise un modèle et charge ses informations de base
     * @param {string} modelId - L'ID du modèle à charger
     * @returns {Promise<Object>} Les informations du modèle
     */
    async initializeModel(modelId) {
        try {
            const modelInfo = await this.loadModelData(modelId, 'model-info');
            if (!modelInfo) {
                throw new Error('Modèle non trouvé');
            }
            this.currentModel = modelInfo;
            return modelInfo;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    /**
     * Met à jour les éléments de navigation pour un modèle
     * @param {Object} modelInfo - Les informations du modèle
     */
    updateNavigation(modelInfo) {
        if (!modelInfo) return;

        const sidebarNav = document.querySelector('.sidebar-nav');
        if (!sidebarNav) return;

        // Mise à jour du titre
        const title = document.querySelector('.sidebar-title h2');
        if (title) {
            title.textContent = modelInfo.name;
        }

        // Mise à jour des liens avec le paramètre model
        const links = sidebarNav.querySelectorAll('a');
        links.forEach(link => {
            const currentHref = link.getAttribute('href');
            const url = new URL(currentHref, window.location.origin);
            url.searchParams.set('model', modelInfo.id);
            link.setAttribute('href', url.pathname + url.search);
        });
    }

    /**
     * Gestion des erreurs avec interface utilisateur
     * @param {Error} error - L'erreur à gérer
     */
    handleError(error) {
        console.error('Erreur:', error);
        
        // Création d'une notification d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i data-feather="alert-circle"></i>
                <p>${error.message}</p>
            </div>
            <button class="error-close">
                <i data-feather="x"></i>
            </button>
        `;

        document.body.appendChild(errorDiv);
        feather.replace();

        // Auto-suppression après 5 secondes
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);

        // Suppression manuelle
        const closeButton = errorDiv.querySelector('.error-close');
        closeButton.addEventListener('click', () => {
            errorDiv.remove();
        });
    }
}

/**
 * Classe pour la gestion des KPIs
 */
class KPIManager {
    constructor(modelManager) {
        this.modelManager = modelManager;
    }

    /**
     * Charge les KPIs d'un modèle
     * @param {string} modelId - L'ID du modèle
     * @returns {Promise<Object>} Les données des KPIs
     */
    async loadKPIs(modelId) {
        return await this.modelManager.loadModelData(modelId, 'kpis');
    }

    /**
     * Formate la formule DAX avec coloration syntaxique
     * @param {string} formula - La formule DAX
     * @returns {string} La formule formatée en HTML
     */
    formatDAXFormula(formula) {
        // Mots-clés DAX basiques
        const keywords = ['VAR', 'RETURN', 'CALCULATE', 'SUM', 'DIVIDE'];
        let formattedFormula = formula;

        // Coloration des mots-clés
        keywords.forEach(keyword => {
            formattedFormula = formattedFormula.replace(
                new RegExp(`\\b${keyword}\\b`, 'g'),
                `<span class="dax-keyword">${keyword}</span>`
            );
        });

        return formattedFormula;
    }
}

/**
 * Classe pour la gestion des visuels
 */
class VisualsManager {
    constructor(modelManager) {
        this.modelManager = modelManager;
    }

    /**
     * Charge les visuels d'un modèle
     * @param {string} modelId - L'ID du modèle
     * @returns {Promise<Object>} Les données des visuels
     */
    async loadVisuals(modelId) {
        return await this.modelManager.loadModelData(modelId, 'visuals');
    }

    /**
     * Filtre les visuels par onglet
     * @param {Object} visuals - Les données des visuels
     * @param {string} tabId - L'ID de l'onglet
     * @returns {Array} Les visuels filtrés
     */
    filterVisualsByTab(visuals, tabId) {
        return visuals.filter(visual => visual.tabId === tabId);
    }
}

/**
 * Classe pour la gestion du processus de mise à jour
 */
class UpdateManager {
    constructor(modelManager) {
        this.modelManager = modelManager;
    }

    /**
     * Charge le processus de mise à jour d'un modèle
     * @param {string} modelId - L'ID du modèle
     * @returns {Promise<Object>} Les données du processus de mise à jour
     */
    async loadUpdateProcess(modelId) {
        return await this.modelManager.loadModelData(modelId, 'update-process');
    }

    /**
     * Vérifie la complétion d'une étape
     * @param {Object} step - L'étape à vérifier
     * @returns {boolean} True si l'étape est complétée
     */
    validateStep(step) {
        if (!step.validation) return true;

        if (step.validation.type === 'checklist') {
            return step.validation.items.every(item => item.checked);
        }

        return false;
    }
}

// Export des classes
export { ModelManager, KPIManager, VisualsManager, UpdateManager };