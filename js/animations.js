/*
══════════════════════════════════════════════════════════════════
M0NARQ AI - PREMIUM ANIMATION SYSTEM
PERFORMANCE OPTIMIZED - Lazy loading + Batched ScrollTriggers
══════════════════════════════════════════════════════════════════
*/

class M0NARQ_Animations {
  constructor() {
    // ✅ Kill loader first
    this.killLoader();

    // Validate dependencies
    if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
      console.error('CRITICAL: GSAP or Lenis failed to load from CDN');
      return;
    }

    // Init in correct order
    this.initGSAP();
    this.initLenis();
    this.initMenu();
    this.initScrollAnimations(); // Now batched
    this.initHoverEffects();
    this.detectPage();
    
    // ✅ Lazy load videos
    this.lazyVideos();
    
    // Start animations immediately
    this.animatePageEntry();
    
    // ✅ Conditional mix-blend-mode for header
    this.initHeaderBlend();
    
    // Performance: RAF-based throttled resize
    let ticking = false;
    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // BULLETPROOF LOADER REMOVAL
  // ═══════════════════════════════════════════════════════════════
  killLoader() {
    const loaders = document.querySelectorAll('.loader, [data-loader]');
    loaders.forEach(loader => loader.remove());
    
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
    
    console.log('✅ Loader nuked');
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. GSAP CORE SETUP
  // ═══════════════════════════════════════════════════════════════
  initGSAP() {
    gsap.registerPlugin(ScrollTrigger, CustomEase);

    CustomEase.create("customGentle", "M0,0 C0,0.202 0.204,1 1,1");
    CustomEase.create("customStrong", "M0,0 C0.496,0.004 0,1 1,1");

    gsap.defaults({
      ease: "power2.out",
      duration: 0.6
    });

    console.log('✅ GSAP initialized');
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. LENIS SMOOTH SCROLL (✅ OPTIMIZED DURATION)
  // ═══════════════════════════════════════════════════════════════
  initLenis() {
    this.lenis = new Lenis({
      duration: 0.7,  // ✅ Changed from 1.2 → 0.7 for snappier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    const lenisRAF = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(lenisRAF);
    };
    
    requestAnimationFrame(lenisRAF);
    console.log('✅ Lenis (0.7s duration)');
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ LAZY VIDEO LOADING (New)
  // ═══════════════════════════════════════════════════════════════
  lazyVideos() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const vid = entry.target;
            if (!vid.dataset._hydrated) {
              vid.load();
              vid.dataset._hydrated = '1';
              console.log('📹 Video loaded:', vid.src);
            }
            observer.unobserve(vid);
          }
        });
      },
      { rootMargin: '200px' }
    );

    document.querySelectorAll('.project-video').forEach(v => {
      v.setAttribute('preload', 'none'); // Force lazy
      observer.observe(v);
    });

    console.log('✅ Lazy video observer active');
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ CONDITIONAL HEADER BLEND MODE (New)
  // ═══════════════════════════════════════════════════════════════
  initHeaderBlend() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero-section, .project-hero, .page-hero');
    
    if (!header || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.body.classList.add('is-at-hero');
        } else {
          document.body.classList.remove('is-at-hero');
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
    console.log('✅ Header blend observer active');
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. PAGE ENTRY
  // ═══════════════════════════════════════════════════════════════
  animatePageEntry() {
    const heroTitle = document.querySelector('.hero-title, .project-title-main');
    const titleLines = heroTitle?.querySelectorAll('.title-line');
    const heroImage = document.querySelector('.hero-section .image-wrapper img, .page-hero .image-wrapper img, .project-hero .hero-video');
    const heroMeta = document.querySelectorAll('.hero-subtitle, .project-subtitle, .hero-section .stats li');

    const tl = gsap.timeline();

    if (titleLines && titleLines.length > 0) {
      gsap.set(titleLines, {
        autoAlpha: 0,
        rotation: 7,
        yPercent: 100
      });

      tl.to(titleLines, {
        autoAlpha: 1,
        rotation: 0,
        yPercent: 0,
        stagger: 0.12,
        duration: 1,
        ease: "customGentle",
        onStart: () => {
          gsap.set(titleLines, { willChange: 'transform' });
        },
        onComplete: () => {
          gsap.set(titleLines, { clearProps: 'willChange' });
        }
      }, 0.2);
    }

    if (heroImage) {
      gsap.set(heroImage, {
        scale: 1.3,
        transformOrigin: "center center"
      });

      tl.to(heroImage, {
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        clearProps: "scale"
      }, 0);
    }

    if (heroMeta.length > 0) {
      gsap.set(heroMeta, { autoAlpha: 0, y: 20 });

      tl.to(heroMeta, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      }, 0.6);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. MENU
  // ═══════════════════════════════════════════════════════════════
  initMenu() {
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    const burger = document.querySelector('.burger');
    const burgerLines = document.querySelectorAll('.burger-line');
    const menuItems = document.querySelectorAll('.menu-item');

    if (!menuButton || !menuOverlay) {
      console.warn('⚠️ Menu elements not found');
      return;
    }

    let isMenuOpen = false;

    menuButton.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      isMenuOpen ? this.openMenu(menuOverlay, burger, burgerLines, menuItems) : this.closeMenu(menuOverlay, burger, burgerLines, menuItems);
    });

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        if (isMenuOpen) {
          this.closeMenu(menuOverlay, burger, burgerLines, menuItems);
          isMenuOpen = false;
        }
      });
    });
    
    console.log('✅ Menu initialized');
  }

  openMenu(overlay, burger, lines, items) {
    if (this.lenis) this.lenis.stop();

    gsap.fromTo(overlay,
      { clipPath: "circle(0% at 100% 0%)" },
      {
        clipPath: "circle(141.42% at 100% 0%)",
        duration: 0.8,
        ease: "power3.inOut"
      }
    );

    overlay.classList.add('is-active');
    burger.classList.add('is-active');

    const [top, middle, bottom] = lines;
    gsap.to(top, { y: 8, rotation: 45, transformOrigin: "center", duration: 0.3, ease: "power2.inOut" });
    gsap.to(middle, { autoAlpha: 0, duration: 0.1 });
    gsap.to(bottom, { y: -8, rotation: -45, transformOrigin: "center", duration: 0.3, ease: "power2.inOut" });

    gsap.fromTo(items,
      { autoAlpha: 0, y: 30, rotation: -5 },
      {
        autoAlpha: 1,
        y: 0,
        rotation: 0,
        stagger: 0.08,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out"
      }
    );
  }

  closeMenu(overlay, burger, lines, items) {
    if (this.lenis) this.lenis.start();

    gsap.to(overlay, {
      clipPath: "circle(0% at 100% 0%)",
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => overlay.classList.remove('is-active')
    });

    burger.classList.remove('is-active');

    const [top, middle, bottom] = lines;
    gsap.to(top, { y: 0, rotation: 0, duration: 0.3, ease: "power2.inOut" });
    gsap.to(middle, { autoAlpha: 1, duration: 0.2 });
    gsap.to(bottom, { y: 0, rotation: 0, duration: 0.3, ease: "power2.inOut" });
    gsap.to(items, { autoAlpha: 0, duration: 0.2 });
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. SCROLL ANIMATIONS (✅ BATCHED)
  // ═══════════════════════════════════════════════════════════════
  initScrollAnimations() {
    
    // ✅ BATCHED TITLE ANIMATIONS
    ScrollTrigger.batch('[data-animate="title"], [data-animate="title-split"]', {
      start: 'top 80%',
      onEnter: batch => {
        batch.forEach(element => {
          const lines = element.querySelectorAll('.title-line');
          if (lines.length > 0) {
            gsap.fromTo(lines,
              { autoAlpha: 0, rotation: 7, yPercent: 100 },
              {
                autoAlpha: 1,
                rotation: 0,
                yPercent: 0,
                stagger: 0.1,
                duration: 1,
                ease: "customGentle",
                onStart: () => gsap.set(lines, { willChange: 'transform' }),
                onComplete: () => gsap.set(lines, { clearProps: 'willChange' })
              }
            );
          }
        });
      }
    });

    // ✅ BATCHED FADE-UP
    ScrollTrigger.batch('[data-animate="fade-up"]', {
      start: 'top 85%',
      onEnter: batch => gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: { each: 0.08 }
      })
    });

    // Set initial state for fade-ups
    gsap.set('[data-animate="fade-up"]', { autoAlpha: 0, y: 30 });

    // ✅ BATCHED STAGGER CHILDREN
    ScrollTrigger.batch('[data-stagger-children]', {
      start: 'top 70%',
      onEnter: batch => {
        batch.forEach(parent => {
          const children = parent.querySelectorAll('[data-animate]');
          if (children.length > 0) {
            gsap.fromTo(children,
              { autoAlpha: 0, y: 30, scale: 0.95 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: { amount: 0.8, from: "start" },
                duration: 0.8,
                ease: "power2.out"
              }
            );
          }
        });
      }
    });

    // ✅ PARALLAX (kept individual - needs scrub)
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.5;

      gsap.to(el, {
        y: () => -(el.offsetHeight * speed * 0.2),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });

    // ✅ BATCHED PROJECT CARDS
    ScrollTrigger.batch('.project-card', {
      start: 'top 80%',
      onEnter: batch => gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: { each: 0.15 }
      })
    });

    gsap.set('.project-card', { autoAlpha: 0, y: 80, scale: 0.95 });

    // ✅ FOOTER
    const footer = document.querySelector('.footer');
    if (footer) {
      gsap.fromTo(footer,
        { y: 100, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: footer, start: "top 90%" }
        }
      );
    }
    
    console.log('✅ Scroll animations (batched)');
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. HOVER EFFECTS (✅ NO EAGER VIDEO LOAD)
  // ═══════════════════════════════════════════════════════════════
  initHoverEffects() {
    
    document.querySelectorAll('.project-card').forEach(card => {
      const image = card.querySelector('.project-image');
      const video = card.querySelector('.project-video');

      if (!video) return;

      // ✅ Removed video.load() - now handled by lazyVideos()

      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.02, duration: 0.4, ease: "power2.out" });
        
        const tl = gsap.timeline();
        tl.to(image, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(video, {
            autoAlpha: 1,
            duration: 0.3,
            onStart: () => {
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.warn('Video autoplay blocked:', error.message);
                });
              }
            }
          }, 0);
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.4, ease: "power2.out" });
        
        const tl = gsap.timeline();
        tl.to(video, {
          autoAlpha: 0,
          duration: 0.2,
          onComplete: () => {
            video.pause();
            video.currentTime = 0;
          }
        }, 0)
        .to(image, { autoAlpha: 1, duration: 0.2 }, 0);
      });
    });

    // ✅ BUTTONS
    document.querySelectorAll('.button').forEach(btn => {
      const arrow = btn.querySelector('.arrow');
      btn.addEventListener('mouseenter', () => {
        if (arrow) gsap.to(arrow, { x: 5, duration: 0.3, ease: "power2.out" });
      });
      btn.addEventListener('mouseleave', () => {
        if (arrow) gsap.to(arrow, { x: 0, duration: 0.3, ease: "power2.out" });
      });
    });
    
    console.log('✅ Hover effects (lazy video load)');
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. PAGE-SPECIFIC ANIMATIONS
  // ═══════════════════════════════════════════════════════════════
  detectPage() {
    const body = document.body;

    if (body.classList.contains('page-home')) this.initHomepage();
    if (body.classList.contains('page-studio')) this.initStudioPage();
    if (body.classList.contains('page-story')) this.initStoryPage();
    if (body.classList.contains('page-project')) this.initProjectPage();
  }

  initHomepage() {
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
      const text = stat.textContent.trim();
      const value = parseFloat(text);
      
      if (!isNaN(value)) {
        gsap.fromTo(stat,
          { textContent: 0 },
          {
            textContent: value,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            scrollTrigger: { trigger: stat, start: "top 80%" }
          }
        );
      }
    });
  }

  initStudioPage() {}
  initStoryPage() {}
  initProjectPage() {}

  refresh() {
    ScrollTrigger.refresh();
  }

  destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.globalTimeline.clear();
    if (this.lenis) this.lenis.destroy();
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.m0narqAnimations = new M0NARQ_Animations();
  });
} else {
  window.m0narqAnimations = new M0NARQ_Animations();
}