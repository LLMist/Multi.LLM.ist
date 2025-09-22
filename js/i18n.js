class I18n {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.fallbackLang = 'en';
        
        this.supportedLanguages = {
            'en': 'English',
            'ja': '日本語', 
            'zh-CN': '简体中文',
            'zh-TW': '繁體中文'
        };
        
    }
    
    async init() {
        try {
            this.currentLang = this.detectLanguage();
            console.log(`Detected language: ${this.currentLang}`);
            
            await this.loadLanguage(this.currentLang);
            
            this.applyTranslations();
            
            this.createLanguageSwitcher();
            
            console.log(`Language initialized successfully: ${this.currentLang}`);
        } catch (error) {
            console.error('Failed to initialize i18n:', error);
            this.currentLang = 'en';
            this.translations[this.currentLang] = {};
        }
    }
    
    detectLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLanguages[urlLang]) {
            localStorage.setItem('preferred-language', urlLang);
            return urlLang;
        }
        
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && this.supportedLanguages[savedLang]) {
            return savedLang;
        }
        
        const browserLang = navigator.language || navigator.userLanguage;
        
        if (this.supportedLanguages[browserLang]) {
            return browserLang;
        }
        
        const langCode = browserLang.toLowerCase();
        if (langCode.startsWith('zh')) {
            if (langCode.includes('tw') || langCode.includes('hk') || langCode.includes('mo')) {
                return 'zh-TW';
            } else {
                return 'zh-CN';
            }
        }
        
        const primaryLang = browserLang.split('-')[0];
        const langMap = {
            'ja': 'ja',
            'zh': 'zh-CN'
        };
        
        if (langMap[primaryLang]) {
            return langMap[primaryLang];
        }
        
        return this.fallbackLang;
    }
    
    async loadLanguage(lang) {
        try {
            console.log('Loading language file:', `locales/${lang}.json`);
            const response = await fetch(`locales/${lang}.json`);
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            this.translations[lang] = await response.json();
            console.log('Language loaded successfully:', lang);
        } catch (error) {
            console.warn(`Failed to load language ${lang}:`, error);
            
            if (lang !== this.fallbackLang) {
                try {
                    const fallbackResponse = await fetch(`locales/${this.fallbackLang}.json`);
                    this.translations[this.fallbackLang] = await fallbackResponse.json();
                    this.currentLang = this.fallbackLang;
                } catch (fallbackError) {
                    console.error('Failed to load fallback language:', fallbackError);
                }
            }
        }
    }
    
    t(key, params = {}) {
        console.log('Translating key:', key, 'for language:', this.currentLang);
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn('Key not found in current language, trying fallback:', key);
                value = this.translations[this.fallbackLang];
                for (const k2 of keys) {
                    if (value && typeof value === 'object' && k2 in value) {
                        value = value[k2];
                    } else {
                        console.warn('Key not found in fallback language, returning key:', key);
                        return key;
                    }
                }
                break;
            }
        }
        
        if (Array.isArray(value)) {
            return value;
        }
        
        if (typeof value === 'string') {
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] || match;
            });
        }
        
        return value || key;
    }
    
    applyTranslations() {
        console.log('Applying translations for language:', this.currentLang);
        document.title = this.t('hero.title') + ' - ' + this.t('hero.subtitle');
        
        if (document.documentElement) {
            document.documentElement.setAttribute('lang', this.currentLang);
        }

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = this.t('hero.description');
        }
        
        this.updateElement('[data-i18n="nav.features"]', this.t('nav.features'));
        this.updateElement('[data-i18n="nav.download"]', this.t('nav.download'));
        this.updateElement('[data-i18n="nav.howToUse"]', this.t('nav.howToUse'));
        this.updateElement('[data-i18n="nav.about"]', this.t('nav.about'));
        
        this.updateElement('[data-i18n="hero.title"]', this.t('hero.title'));
        this.updateElement('[data-i18n="hero.subtitle"]', this.t('hero.subtitle'));
        this.updateElement('[data-i18n="hero.description"]', this.t('hero.description'));
        this.updateElement('[data-i18n="hero.downloadNow"]', this.t('hero.downloadNow'));
        this.updateElement('[data-i18n="hero.learnMore"]', this.t('hero.learnMore'));
        
        this.updateElement('[data-i18n="features.title"]', this.t('features.title'));
        this.updateElement('[data-i18n="features.sideByComparison.title"]', this.t('features.sideByComparison.title'));
        this.updateElement('[data-i18n="features.sideByComparison.description"]', this.t('features.sideByComparison.description'));
        this.updateElement('[data-i18n="features.batchQA.title"]', this.t('features.batchQA.title'));
        this.updateElement('[data-i18n="features.batchQA.description"]', this.t('features.batchQA.description'));
        this.updateElement('[data-i18n="features.dragDrop.title"]', this.t('features.dragDrop.title'));
        this.updateElement('[data-i18n="features.dragDrop.description"]', this.t('features.dragDrop.description'));
        this.updateElement('[data-i18n="features.responsive.title"]', this.t('features.responsive.title'));
        this.updateElement('[data-i18n="features.responsive.description"]', this.t('features.responsive.description'));
        this.updateElement('[data-i18n="features.shortcuts.title"]', this.t('features.shortcuts.title'));
        this.updateElement('[data-i18n="features.shortcuts.description"]', this.t('features.shortcuts.description'));
        this.updateElement('[data-i18n="features.customization.title"]', this.t('features.customization.title'));
        this.updateElement('[data-i18n="features.customization.description"]', this.t('features.customization.description'));
        
        this.updateElement('[data-i18n="models.title"]', this.t('models.title'));
        this.updateElement('[data-i18n="models.note"]', this.t('models.note'));
        
        this.updateElement('[data-i18n="download.title"]', this.t('download.title'));
        this.updateElement('[data-i18n="download.description"]', this.t('download.description'));
        this.updateElement('[data-i18n="download.chrome.title"]', this.t('download.chrome.title'));
        this.updateElement('[data-i18n="download.chrome.description"]', this.t('download.chrome.description'));
        this.updateElement('[data-i18n="download.edge.title"]', this.t('download.edge.title'));
        this.updateElement('[data-i18n="download.edge.description"]', this.t('download.edge.description'));
        this.updateElement('[data-i18n="download.firefox.title"]', this.t('download.firefox.title'));
        this.updateElement('[data-i18n="download.firefox.description"]', this.t('download.firefox.description'));
        
        this.updateElement('[data-i18n="download.chrome.button"] span', this.t('download.chrome.button'));
        this.updateElement('[data-i18n="download.chrome.button"] small', this.t('download.chrome.store'));
        this.updateElement('[data-i18n="download.edge.button"] span', this.t('download.edge.button'));
        this.updateElement('[data-i18n="download.edge.button"] small', this.t('download.edge.store'));
        this.updateElement('[data-i18n="download.firefox.button"] span', this.t('download.firefox.button'));
        this.updateElement('[data-i18n="download.firefox.button"] small', this.t('download.firefox.store'));
        
        this.updateElement('[data-i18n="howToUse.title"]', this.t('howToUse.title'));
        this.updateElement('[data-i18n="howToUse.step1.title"]', this.t('howToUse.step1.title'));
        this.updateElement('[data-i18n="howToUse.step1.description"]', this.t('howToUse.step1.description'));
        this.updateElement('[data-i18n="howToUse.step2.title"]', this.t('howToUse.step2.title'));
        this.updateElement('[data-i18n="howToUse.step2.description"]', this.t('howToUse.step2.description'));
        this.updateElement('[data-i18n="howToUse.step3.title"]', this.t('howToUse.step3.title'));
        this.updateElement('[data-i18n="howToUse.step3.description"]', this.t('howToUse.step3.description'));
        this.updateElement('[data-i18n="howToUse.step4.title"]', this.t('howToUse.step4.title'));
        this.updateElement('[data-i18n="howToUse.step4.description"]', this.t('howToUse.step4.description'));
        
        this.updateElement('[data-i18n="about.title"]', this.t('about.title'));
        this.updateElement('[data-i18n="about.description1"]', this.t('about.description1'));
        this.updateElement('[data-i18n="about.description2"]', this.t('about.description2'));
        this.updateElement('[data-i18n="about.builtWith"]', this.t('about.builtWith'));
        this.updateElement('[data-i18n="about.stats.models"]', this.t('about.stats.models'));
        this.updateElement('[data-i18n="about.stats.browsers"]', this.t('about.stats.browsers'));
        this.updateElement('[data-i18n="about.stats.languages"]', this.t('about.stats.languages'));
        this.updateElement('[data-i18n="about.stats.more"]', this.t('about.stats.more'));
        
        this.updateElement('[data-i18n="footer.github"]', this.t('footer.github'));
        this.updateElement('[data-i18n="footer.privacy"]', this.t('footer.privacy'));
        this.updateElement('[data-i18n="footer.support"]', this.t('footer.support'));
        
        console.log('Translations applied successfully');
    }
    
    updateElement(selector, text) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0 && text !== undefined && text !== null) {
            console.log('Updating elements:', selector, 'count:', elements.length, 'with text:', text);
            elements.forEach(element => {
                element.textContent = text;
            });
        } else {
            if (elements.length === 0) {
                console.warn('No elements found for selector:', selector);
            }
            if (text === undefined || text === null) {
                console.warn('Text is undefined or null for selector:', selector);
            }
        }
    }
    
    async switchLanguage(lang) {
        console.log('Switching language to:', lang);
        if (lang === this.currentLang || !this.supportedLanguages[lang]) {
            console.log('Language not changed or not supported');
            return;
        }
        
        localStorage.setItem('preferred-language', lang);
        console.log('Language preference saved');
        
        await this.loadLanguage(lang);

        if (this.translations && this.translations[lang]) {
            this.currentLang = lang;
        }
        console.log('Language loaded, current language:', this.currentLang);
        
        this.applyTranslations();
        console.log('Translations applied');
        
        this.updateLanguageSwitcher();
        console.log('Language switcher updated');
        
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
        
        console.log(`Language switched to: ${lang}`);
    }
    
    createLanguageSwitcher() {
        const nav = document.querySelector('.nav-links');
        if (!nav) return;
        
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="lang-btn" id="langBtn">
                <span class="lang-icon">🌐</span>
                <span class="lang-text">${this.supportedLanguages[this.currentLang]}</span>
                <span class="lang-arrow">▼</span>
            </button>
            <div class="lang-dropdown" id="langDropdown">
                ${Object.entries(this.supportedLanguages).map(([code, name]) => 
                    `<div class="lang-option ${code === this.currentLang ? 'active' : ''}" data-lang="${code}">
                        ${name}
                    </div>`
                ).join('')}
            </div>
        `;
        
        nav.appendChild(switcher);
        
        const langBtn = switcher.querySelector('#langBtn');
        const langDropdown = switcher.querySelector('#langDropdown');
        
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!switcher.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });
        
        switcher.addEventListener('click', (e) => {
            const option = e.target.closest('.lang-option');
            if (option) {
                e.stopPropagation();
                const lang = option.dataset.lang;
                console.log('Switching language to:', lang);
                this.switchLanguage(lang);
            }
        });
    }
    
    updateLanguageSwitcher() {
        console.log('Updating language switcher');
        const langText = document.querySelector('.lang-text');
        const langOptions = document.querySelectorAll('.lang-option');
        
        if (langText) {
            langText.textContent = this.supportedLanguages[this.currentLang];
        }
        
        langOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === this.currentLang);
        });
    }
    
    getModalTranslations(type, params = {}) {
        switch (type) {
            case 'download':
                return {
                    title: this.t('modal.download.title', params),
                    description: this.t('modal.download.description', params),
                    goTo: this.t('modal.download.goTo', params),
                    cancel: this.t('modal.download.cancel')
                };
            case 'shortcuts':
                return {
                    title: this.t('modal.shortcuts.title'),
                    activate: this.t('modal.shortcuts.activate'),
                    expand: this.t('modal.shortcuts.expand'),
                    prevPage: this.t('modal.shortcuts.prevPage'),
                    nextPage: this.t('modal.shortcuts.nextPage')
                };
            case 'easter':
                return {
                    title: this.t('modal.easter.title'),
                    description: this.t('modal.easter.description'),
                    note: this.t('modal.easter.note'),
                    features: this.t('modal.easter.features')
                };
            default:
                return {};
        }
    }
    
    getToastMessage(key) {
        return this.t(`toast.${key}`);
    }
}

window.addEventListener('DOMContentLoaded', async function() {
    window.i18n = new I18n();
    await window.i18n.init();
});