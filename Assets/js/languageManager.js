/**
 * Language Manager - Handles bilingual content (FR/EN)
 */
const LanguageManager = {
  currentLanguage: 'fr',
  supportedLanguages: ['fr', 'en'],

  /**
   * Initialize language from URL param or localStorage
   */
  init() {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    if (urlLang && this.supportedLanguages.includes(urlLang)) {
      this.currentLanguage = urlLang;
    } else {
      // Check localStorage
      const storedLang = localStorage.getItem('preferredLanguage');
      if (storedLang && this.supportedLanguages.includes(storedLang)) {
        this.currentLanguage = storedLang;
      }
    }

    // Save to localStorage
    localStorage.setItem('preferredLanguage', this.currentLanguage);

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;

    return this.currentLanguage;
  },

  /**
   * Switch language
   * @param {string} lang - Language code ('fr' or 'en')
   */
  switchLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.warn(`Language ${lang} not supported`);
      return;
    }

    this.currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);

    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));

    // Reload page to apply translations
    window.location.reload();
  },

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getLanguage() {
    return this.currentLanguage;
  },

  /**
   * Get current language (alias)
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  },

  /**
   * Translate a bilingual object
   * @param {Object|string} obj - Object with fr/en keys or plain string
   * @returns {string} Translated text
   */
  translate(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
      return obj[this.currentLanguage] || obj['fr'] || obj['en'] || '';
    }
    return String(obj);
  },

  /**
   * Shorthand for translate
   * @param {Object|string} obj - Object with fr/en keys
   * @returns {string} Translated text
   */
  t(obj) {
    return this.translate(obj);
  },

  /**
   * Get language display info
   * @returns {Object} Current language info for UI
   */
  getLanguageInfo() {
    const info = {
      fr: {
        code: 'fr',
        name: 'Francais',
        flag: 'https://flagcdn.com/w20/fr.png',
        flagAlt: 'FR'
      },
      en: {
        code: 'en',
        name: 'English',
        flag: 'https://flagcdn.com/w20/gb.png',
        flagAlt: 'EN'
      }
    };
    return info[this.currentLanguage];
  },

  /**
   * Get all language options for selector
   * @returns {Array} All language options
   */
  getAllLanguages() {
    return [
      {
        code: 'fr',
        name: 'Francais',
        flag: 'https://flagcdn.com/w20/fr.png',
        flagAlt: 'FR'
      },
      {
        code: 'en',
        name: 'English',
        flag: 'https://flagcdn.com/w20/gb.png',
        flagAlt: 'EN'
      }
    ];
  }
};

// Auto-initialize on script load
document.addEventListener('DOMContentLoaded', () => {
  LanguageManager.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageManager;
}
