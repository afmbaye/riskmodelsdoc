// Fonction pour charger les composants HTML
async function loadComponent(componentName) {
    try {
        const response = await fetch(`/components/${componentName}.html`);
        const html = await response.text();
        return html;
    } catch (error) {
        console.error(`Erreur lors du chargement du composant ${componentName}:`, error);
        return '';
    }
}

// Fonction pour formater le code DAX
function formatDaxCode(code) {
    // À implémenter avec une bibliothèque de formatage de code
    return code;
}

// Fonction pour injecter un composant dans la page
async function injectComponent(containerSelector, componentName, data = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const componentHtml = await loadComponent(componentName);
    container.innerHTML = componentHtml;

    // Initialiser les icônes Feather
    if (window.feather) {
        feather.replace();
    }

    return container;
}

// Fonction pour créer une grille de cards
function createCardGrid(cards, container) {
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    
    cards.forEach(cardData => {
        const card = createTabCard(
            cardData.image,
            cardData.title,
            cardData.description
        );
        grid.appendChild(card);
    });

    container.appendChild(grid);
}