/* ============================================
   Vishal Vijay — Portfolio
   Scroll reveals, navbar, mobile menu, scroll-spy
   ============================================ */

   (() => {
    'use strict';

    // -----------------------------------------
    // Scroll reveal via IntersectionObserver
    // -----------------------------------------
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((el) => revealObserver.observe(el));

    // -----------------------------------------
    // Navbar scrolled state
    // -----------------------------------------
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        if (window.scrollY > 32) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // -----------------------------------------
    // Active section highlighting (scroll-spy)
    // -----------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        'active',
                        link.dataset.section === id
                    );
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach((section) => sectionObserver.observe(section));

    // -----------------------------------------
    // Mobile menu toggle
    // -----------------------------------------
    const toggle = document.querySelector('.nav-toggle');
    const navLinksWrap = document.querySelector('.nav-links');

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        navLinksWrap.classList.toggle('open');
    });

    // Close menu when a link is clicked (mobile)
    navLinksWrap.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            toggle.setAttribute('aria-expanded', 'false');
            navLinksWrap.classList.remove('open');
        }
    });

    // -----------------------------------------
    // Smooth scroll respects reduced-motion
    // (native smooth-scroll already applied via CSS,
    // but we intercept to handle edge cases gracefully)
    // -----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const target = anchor.getAttribute('href');
            if (target === '#' || target.length < 2) return;
            const el = document.querySelector(target);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // -----------------------------------------
    // Expandable experience cards
    // -----------------------------------------
    document.querySelectorAll('.exp-card[data-expandable]').forEach((card) => {
        const header = card.querySelector('.exp-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isOpen = card.classList.toggle('expanded');
            header.setAttribute('aria-expanded', String(isOpen));
        });

        // Keyboard: Enter / Space already handled natively for <button>,
        // but we also allow Escape to close
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                header.setAttribute('aria-expanded', 'false');
                header.blur();
            }
        });
    });

    // -----------------------------------------
    // Email copy-to-clipboard
    // -----------------------------------------
    const emailCopyBtn = document.getElementById('emailCopy');
    const emailAddress = document.getElementById('emailAddress');

    if (emailCopyBtn && emailAddress) {
        emailCopyBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = emailAddress.textContent.trim();

            try {
                await navigator.clipboard.writeText(email);
            } catch {
                // Fallback for older browsers / insecure contexts
                const textarea = document.createElement('textarea');
                textarea.value = email;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try { document.execCommand('copy'); } catch { /* no-op */ }
                document.body.removeChild(textarea);
            }

            emailCopyBtn.classList.add('copied');
            setTimeout(() => {
                emailCopyBtn.classList.remove('copied');
            }, 1800);
        });
    }
})();