const WHATSAPP_NUMBER = '5591992957604'; 

// Utilitário de seleção
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* Preloader */
window.addEventListener('load', () => {
    const preloader = $('#preloader');
    if (preloader) {
        preloader.classList.add('hide');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 400);
    }
});

/* Ano automático no rodapé */
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = $('#year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

/* Menu mobile */
document.addEventListener('DOMContentLoaded', () => {
    const header = $('.header');
    const navToggle = $('.nav-toggle');

    if (navToggle && header) {
        navToggle.addEventListener('click', () => {
            const isOpen = header.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Fecha menu ao clicar em um link
        $$('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (header.classList.contains('nav-open')) {
                    header.classList.remove('nav-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});

/* Scroll suave para âncoras internas */
document.addEventListener('DOMContentLoaded', () => {
    const internalLinks = $$('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            event.preventDefault();
            const offset = document.querySelector('.header')?.offsetHeight || 0;
            const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
            const scrollTo = elementTop - offset + 4;

            window.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
        });
    });
});

/* Destaque de link ativo no menu */
document.addEventListener('DOMContentLoaded', () => {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const sectionMap = sections.map(section => ({
        id: section.id,
        element: section
    }));

    const setActiveLink = () => {
        const scrollPos = window.scrollY;
        const headerHeight = $('.header')?.offsetHeight || 0;

        let currentSectionId = sectionMap[0].id;

        sectionMap.forEach(({ id, element }) => {
            const rect = element.getBoundingClientRect();
            const top = rect.top + window.scrollY - headerHeight - 60;
            if (scrollPos >= top) {
                currentSectionId = id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const linkId = href.replace('#', '');
            link.classList.toggle('active', linkId === currentSectionId);
        });
    };

    setActiveLink();
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(setActiveLink);
    });
});

/* Animações ao rolar (scroll reveal) */
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = $$('[data-reveal]');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => observer.observe(element));
});

/* Efeito digitando (typewriter) */
document.addEventListener('DOMContentLoaded', () => {
    const typedElement = $('#typed-text');
    if (!typedElement) return;

    const phrasesAttr = typedElement.getAttribute('data-phrases') || '';
    const phrases = phrasesAttr.split('|').map(p => p.trim()).filter(Boolean);
    if (!phrases.length) return;

    const typingSpeed = 65;
    const erasingSpeed = 35;
    const pauseAfterTyping = 1600;
    const pauseAfterErasing = 450;

    let phraseIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    const type = () => {
        const currentPhrase = phrases[phraseIndex];

        if (!isErasing) {
            // Digitando
            if (charIndex <= currentPhrase.length) {
                typedElement.textContent = currentPhrase.slice(0, charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                isErasing = true;
                setTimeout(type, pauseAfterTyping);
            }
        } else {
            // Apagando
            if (charIndex >= 0) {
                typedElement.textContent = currentPhrase.slice(0, charIndex);
                charIndex--;
                setTimeout(type, erasingSpeed);
            } else {
                isErasing = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, pauseAfterErasing);
            }
        }
    };

    type();
});

/* Parallax leve no hero */
document.addEventListener('DOMContentLoaded', () => {
    const hero = $('#hero');
    if (!hero) return;

    const applyParallax = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const offset = Math.min(scrollY * 0.15, 40);
        hero.style.transform = `translateY(${offset * -1}px)`;
    };

    applyParallax();
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(applyParallax);
    });
});

/* Botões "Solicitar Orçamento" -> pré-preenche mensagem do formulário */
document.addEventListener('DOMContentLoaded', () => {
    const budgetButtons = $$('.btn-card');
    const messageField = $('#mensagem');
    const nameField = $('#nome');
    const formSection = $('#contato');

    if (!budgetButtons.length || !messageField || !formSection) return;

    budgetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const service = button.getAttribute('data-budget') || 'Site Profissional';
            const template = `Olá, quero um orçamento para ${service.toLowerCase()}. Meu negócio é: `;
            if (!messageField.value || messageField.value === messageField.placeholder) {
                messageField.value = template;
            } else {
                messageField.value += `\n\nTambém tenho interesse em: ${service}.`;
            }
            if (nameField && !nameField.value) {
                nameField.focus();
            } else {
                messageField.focus();
            }

            const headerHeight = $('.header')?.offsetHeight || 0;
            const top = formSection.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
});

/* Validação do formulário + envio direto pro WhatsApp */
document.addEventListener('DOMContentLoaded', () => {
    const form = $('#contato-form');
    if (!form) return;

    const feedback = $('#form-feedback');

    const fields = {
        nome: $('#nome'),
        email: $('#email'),
        whatsapp: $('#whatsapp'),
        mensagem: $('#mensagem')
    };

    const errors = {
        nome: $('[data-error-for="nome"]'),
        email: $('[data-error-for="email"]'),
        whatsapp: $('[data-error-for="whatsapp"]'),
        mensagem: $('[data-error-for="mensagem"]')
    };

    const clearErrors = () => {
        Object.values(errors).forEach(span => {
            if (span) span.textContent = '';
        });
        Object.values(fields).forEach(field => {
            if (field) field.classList.remove('error');
        });
        if (feedback) {
            feedback.textContent = '';
            feedback.classList.remove('success', 'error');
        }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrors();

        let valid = true;

        const nome = fields.nome.value.trim();
        const email = fields.email.value.trim();
        const whats = fields.whatsapp.value.trim();
        const msg = fields.mensagem.value.trim();

        if (!nome) {
            errors.nome.textContent = 'Informe seu nome.';
            fields.nome.classList.add('error');
            valid = false;
        }

        if (!email) {
            errors.email.textContent = 'Informe seu e-mail.';
            fields.email.classList.add('error');
            valid = false;
        } else if (!emailRegex.test(email)) {
            errors.email.textContent = 'Informe um e-mail válido.';
            fields.email.classList.add('error');
            valid = false;
        }

        if (!msg) {
            errors.mensagem.textContent = 'Descreva brevemente o que você precisa.';
            fields.mensagem.classList.add('error');
            valid = false;
        }

        if (!valid) {
            if (feedback) {
                feedback.textContent = 'Confira os campos destacados e tente novamente.';
                feedback.classList.add('error');
            }
            return;
        }

        // Monta a mensagem que vai pro WhatsApp
        const texto = 
`Olá, meu nome é ${nome}.

Quero falar sobre um site profissional.

E-mail: ${email}
WhatsApp: ${whats || 'não informado'}

Mensagem:
${msg}`;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

        if (feedback) {
            feedback.textContent = 'Abrindo seu WhatsApp...';
            feedback.classList.add('success');
        }

        // Abre o WhatsApp (app ou web)
        window.open(url, '_blank');

        form.reset();
    });
});