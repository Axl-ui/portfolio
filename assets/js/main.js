// =============================================
//  PORTFOLIO — AXL KENJI M. GARCIA
//  10/10 Edition — Final
// =============================================

// ─── Lenis Smooth Scroll (safe init — moved inside DOMContentLoaded below) ───
let lenis = null;

// ─── Scroll Progress Bar ─────────────────────
(function () {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function updateBar() {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateBar, { passive: true });
})();

// ─── Loading Screen ───────────────────────────
(function () {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;
    const loadText = screen.querySelector('.loading-text');
    const phrases = ['Initializing...', 'Loading Assets...', 'Almost Ready...'];
    let pi = 0;
    const interval = setInterval(() => {
        pi++;
        if (loadText && pi < phrases.length) loadText.textContent = phrases[pi];
    }, 480);
    window.addEventListener('load', function () {
        clearInterval(interval);
        setTimeout(function () {
            screen.classList.add('hidden');
            document.body.classList.add('loaded');
        }, 1500);
    });
})();

document.addEventListener('DOMContentLoaded', function () {

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Lenis Smooth Scroll ──────────────────
    try {
        if (!prefersReduced && typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.3,
                easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.9,
                touchMultiplier: 1.8,
            });
            function rafLoop(time) {
                lenis.raf(time);
                requestAnimationFrame(rafLoop);
            }
            requestAnimationFrame(rafLoop);
        }
    } catch (e) {
        lenis = null; // CDN failed — fall back to native scroll silently
    }

    // ─── Navbar ───────────────────────────────
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('open');
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
            });
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));

    // ─── Back to Top ──────────────────────────
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            if (lenis) lenis.scrollTo(0, { duration: 1.6 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Magnetic Buttons ─────────────────────
    if (!prefersReduced && window.innerWidth > 768) {
        document.querySelectorAll('.btn, .btn-primary-custom, .btn-outline-custom, .btn-submit').forEach(btn => {
            btn.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * 0.28;
                const dy = (e.clientY - cy) * 0.28;
                this.style.transform = `translate(${dx}px, ${dy}px)`;
            });
            btn.addEventListener('mouseleave', function () {
                this.style.transform = '';
            });
        });
    }

    // ─── 3D Tilt on Project Cards ─────────────
    if (!prefersReduced && window.innerWidth > 768) {
        document.querySelectorAll('.project-full-card').forEach(card => {
            card.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
                const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
                this.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
                this.style.animation = 'none'; // pause float while tilting
            });
            card.addEventListener('mouseleave', function () {
                this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
                this.style.transition = 'transform 0.5s ease';
                this.style.animation = '';
            });
            card.addEventListener('mouseenter', function () {
                this.style.transition = 'transform 0.1s ease';
            });
        });
    }

    // ─── Hero Card Scroll Parallax ────────────
    if (!prefersReduced && window.innerWidth > 768) {
        const heroCard = document.querySelector('.hero-card');
        if (heroCard) {
            window.addEventListener('scroll', () => {
                const y = window.scrollY;
                if (y < window.innerHeight) {
                    heroCard.style.transform = `translateY(${y * 0.07}px)`;
                }
            }, { passive: true });
        }
    }

    // ─── Scroll Reveal — Varied per section ───
    function getRevealConfig(el) {
        const section = el.closest('section');
        if (!section) return { x: 0, y: 30, rotate: 0 };
        const id = section.id;
        if (id === 'skills')        return { x: 0, y: 0, scale: 0.85, rotate: -3 };
        if (id === 'projects')      return { x: -40, y: 0, rotate: 0 };
        if (id === 'experience')    return { x: 40, y: 0, rotate: 0 };
        if (id === 'certificates')  return { x: 0, y: 30, rotate: 0 };
        if (id === 'contact')       return { x: 0, y: 40, rotate: 0 };
        return { x: 0, y: 32, rotate: 0 };
    }

    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach(el => {
        if (prefersReduced) { el.classList.add('visible'); return; }
        const cfg = getRevealConfig(el);
        el.style.opacity = '0';
        el.style.transform = `translateX(${cfg.x || 0}px) translateY(${cfg.y || 0}px) scale(${cfg.scale || 1}) rotate(${cfg.rotate || 0}deg)`;
    });

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const siblings = Array.from(el.parentElement.querySelectorAll('.reveal:not(.visible)'));
            const delay = Math.min(siblings.indexOf(el) * 80, 400);
            setTimeout(() => {
                el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
                el.style.opacity = '1';
                el.style.transform = 'translateX(0) translateY(0) scale(1) rotate(0deg)';
                el.classList.add('visible');
                // Clear inline styles after transition so CSS class takes over
                setTimeout(() => {
                    el.style.opacity = '';
                    el.style.transform = '';
                    el.style.transition = '';
                }, 800);
            }, delay);
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.08 });
    revealEls.forEach(el => { if (!prefersReduced) revealObserver.observe(el); });

    // ─── Skill Cards — stagger fan-in ─────────
    const skillCards = document.querySelectorAll('.skill-card');
    if (!prefersReduced) {
        skillCards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.88)';
        });
        const skillObsv = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const cards = entry.target.querySelectorAll('.skill-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 45}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 45}ms`;
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, i * 45);
                });
                skillObsv.unobserve(entry.target);
            });
        }, { threshold: 0.1 });
        const grid = document.querySelector('.skill-cards-grid');
        if (grid) skillObsv.observe(grid);
    }

    // ─── Skill bar fill ───────────────────────
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (skillBars.length) {
        const skillBarObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    setTimeout(() => { bar.style.width = bar.getAttribute('data-width') + '%'; }, 200);
                    skillBarObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });
        skillBars.forEach(bar => skillBarObserver.observe(bar));
    }

    // ─── Stats Counter ────────────────────────
    const statNums = document.querySelectorAll('.stat-number');
    if (statNums.length) {
        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1800;
            const start = performance.now();
            function update(now) {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 4);
                el.textContent = Math.floor(eased * target) + suffix;
                if (t < 1) requestAnimationFrame(update);
                else el.textContent = target + suffix;
            }
            requestAnimationFrame(update);
        }
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        statNums.forEach(el => counterObserver.observe(el));
    }

    // ─── Contact Form ─────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn   = document.getElementById('submitBtn');
            const btnText     = submitBtn.querySelector('.btn-submit-text');
            const btnLoading  = submitBtn.querySelector('.btn-submit-loading');
            const formSuccess = document.getElementById('formSuccess');
            const formError   = document.getElementById('formError');
            btnText.style.display     = 'none';
            btnLoading.style.display  = 'flex';
            submitBtn.disabled        = true;
            formSuccess.style.display = 'none';
            formError.style.display   = 'none';
            const name    = document.getElementById('contactName').value;
            const email   = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            fetch('https://formspree.io/f/mqejjwqr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            })
            .then(response => {
                btnText.style.display    = 'flex';
                btnLoading.style.display = 'none';
                submitBtn.disabled       = false;
                if (response.ok) {
                    formSuccess.style.display = 'flex';
                    contactForm.reset();
                } else {
                    formError.style.display = 'flex';
                }
            })
            .catch(() => {
                btnText.style.display    = 'flex';
                btnLoading.style.display = 'none';
                submitBtn.disabled       = false;
                formError.style.display  = 'flex';
            });
        });
    }

    // ─── Section Title Reveal (split chars) ───
    if (!prefersReduced) {
        document.querySelectorAll('.section-title').forEach(title => {
            const text = title.textContent;
            title.innerHTML = text.split('').map((ch, i) =>
                `<span class="stitle-char" style="animation-delay:${i * 28}ms">${ch === ' ' ? '&nbsp;' : ch}</span>`
            ).join('');
            title.classList.add('stitle-split');
        });

        const titleObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('stitle-animate');
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.stitle-split').forEach(el => titleObserver.observe(el));
    }

    // ─── Parallax on Hero BG circles ─────────
    if (!prefersReduced && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            const c1 = document.querySelector('.hero-bg-circle--1');
            const c2 = document.querySelector('.hero-bg-circle--2');
            if (c1) c1.style.transform = `translateY(${y * 0.18}px)`;
            if (c2) c2.style.transform = `translateY(${y * -0.12}px)`;
        }, { passive: true });
    }

    // ─── Lightbox ─────────────────────────────
    (function () {
        const lightbox   = document.getElementById('lightbox');
        const lbImg      = document.getElementById('lightboxImg');
        const lbCaption  = document.getElementById('lightboxCaption');
        const lbClose    = document.getElementById('lightboxClose');
        const lbPrev     = document.getElementById('lightboxPrev');
        const lbNext     = document.getElementById('lightboxNext');
        const lbDots     = document.getElementById('lightboxDots');
        if (!lightbox) return;

        // Build gallery registry
        const galleries = {};
        document.querySelectorAll('.lightbox-trigger').forEach(el => {
            const gid = el.dataset.gallery;
            if (!galleries[gid]) galleries[gid] = [];
            const src = el.src || el.dataset.src || '';
            galleries[gid].push({ src, caption: el.dataset.caption || '', el });
        });

        let currentGallery = null;
        let currentIndex   = 0;

        function buildDots(gallery, active) {
            lbDots.innerHTML = '';
            galleries[gallery].forEach((_, i) => {
                const btn = document.createElement('button');
                btn.className = 'lightbox-dot' + (i === active ? ' active' : '');
                btn.setAttribute('aria-label', `Go to image ${i+1}`);
                btn.addEventListener('click', () => goTo(i));
                lbDots.appendChild(btn);
            });
        }

        function goTo(index) {
            const items = galleries[currentGallery];
            if (!items) return;
            currentIndex = (index + items.length) % items.length;
            lbImg.style.opacity = '0';
            lbImg.style.transform = 'scale(0.95)';
            setTimeout(() => {
                lbImg.src = items[currentIndex].src;
                lbCaption.textContent = items[currentIndex].caption;
                lbImg.style.opacity = '1';
                lbImg.style.transform = 'scale(1)';
                lbImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                buildDots(currentGallery, currentIndex);
            }, 180);
        }

        function openLightbox(gallery, index) {
            currentGallery = gallery;
            currentIndex   = index;
            const items = galleries[gallery];
            lbImg.src = items[index].src;
            lbCaption.textContent = items[index].caption;
            lbImg.style.opacity = '1';
            lbImg.style.transform = '';
            buildDots(gallery, index);
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
            setTimeout(() => { lbImg.src = ''; }, 400);
        }

        document.querySelectorAll('.lightbox-trigger').forEach(el => {
            el.addEventListener('click', () => {
                openLightbox(el.dataset.gallery, parseInt(el.dataset.index));
            });
        });

        lbClose.addEventListener('click', closeLightbox);
        lbPrev.addEventListener('click', () => goTo(currentIndex - 1));
        lbNext.addEventListener('click', () => goTo(currentIndex + 1));

        // Keyboard support
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape')      closeLightbox();
            if (e.key === 'ArrowLeft')   goTo(currentIndex - 1);
            if (e.key === 'ArrowRight')  goTo(currentIndex + 1);
        });

        // Click backdrop to close
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
    })();

});

