// Initialisation des icônes Feather
feather.replace();

// Gestion du dropdown Documentation
const docButton = document.getElementById('docButton');
const docDropdown = document.getElementById('docDropdown');

docButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = docButton.getAttribute('aria-expanded') === 'true';
    
    // Ferme le sélecteur de langue s'il est ouvert
    if (langDropdown.classList.contains('show')) {
        langDropdown.classList.remove('show');
        langButton.classList.remove('active');
        langButton.setAttribute('aria-expanded', 'false');
    }
    
    docButton.setAttribute('aria-expanded', !isExpanded);
    docDropdown.classList.toggle('show');
});

// Gestion du sélecteur de langue
const langButton = document.getElementById('langButton');
const langDropdown = document.getElementById('langDropdown');

langButton.addEventListener('click', () => {
    const isExpanded = langButton.getAttribute('aria-expanded') === 'true';
    langButton.setAttribute('aria-expanded', !isExpanded);
    langButton.classList.toggle('active');
    langDropdown.classList.toggle('show');
});

// Fermer le menu quand on clique ailleurs
document.addEventListener('click', (e) => {
    // Ferme le sélecteur de langue
    if (!langButton.contains(e.target)) {
        langDropdown.classList.remove('show');
        langButton.classList.remove('active');
        langButton.setAttribute('aria-expanded', 'false');
    }
    
    // Ferme le dropdown de documentation
    if (!docButton.contains(e.target) && !docDropdown.contains(e.target)) {
        docDropdown.classList.remove('show');
        docButton.setAttribute('aria-expanded', 'false');
    }
});

// Gestion de la sélection de langue
const langOptions = document.querySelectorAll('.lang-option');
langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        langOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        const flag = option.querySelector('img').src;
        const text = option.querySelector('span').textContent;
        
        langButton.querySelector('img').src = flag;
        langButton.querySelector('span').textContent = text;
        
        langDropdown.classList.remove('show');
        langButton.classList.remove('active');
        langButton.setAttribute('aria-expanded', 'false');
    });
});

// Gestion du menu Store
const btn = document.getElementById('btn-store');
const menu = document.getElementById('submenu-store');

btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    menu.style.display = expanded ? 'none' : 'block';

    // Changement de l'icône
    const chev = btn.querySelector('.chev');
    chev.outerHTML = expanded
        ? '<i data-feather="plus" class="fi chev" aria-hidden="true"></i>'
        : '<i data-feather="minus" class="fi chev" aria-hidden="true"></i>';
    feather.replace();
});