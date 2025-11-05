/*
══════════════════════════════════════════════════════════════════
M0NARQ AI - PREMIUM ANIMATION SYSTEM
Based on Exo Ape patterns + performance optimizations
Butter-smooth 60fps scrolling with Lenis
══════════════════════════════════════════════════════════════════
*/

class M0NARQ_Animations {
  constructor() {
    // Performance: Debounced resize handler
    this.resizeTimeout = null;
    this.windowSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Init in correct order
    this.initGSAP();
    this.initLenis();
    this.initLoader();
    this.initMenu();
    this.initScrollAnimations();
    this.initHoverEffects();
    this.detectPage();
    
    // Performance: Debounced resize
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.windowSize.width = window.innerWidth;
        this.windowSize.height = window.innerHeight;
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. GSAP CORE SETUP
  // ═══════════════════════════════════════════════════════════════
  initGSAP() {
    gsap.registerPlugin(ScrollTrigger, CustomEase);

    // ✅ Exo Ape custom easing curves
    CustomEase.create("customGentle", "M0,0 C0,0.202 0.204,1 1,1");
    CustomEase.create("customStrong", "M0,0 C0.496,0.004 0,1 1,1");

    // Defaults
    gsap.defaults({
      ease: "power2.out",
      duration: 0.6
    });

    // Performance: Set will-change on elements that will animate
    gsap.set('[data-animate], .project-card, .title-line', {
      willChange: 'transform'
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. LENIS SMOOTH SCROLL - ✅ OPTIMIZED
  // ═══════════════════════════════════════════════════════════════
  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false, // Disable on touch for better performance
      touchMultiplier: 2,
    });

    // ✅ Start stopped until page loads
    this.lenis.stop();

    // Sync with GSAP
    this.lenis.on('scroll', ScrollTrigger.update);

    const lenisRAF = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(lenisRAF);
    };
    
    requestAnimationFrame(lenisRAF);
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. LOADER - ✅ COMPLETELY REWRITTEN
  // ═══════════════════════════════════════════════════════════════
  initLoader() {
    const loader = document.querySelector('.loader');
    const loaderCircle = document.querySelector('.loader-circle');

    if (!loader) {
      // No loader, just show page
      this.showPage();
      return;
    }

    // ✅ Animate loader circle
    if (loaderCircle) {
      gsap.to(loaderCircle, {
        rotation: 360,
        duration: 1,
        ease: "linear",
        repeat: -1
      });
    }

    // ✅ Wait for EVERYTHING to load
    const assetsLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });

    const fontsLoaded = document.fonts.ready;