// ─── Hero Particles (cursor-reactive) ────────
(function () {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    let mouse = { x: -999, y: -999 };

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    canvas.parentElement.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = -999; mouse.y = -999;
    });

    const PARTICLE_COUNT = 65;
    const CONNECT_DIST   = 120;
    const MOUSE_DIST     = 140;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * 1000,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.55 + 0.15
    }));

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const md  = Math.sqrt(mdx * mdx + mdy * mdy);
            if (md < MOUSE_DIST && md > 0) {
                const force = (MOUSE_DIST - md) / MOUSE_DIST;
                p.x += (mdx / md) * force * 2.2;
                p.y += (mdy / md) * force * 2.2;
            }
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            p.x = Math.max(0, Math.min(W, p.x));
            p.y = Math.max(0, Math.min(H, p.y));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(201,168,76,${0.12 * (1 - d / CONNECT_DIST)})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < MOUSE_DIST * 0.8) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(201,168,76,${0.22 * (1 - d / (MOUSE_DIST * 0.8))})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        });

        requestAnimationFrame(draw);
    }
    draw();
})();

// ─── Typed Animation ──────────────────────────
(function () {
    const el = document.getElementById('typedText');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = 'Full-Stack Developer'; return;
    }
    const words = ['Full-Stack Developer', 'PHP Developer', 'Systems Designer', 'Web Developer'];
    let wi = 0, ci = 0, deleting = false;
    const speed = { type: 85, delete: 45, pause: 2000 };
    function type() {
        const word = words[wi];
        if (!deleting) {
            el.textContent = word.slice(0, ++ci);
            if (ci === word.length) { deleting = true; setTimeout(type, speed.pause); return; }
        } else {
            el.textContent = word.slice(0, --ci);
            if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        }
        setTimeout(type, deleting ? speed.delete : speed.type);
    }
    setTimeout(type, 1000);
})();

// ─── Gallery (unchanged logic) ────────────────
var galleryState = {};
function goSlide(id, index) {
    var slider = document.getElementById('gallery-' + id);
    if (!slider) return;
    var slides = slider.querySelectorAll('.gallery-slide');
    var dots   = slider.parentElement.querySelectorAll('.gallery-dot');
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i)   => d.classList.toggle('active', i === index));
    galleryState[id] = index;
}
function nextSlide(id) {
    var slider = document.getElementById('gallery-' + id);
    if (!slider) return;
    var total = slider.querySelectorAll('.gallery-slide').length;
    goSlide(id, ((galleryState[id] || 0) + 1) % total);
}
function prevSlide(id) {
    var slider = document.getElementById('gallery-' + id);
    if (!slider) return;
    var total = slider.querySelectorAll('.gallery-slide').length;
    goSlide(id, ((galleryState[id] || 0) - 1 + total) % total);
}
setInterval(() => nextSlide('nehemiah'), 4000);
setInterval(() => nextSlide('sunhrise'), 4500);
