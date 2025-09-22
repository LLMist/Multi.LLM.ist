document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            history.pushState(null, null, window.location.pathname);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        footerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            history.pushState(null, null, window.location.pathname);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-content">
            <a href="#features" data-i18n="nav.features">Features</a>
            <a href="#download" data-i18n="nav.download">Download</a>
            <a href="#how-to-use" data-i18n="nav.howToUse">How to Use</a>
            <a href="#about" data-i18n="nav.about">About</a>
        </div>
    `;
    document.body.appendChild(mobileMenu);
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    mobileMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = 60;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});





window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .model-item, .download-card, .step').forEach(el => {
    observer.observe(el);
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        const message = window.i18n ? window.i18n.getToastMessage('copied') : 'Copied to clipboard!';
        showToast(message);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

document.addEventListener('keydown', function(e) {
    if (e.altKey && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        showKeyboardShortcuts();
    }
});

function showKeyboardShortcuts() {
    const translations = window.i18n ? window.i18n.getModalTranslations('shortcuts') : {
        title: 'Keyboard Shortcuts',
        activate: 'Activate extension',
        expand: 'Open comparison and expand dock',
        prevPage: 'Previous page in comparison',
        nextPage: 'Next page in comparison'
    };
    
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${translations.title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>
                        <span>${translations.activate}</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↑</kbd>
                        <span>${translations.expand}</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>←</kbd>
                        <span>${translations.prevPage}</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>→</kbd>
                        <span>${translations.nextPage}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

let typedSequence = '';
document.addEventListener('keydown', function(e) {
    typedSequence += e.key.toLowerCase();
    if (typedSequence.length > 8) {
        typedSequence = typedSequence.slice(-8);
    }
    
    if (typedSequence === 'multillm') {
        showEasterEgg();
        typedSequence = '';
    }
});

function showEasterEgg() {
    const translations = window.i18n ? window.i18n.getModalTranslations('easter') : {
        title: '🎉 Hidden Features Unlocked!',
        description: 'You discovered some advanced features of Multi⁺LLM:',
        note: 'These features are available in the full extension!',
        features: [
            'Omnibox integration with "ml" keyword',
            'Context menu support for quick access',
            'Web navigation integration',
            'Offline mode support',
            'Advanced layout customization',
            'Batch processing capabilities'
        ]
    };
    
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${translations.title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${translations.description}</p>
                <ul class="features-list">
                    ${translations.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <p><em>${translations.note}</em></p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));