    Promise.all([assetsLoaded, fontsLoaded]).then(() => {
      // ✅ Minimum display time for smooth UX
      const minDisplayTime = new Promise(resolve => setTimeout(resolve, 800));
      
      minDisplayTime.then(() => {
        // Fade out loader
        const tl = gsap.timeline({
          onComplete: () => {
            loader.style.display = 'none';
            this.showPage();
          }
        });

        tl.to(loader, {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. SHOW PAGE - ✅ SMOOTH REVEAL
  // ═══════════════════════════════════════════════════════════════
  showPage() {
    const body = document.body;
    const html = document.documentElement;

    // ✅ Enable scrolling
    html.style.overflow = '';
    body.style.overflow = '';

    // ✅ Reveal body with smooth fade
    gsap.to(body, {
      opacity: 1,
      visibility: 'visible',
      duration: 0.4,
      ease: "power1.out",
      onComplete: () => {
        // Start Lenis smooth scroll
        this.lenis.start();
        
        // Trigger page entry animations
        this.animatePageEntry();
        
        // Performance: Clear will-change after animations
        setTimeout(() => {
          gsap.set('[data-animate], .project-card, .title-line', {
            clearProps: 'willChange'
          });
        }, 2000);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. PAGE ENTRY - ✅ EXO APE PATTERN
  // ═══════════════════════════════════════════════════════════════
  animatePageEntry() {
    const heroTitle = document.querySelector('.hero-title, .project-title-main');
    const titleLines = heroTitle?.querySelectorAll('.title-line');
    const heroImage = document.querySelector('.hero-section .image-wrapper img, .page-hero .image-wrapper img, .project-hero .hero-video');
    const heroMeta = document.querySelectorAll('.hero-subtitle, .project-subtitle, .hero-section .stats li');

    const tl = gsap.timeline();

    // ✅ Title lines - Exo Ape pattern
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
        clearProps: "all"
      }, 0.2);
    }

    // ✅ Hero image zoom
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

    // ✅ Metadata fade
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
  // 6. MENU - ✅ CIRCULAR REVEAL (EXO APE)
  // ═══════════════════════════════════════════════════════════════
  initMenu() {
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    const burger = document.querySelector('.burger');
    const burgerLines = document.querySelectorAll('.burger-line');
    const menuItems = document.querySelectorAll('.menu-item');

    if (!menuButton || !menuOverlay) return;

    let isMenuOpen = false;

    menuButton.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      isMenuOpen ? this.openMenu(menuOverlay, burger, burgerLines, menuItems) : this.closeMenu(menuOverlay, burger, burgerLines, menuItems);
    });

    // Close on link click
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        if (isMenuOpen) {
          this.closeMenu(menuOverlay, burger, burgerLines, menuItems);
          isMenuOpen = false;
        }
      });
    });
  }

  openMenu(overlay, burger, lines, items) {
    this.lenis.stop();

    // ✅ Circular reveal from top-right (Exo Ape pattern)
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

    // ✅ Burger → X
    const [top, middle, bottom] = lines;
    gsap.to(top, { y: 8, rotation: 45, transformOrigin: "center", duration: 0.3, ease: "power2.inOut" });
    gsap.to(middle, { autoAlpha: 0, duration: 0.1 });
    gsap.to(bottom, { y: -8, rotation: -45, transformOrigin: "center", duration: 0.3, ease: "power2.inOut" });

    // ✅ Menu items stagger
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
    this.lenis.start();

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
  // 7. SCROLL ANIMATIONS - ✅ ALL EXO APE PATTERNS
  // ═══════════════════════════════════════════════════════════════
  initScrollAnimations() {
    
    // ✅ TITLE ANIMATIONS
    gsap.utils.toArray('[data-animate="title"], [data-animate="title-split"]').forEach(element => {
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
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // ✅ FADE-UP
    gsap.utils.toArray('[data-animate="fade-up"]').forEach(el => {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });

    // ✅ STAGGER CHILDREN
    gsap.utils.toArray('[data-stagger-children]').forEach(parent => {
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
            ease: "power2.out",
            scrollTrigger: {
              trigger: parent,
              start: "top 70%"
            }
          }
        );
      }
    });

    // ✅ PARALLAX
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.5;

      gsap.to(el, {
        yPercent: -20 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });

    // ✅ PROJECT CARDS
    gsap.utils.toArray('.project-card').forEach(card => {
      gsap.fromTo(card,
        { autoAlpha: 0, y: 80, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%"
          }
        }
      );
    });

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
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. HOVER EFFECTS
  // ═══════════════════════════════════════════════════════════════
  initHoverEffects() {
    
    // ✅ PROJECT CARDS - Video crossfade
    document.querySelectorAll('.project-card').forEach(card => {
      const image = card.querySelector('.project-image');
      const video = card.querySelector('.project-video');

      if (!video) return;

      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.02, duration: 0.4, ease: "power2.out" });
        
        const tl = gsap.timeline();
        tl.to(image, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(video, {
            autoAlpha: 1,
            duration: 0.3,
            onStart: () => video.play().catch(() => {})
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
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. PAGE-SPECIFIC ANIMATIONS
  // ═══════════════════════════════════════════════════════════════
  detectPage() {
    const body = document.body;

    if (body.classList.contains('page-home')) this.initHomepage();
    if (body.classList.contains('page-studio')) this.initStudioPage();
    if (body.classList.contains('page-story')) this.initStoryPage();
    if (body.classList.contains('page-project')) this.initProjectPage();
  }

  initHomepage() {
    // Stats animation
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
      const value = parseFloat(stat.textContent);
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

  initStudioPage() {
    // No additional animations needed
  }

  initStoryPage() {
    // Story chapters already handled by scroll triggers
  }

  initProjectPage() {
    // Project specific animations already handled
  }

  // ═══════════════════════════════════════════════════════════════
  // 10. UTILITIES
  // ═══════════════════════════════════════════════════════════════
  refresh() {
    ScrollTrigger.refresh();
  }

  destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.globalTimeline.clear();
    this.lenis.destroy();
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
