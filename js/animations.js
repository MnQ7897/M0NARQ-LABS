/*
═══════════════════════════════════════════════════════════════════════════════
M0NARQ AI - COMPLETE ANIMATIONS SYSTEM (CORRECTED)
Based on Exo Ape Animation Patterns (35KB+ extracted from 12 JS files)

GSAP 3.12+ | ScrollTrigger | Lenis Smooth Scroll
Covers: index, studio, story + 4 project pages
═══════════════════════════════════════════════════════════════════════════════

DEPENDENCIES (Add to HTML <head>):
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/CustomEase.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>
<script src="js/animations.js" defer></script>

═══════════════════════════════════════════════════════════════════════════════
*/

class M0NARQ_Animations {
  constructor() {
    // Core setup
    this.initGSAP();
    this.initLenis();

    // Page initialization
    this.initLoader();
    this.initMenu();
    this.initScrollAnimations(); // ✅ FIXED: Removed typo
    this.initHoverEffects();

    // Page-specific
    this.detectPage();
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. GSAP CORE SETUP
  // ═══════════════════════════════════════════════════════════════
  initGSAP() {
    gsap.registerPlugin(ScrollTrigger, CustomEase);

    // Exo Ape custom easing curves (from 12 JS files)
    CustomEase.create("customGentle", "M0,0 C0,0.202 0.204,1 1,1");
    CustomEase.create("customStrong", "M0,0 C0.496,0.004 0,1 1,1");

    // Default settings
    gsap.defaults({
      ease: "power2.out",
      duration: 0.6
    });

    // Set initial states for animation elements
    gsap.set('[data-animate]', { willChange: 'transform' });
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. LENIS SMOOTH SCROLL (Exo Ape uses this)
  // ═══════════════════════════════════════════════════════════════
  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Sync with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. LOADER/PRELOADER (9fcf850.js pattern)
  // ✅ FIXED: Supports both SVG and DIV-based loaders
  // ═══════════════════════════════════════════════════════════════
  initLoader() {
    const loader = document.querySelector('.loader');
    const loaderCircle = document.querySelector('.loader-circle');

    if (!loader) return;

    const tl = gsap.timeline();

    // Handle loader circle animation (SVG or DIV)
    if (loaderCircle) {
      if (loaderCircle.tagName === 'circle' || loaderCircle.tagName === 'CIRCLE') {
        // SVG circle - use strokeDashoffset animation
        const circumference = 2 * Math.PI * 38; // Radius 38 (adjust if needed)
        gsap.set(loaderCircle, { 
          strokeDasharray: circumference,
          strokeDashoffset: 0,
          rotation: -90,
          transformOrigin: "center center"
        });

        gsap.to(loaderCircle, {
          strokeDashoffset: -circumference,
          rotation: 270,
          duration: 2,
          ease: "power2.inOut",
          repeat: -1
        });
      } else {
        // DIV-based loader - use simple rotation
        gsap.to(loaderCircle, {
          rotation: 360,
          duration: 1,
          ease: "linear",
          repeat: -1
        });
      }
    }

    // Fade out loader after delay
    tl.to(loader, {
      autoAlpha: 0,
      duration: 0.6,
      delay: 0.5,
      ease: "power2.out",
      onComplete: () => {
        loader.style.display = 'none';
        this.animatePageEntry();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. PAGE ENTRY ANIMATION (0efa5ea.js pattern)
  // ═══════════════════════════════════════════════════════════════
  animatePageEntry() {
    const pageContent = document.querySelector('.page-content');
    const heroTitle = document.querySelector('.hero-title');
    const titleLines = heroTitle?.querySelectorAll('.title-line');
    const heroImage = document.querySelector('.hero-section .image-wrapper img');
    const heroMeta = document.querySelectorAll('.hero-section p, .hero-section .button, .hero-section .stats');

    // Page clip path reveal (bottom-up)
    if (pageContent) {
      gsap.fromTo(pageContent, 
        {
          clipPath: "polygon(0% 100%, 100% 110%, 100% 100%, 0% 100%)",
          zIndex: 2
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "customStrong",
          clearProps: "clipPath,zIndex"
        }
      );

      // Simultaneous page zoom/rotation
      gsap.fromTo(pageContent,
        {
          scale: 1.3,
          rotation: 7,
          y: window.innerHeight / 2
        },
        {
          scale: 1,
          rotation: 0,
          y: 0,
          duration: 1,
          ease: "customStrong",
          clearProps: "all"
        }
      );
    }

    // Hero title lines (67eac05.js pattern)
    if (titleLines && titleLines.length > 0) {
      gsap.fromTo(titleLines,
        {
          autoAlpha: 0,
          rotation: 7,
          yPercent: 100
        },
        {
          autoAlpha: 1,
          rotation: 0,
          yPercent: 0,
          stagger: 0.12,
          duration: 1,
          delay: 0.2,
          ease: "customGentle",
          clearProps: "all"
        }
      );
    }

    // Hero image zoom (7bc4024.js pattern)
    if (heroImage) {
      gsap.fromTo(heroImage,
        {
          scale: 1.3,
          transformOrigin: "center center"
        },
        {
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          clearProps: "scale"
        }
      );
    }

    // Hero metadata fade
    if (heroMeta.length > 0) {
      gsap.fromTo(heroMeta,
        { autoAlpha: 0, y: 20 },
        { 
          autoAlpha: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.4,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. MENU SYSTEM (9fcf850.js pattern)
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

      if (isMenuOpen) {
        this.openMenu(menuOverlay, burger, burgerLines, menuItems);
      } else {
        this.closeMenu(menuOverlay, burger, burgerLines, menuItems);
      }
    });

    // Close menu when clicking menu links
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
    // Stop scrolling
    this.lenis.stop();

    // Menu overlay - circular reveal from top-right
    gsap.fromTo(overlay,
      { clipPath: "circle(0% at 100% 0%)" },
      {
        clipPath: "circle(141.42% at 100% 0%)", // sqrt(2) * 100%
        duration: 0.8,
        ease: "power3.inOut"
      }
    );

    overlay.classList.add('is-active');
    burger.classList.add('is-active');

    // Burger icon animation (hamburger → X)
    const [top, middle, bottom] = lines;

    gsap.to(top, {
      y: 8,
      rotation: 45,
      transformOrigin: "center",
      duration: 0.3,
      ease: "power2.inOut"
    });

    gsap.to(middle, {
      autoAlpha: 0,
      duration: 0.1
    });

    gsap.to(bottom, {
      y: -8,
      rotation: -45,
      transformOrigin: "center",
      duration: 0.3,
      ease: "power2.inOut"
    });

    // Menu items stagger entrance
    gsap.fromTo(items,
      {
        autoAlpha: 0,
        y: 30,
        rotation: -5
      },
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
    // Re-enable scrolling
    this.lenis.start();

    // Menu overlay - reverse circular collapse
    gsap.to(overlay, {
      clipPath: "circle(0% at 100% 0%)",
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        overlay.classList.remove('is-active');
      }
    });

    burger.classList.remove('is-active');

    // Burger icon reverse (X → hamburger)
    const [top, middle, bottom] = lines;

    gsap.to(top, {
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: "power2.inOut"
    });

    gsap.to(middle, {
      autoAlpha: 1,
      duration: 0.2
    });

    gsap.to(bottom, {
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: "power2.inOut"
    });

    // Menu items fade out
    gsap.to(items, {
      autoAlpha: 0,
      duration: 0.2
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. SCROLL-TRIGGERED ANIMATIONS (d5d162b.js + 67eac05.js)
  // ═══════════════════════════════════════════════════════════════
  initScrollAnimations() {
    // TITLE ANIMATIONS
    gsap.utils.toArray('[data-animate="title"]').forEach(element => {
      const lines = element.querySelectorAll('.title-line');

      if (lines.length > 0) {
        gsap.fromTo(lines,
          {
            autoAlpha: 0,
            rotation: 7,
            yPercent: 100
          },
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
      } else {
        // Single title without lines
        gsap.fromTo(element,
          { autoAlpha: 0, y: 50 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // FADE-UP ANIMATIONS
    gsap.utils.toArray('[data-animate="fade-up"]').forEach(element => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // FADE-UP WITH SCALE
    gsap.utils.toArray('[data-animate="fade-scale"]').forEach(element => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 60, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // SCALE ANIMATIONS
    gsap.utils.toArray('[data-animate="scale"]').forEach(element => {
      gsap.fromTo(element,
        { scale: 0.8 },
        {
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // SLIDE-IN FROM LEFT
    gsap.utils.toArray('[data-animate="slide-left"]').forEach(element => {
      gsap.fromTo(element,
        { autoAlpha: 0, x: -100 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // SLIDE-IN FROM RIGHT
    gsap.utils.toArray('[data-animate="slide-right"]').forEach(element => {
      gsap.fromTo(element,
        { autoAlpha: 0, x: 100 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // STAGGER CHILDREN (d5d162b.js pattern)
    gsap.utils.toArray('[data-stagger-children]').forEach(parent => {
      const children = parent.querySelectorAll('[data-animate]');

      if (children.length > 0) {
        gsap.fromTo(children,
          { autoAlpha: 0, y: 30, scale: 0.95 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: {
              amount: 0.8,
              from: "start"
            },
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: parent,
              start: "top 70%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // PARALLAX IMAGES (67eac05.js pattern)
    gsap.utils.toArray('[data-parallax]').forEach(element => {
      const speed = parseFloat(element.dataset.speed) || 0.5;

      gsap.to(element, {
        yPercent: -20 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });

    // CLIP PATH REVEALS (67eac05.js pattern)
    gsap.utils.toArray('[data-animate="clip-reveal"]').forEach(element => {
      gsap.fromTo(element,
        { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1,
          ease: "customStrong",
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // INSET CLIP REVEALS (Bottom-up)
    gsap.utils.toArray('[data-animate="clip-inset"]').forEach(element => {
      gsap.fromTo(element,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // STATS COUNTER (d5d162b.js pattern)
    gsap.utils.toArray('.stat-value').forEach(stat => {
      const text = stat.textContent.trim();
      const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
      const suffix = text.replace(/[0-9.]/g, '');

      if (!isNaN(numericValue)) {
        gsap.fromTo(stat,
          { textContent: 0 },
          {
            textContent: numericValue,
            duration: 2,
            snap: { textContent: numericValue > 100 ? 1 : 0.1 },
            ease: "power1.out",
            scrollTrigger: {
              trigger: stat,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            onUpdate: function() {
              const currentValue = Math.ceil(this.targets()[0].textContent * 10) / 10;
              stat.textContent = currentValue + suffix;
            }
          }
        );
      }
    });

    // PROJECT CARDS (d5d162b.js pattern)
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
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // FOOTER REVEAL (d5d162b.js pattern)
    const footer = document.querySelector('.footer');
    if (footer) {
      const footerLinks = footer.querySelectorAll('.footer-link');

      gsap.fromTo(footer,
        { y: 100, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 90%"
          }
        }
      );

      if (footerLinks.length > 0) {
        gsap.fromTo(footerLinks,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.6,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 90%"
            }
          }
        );
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. HOVER EFFECTS (67eac05.js + d5d162b.js patterns)
  // ═══════════════════════════════════════════════════════════════
  initHoverEffects() {
    // PROJECT CARD HOVER - Video crossfade
    document.querySelectorAll('.project-card').forEach(card => {
      const thumbnail = card.querySelector('.project-thumbnail');
      const image = card.querySelector('.project-image');
      const video = card.querySelector('.project-video');

      if (!thumbnail || !video) return;

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.4,
          ease: "power2.out"
        });

        // Video crossfade
        const tl = gsap.timeline();
        tl.to(image, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power1.out"
        }, 0)
        .fromTo(video, 
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.3,
            ease: "power1.in",
            onStart: () => {
              video.play().catch(() => {});
            }
          }, 0
        );
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });

        // Reverse crossfade
        const tl = gsap.timeline();
        tl.to(video, {
          autoAlpha: 0,
          duration: 0.2,
          onComplete: () => {
            video.pause();
            video.currentTime = 0;
          }
        }, 0)
        .to(image, {
          autoAlpha: 1,
          duration: 0.2
        }, 0);
      });
    });

    // BUTTON HOVER EFFECTS
    document.querySelectorAll('.button').forEach(button => {
      const arrow = button.querySelector('.arrow');

      button.addEventListener('mouseenter', () => {
        if (arrow) {
          gsap.to(arrow, {
            x: 5,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

      button.addEventListener('mouseleave', () => {
        if (arrow) {
          gsap.to(arrow, {
            x: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    });

    // IMAGE WRAPPER HOVER - Scale
    document.querySelectorAll('.image-wrapper').forEach(wrapper => {
      const image = wrapper.querySelector('img');
      if (!image) return;

      wrapper.addEventListener('mouseenter', () => {
        gsap.to(image, {
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out"
        });
      });

      wrapper.addEventListener('mouseleave', () => {
        gsap.to(image, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. PAGE-SPECIFIC ANIMATIONS
  // ✅ FIXED: Improved page detection logic
  // ═══════════════════════════════════════════════════════════════
  detectPage() {
    const body = document.body;

    // Priority 1: Check body classes (most reliable)
    if (body.classList.contains('page-home')) {
      this.initHomepage();
      return;
    }

    if (body.classList.contains('page-studio')) {
      this.initStudioPage();
      return;
    }

    if (body.classList.contains('page-story')) {
      this.initStoryPage();
      return;
    }

    if (body.classList.contains('page-project')) {
      this.initProjectPage();
      return;
    }

    // Priority 2: Check for specific page elements (fallback)
    if (document.querySelector('.projects-grid')) {
      this.initHomepage();
    } else if (document.querySelector('.services-section')) {
      this.initStudioPage();
    } else if (document.querySelector('.story-section')) {
      this.initStoryPage();
    } else if (document.querySelector('.project-hero')) {
      this.initProjectPage();
    }
  }

  // HOMEPAGE SPECIFIC (d5d162b.js)
  initHomepage() {
    // Showreel section
    const showreel = document.querySelector('.showreel-section');
    if (showreel) {
      const playButton = showreel.querySelector('.play-button');

      gsap.fromTo(showreel,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: showreel,
            start: "top 75%"
          }
        }
      );

      if (playButton) {
        gsap.fromTo(playButton,
          { scale: 0, rotation: -90 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: showreel,
              start: "top 75%"
            }
          }
        );
      }
    }

    // Stats belt animation
    const statsBelt = document.querySelector('.stats');
    if (statsBelt) {
      const stats = statsBelt.querySelectorAll('li');

      gsap.fromTo(stats,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsBelt,
            start: "top 85%"
          }
        }
      );
    }
  }

  // STUDIO PAGE (e3cea04.js)
  initStudioPage() {
    // Services section with parallax columns
    const leftColumn = document.querySelector('.services-left');
    const rightColumn = document.querySelector('.services-right');

    if (leftColumn) {
      gsap.to(leftColumn, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: leftColumn.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    }

    if (rightColumn) {
      gsap.to(rightColumn, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: rightColumn.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    }

    // Team cards with grid stagger
    const teamCards = document.querySelectorAll('.team-card');
    if (teamCards.length > 0) {
      gsap.fromTo(teamCards,
        { autoAlpha: 0, y: 60, rotation: 3 },
        {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          stagger: {
            amount: 1,
            grid: "auto",
            from: "start"
          },
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: teamCards[0].parentElement,
            start: "top 70%"
          }
        }
      );
    }

    // Process steps
    const processSteps = document.querySelectorAll('.process-step');
    if (processSteps.length > 0) {
      gsap.fromTo(processSteps,
        { autoAlpha: 0, x: -100 },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.3,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: processSteps[0].parentElement,
            start: "top 65%"
          }
        }
      );
    }
  }

  // STORY PAGE
  initStoryPage() {
    // Story sections with rich text
    const storyParagraphs = document.querySelectorAll('.story-section p');

    if (storyParagraphs.length > 0) {
      gsap.fromTo(storyParagraphs,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: storyParagraphs[0].parentElement,
            start: "top 70%"
          }
        }
      );
    }

    // Blockquotes
    const blockquotes = document.querySelectorAll('blockquote');
    blockquotes.forEach(quote => {
      const line = quote.querySelector('.quote-line');
      const text = quote.querySelector('.quote-text');

      if (line) {
        gsap.fromTo(line,
          { scaleY: 0, transformOrigin: "top" },
          {
            scaleY: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: quote,
              start: "top 75%"
            }
          }
        );
      }

      if (text) {
        gsap.fromTo(text,
          { autoAlpha: 0, x: -20 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: quote,
              start: "top 75%"
            }
          }
        );
      }
    });
  }

  // PROJECT PAGES (67eac05.js)
  initProjectPage() {
    // Split media sections (left/right)
    const splitSections = document.querySelectorAll('.split-section');

    splitSections.forEach(section => {
      const leftContent = section.querySelector('.split-content:first-child');
      const rightContent = section.querySelector('.split-content:last-child');

      if (leftContent) {
        gsap.fromTo(leftContent,
          { autoAlpha: 0, x: -50 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%"
            }
          }
        );
      }

      if (rightContent && rightContent !== leftContent) {
        gsap.fromTo(rightContent,
          { autoAlpha: 0, x: 50 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%"
            }
          }
        );
      }
    });

    // Grid layouts
    const gridContainers = document.querySelectorAll('.grid-layout');

    gridContainers.forEach(container => {
      const gridItems = container.querySelectorAll('.grid-item');

      // Container clip reveal
      gsap.fromTo(container,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top 70%"
          }
        }
      );

      // Grid items stagger
      if (gridItems.length > 0) {
        gsap.fromTo(gridItems,
          { autoAlpha: 0, y: 60, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: {
              amount: 1.2,
              grid: "auto",
              from: "start"
            },
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 70%"
            }
          }
        );
      }
    });

    // Device mockups
    const devices = document.querySelectorAll('.device-mockup');

    devices.forEach(device => {
      const screen = device.querySelector('.device-screen');

      gsap.fromTo(device,
        { autoAlpha: 0, y: 100, rotation: 5 },
        {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: device,
            start: "top 85%"
          }
        }
      );

      if (screen) {
        gsap.fromTo(screen,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.8,
            delay: 0.3,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: device,
              start: "top 85%"
            }
          }
        );
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════

  // Refresh ScrollTrigger (useful for dynamic content)
  refresh() {
    ScrollTrigger.refresh();
  }

  // Kill all animations (cleanup)
  destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.globalTimeline.clear();
    this.lenis.destroy();
  }
}

// ═══════════════════════════════════════════════════════════════
// 10. INITIALIZE ON DOM READY
// ═══════════════════════════════════════════════════════════════
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.m0narqAnimations = new M0NARQ_Animations();
  });
} else {
  window.m0narqAnimations = new M0NARQ_Animations();
}

// ═══════════════════════════════════════════════════════════════
// EXPORT FOR MODULE SYSTEMS (optional)
// ═══════════════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = M0NARQ_Animations;
}
