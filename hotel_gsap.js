/**
 * AVENTINE HOTEL - PREMIUM ANIMATIONS ENGINE (IGLOO.INC STYLE)
 * Coordinates Lenis smooth scrolling, screen pinning, curved card peels, and portal zooms.
 */

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

let lenis;

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lenis Smooth Scroll
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8
  });

  // Export to window for click scroll triggers
  window.lenisInstance = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync ScrollTrigger updates with Lenis
  lenis.on('scroll', ScrollTrigger.update);


  // Helper text splitting for luxury word reveals
  splitTextIntoSpans();

  // Play animations after preloader finishes
  document.addEventListener("preloader-finished", () => {
    playIntroTimeline();
    setupStorytellingTimeline();
  });
});

/* ==========================================================================
   TEXT SPLITTING UTILITY
   ========================================================================== */
function splitTextIntoSpans() {
  const targets = document.querySelectorAll(".split-words");
  targets.forEach((target) => {
    const text = target.textContent;
    const words = text.split(" ");
    target.innerHTML = words
      .map(
        (word) =>
          `<span class="word-wrapper" style="overflow:hidden; display:inline-flex; vertical-align: bottom;">
            <span class="word-inner" style="display:inline-block; transform:translateY(110%);">${word}&nbsp;</span>
          </span>`
      )
      .join("");
  });
}

/* ==========================================================================
   CINEMATIC INTRO TIMELINE (HERO INITIAL STATE)
   ========================================================================== */
function playIntroTimeline() {
  const introTl = gsap.timeline();

  // Initial video scale adjustments
  introTl.to(".hero-video", {
    scale: 1,
    duration: 2.5,
    ease: "power2.out"
  });

  // Reveal subtitle
  introTl.fromTo(
    ".hero-subtitle",
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
    "-=1.8"
  );

  // Reveal letters title
  introTl.fromTo(
    ".hero-title",
    { opacity: 0, y: 35, letterSpacing: "0.5em" },
    { opacity: 1, y: 0, letterSpacing: "0.35em", duration: 1.8, ease: "power3.out" },
    "-=1.3"
  );

  // Fade down floating menu
  introTl.fromTo(
    ".nav-glass-container",
    { y: -60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
    "-=1.1"
  );

  // Fade up scroll helper mouse
  introTl.fromTo(
    ".scroll-indicator",
    { opacity: 0, y: 15 },
    { opacity: 0.8, y: 0, duration: 0.8, ease: "power2.out" },
    "-=0.7"
  );
}

/* ==========================================================================
   PINNED STORYTELLING TIMELINE (IGLOO CARD WIPE SYSTEM)
   ========================================================================== */
function setupStorytellingTimeline() {
  // Preserve the original sunset opening. Section markers follow actual
  // rendered timeline time, so the long opening/dining no longer mislabel tabs.
  let lastStep = -1;
  const masterTl = gsap.timeline({
    onUpdate() {
      window.updateMoonPhase?.(this.time());
      let currentStep = 0;
      for (let index = 1; index <= 6; index++) {
        const starts = this.labels['active-' + index];
        if (starts !== undefined && this.time() >= starts) currentStep = index;
      }
      if (currentStep !== lastStep) {
        lastStep = currentStep;
        window.updateStepUI?.(currentStep);
      }
    },
    scrollTrigger: {
      trigger: '.story-viewport', pin: true, start: 'top top',
      // Updated below to preserve the original seconds-to-scroll ratio.
      end: '+=600%', scrub: 1, invalidateOnRefresh: true,
      onRefresh: () => window.updateStepUI?.(Math.max(0, lastStep))
    }
  });
  window.aventineStoryTimeline = masterTl;
  masterTl.addLabel('nav-0', 0);
  // STEP 0 -> STEP 1: Zoom circular lens morphing window to reveal the Lobby preview
  // Cinematic Sun day-to-sunset scroll transitions
  // Sun Y translation (moves down to sunset)
  masterTl.to("html", {
    "--sun-y": "82%",
    duration: 12.5,
    ease: "none"
  }, 0);

  // Sun X horizontal drift (solar path arch)
  masterTl.to("html", {
    "--sun-x": "46%",
    duration: 12.5,
    ease: "none"
  }, 0);

  // Parallax Clifftops translation
  masterTl.to("html", {
    "--cliff-far-y": "30px",
    "--cliff-near-y": "60px",
    duration: 12.5,
    ease: "none"
  }, 0);

  // Sky colors Part 1: Bright Azure -> Golden Hour
  masterTl.to("html", {
    "--sky-color-top": "#e07b39",    // rich orange
    "--sky-color-mid": "#f99f38",    // warm amber
    "--sky-color-bottom": "#f7d384", // yellow-gold
    "--sun-glow-core": "rgba(255, 180, 80, 0.4)",
    "--sun-glow-outer": "rgba(255, 120, 60, 0.15)",
    "--cliff-far-color": "#281b30",
    "--cliff-near-color": "#170f20",
    "--ocean-color": "#151025",
    duration: 6.25,
    ease: "power1.inOut"
  }, 0);

  // Sky colors Part 2: Golden Hour -> Crimson Sunset -> Deep Dusk
  masterTl.to("html", {
    "--sky-color-top": "#0c0d1e",    // deep dusk blue
    "--sky-color-mid": "#2f1f3a",    // twilight purple
    "--sky-color-bottom": "#5f303f", // blood orange setting border
    "--sun-bloom-opacity": 0,
    "--sun-rays-opacity": 0,
    "--lens-flare-opacity": 0,
    "--cliff-far-color": "#080914",
    "--cliff-near-color": "#03040a",
    "--ocean-color": "#010207",
    "--window-reflection-color": "rgba(255, 215, 0, 0.7)", // glowing yellow windows interior lights
    "--window-reflection-opacity": 0.95,
    duration: 6.25,
    ease: "power1.inOut"
  }, 6.25);

  // Shadows stretch: Shadows grow longer and blur more
  masterTl.to("html", {
    "--shadow-offset-y": "65px",
    "--shadow-blur": "70px",
    duration: 12.5,
    ease: "none"
  }, 0);

  // Shifting Glare overlay translates left to right
  masterTl.to(".glass-glare", {
    x: "100%",
    duration: 12.5,
    ease: "none"
  }, 0);

  // Saturation / Sepia adjustments on room/hero images for color temperature shifts
  masterTl.to(".suite-img-wrap img, .reveal-img", {
    filter: "sepia(0.4) saturate(1.2) contrast(1.05)",
    duration: 8,
    ease: "none"
  }, 0);

  masterTl.to(".suite-img-wrap img, .reveal-img", {
    filter: "sepia(0.6) hue-rotate(-20deg) saturate(1.4)",
    duration: 4.5,
    ease: "none"
  }, 8);

  // STEP 1 -> STEP 2: Slide up Lobby sheet morphing curves to flat full-screen card
  masterTl.addLabel("active-1", masterTl.duration() + .85);
  masterTl.to("#sec-lobby", {
    y: "0%",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    duration: 1.5,
    ease: "power2.inOut"
  });

  // Fade the title as the lobby rises directly over the sunset.
  masterTl.to('.hero-content', { opacity: 0, y: -80, duration: .8 }, '<');

  masterTl.to("#sec-lobby .word-inner", {
    y: "0%",
    duration: 0.9,
    stagger: 0.03,
    ease: "power4.out"
  }, "-=0.7");

  masterTl.fromTo("#sec-lobby .image-reveal-container",
    { clipPath: "inset(0 100% 0 0)" },
    { clipPath: "inset(0 0 0 0)", duration: 1.1, ease: "power4.inOut" },
    "-=0.9"
  );

  masterTl.addLabel("nav-1");

  // A scroll-driven lobby chapter: image depth, warm light and gentle copy drift.
  // Reverse scrolling reverses all movement; no autoplay or scroll hijacking.
  const lobbyStart = masterTl.duration();
  const lobbyTravel = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1;
  masterTl.fromTo('#sec-lobby .reveal-img',
    { scale: 1.24, yPercent: 5 * lobbyTravel },
    { scale: 1.12, yPercent: -5 * lobbyTravel, duration: 3.2, ease: 'none' }, lobbyStart);
  masterTl.fromTo('#sec-lobby .lobby-scroll-light',
    { xPercent: -130, opacity: 0 },
    { xPercent: 130, opacity: .35 * lobbyTravel, duration: 2.3, ease: 'none' }, lobbyStart);
  masterTl.to('#sec-lobby .lobby-scroll-light', { opacity: 0, duration: .9, ease: 'none' }, lobbyStart + 2.3);
  masterTl.to('#sec-lobby .lobby-text-side', { y: -18 * lobbyTravel, duration: 3.2, ease: 'none' }, lobbyStart);
  masterTl.fromTo('#sec-lobby .lobby-scroll-progress',
    { scaleX: 0 }, { scaleX: 1, duration: 3.2, ease: 'none' }, lobbyStart);
  masterTl.addLabel('lobby-end');

  // STEP 2 -> STEP 3: Slide up Accommodations Suites Card
  masterTl.addLabel("active-2", masterTl.duration() + .85);
  masterTl.to("#sec-rooms", {
    y: "0%",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    duration: 1.5,
    ease: "power2.inOut"
  });

  masterTl.to("#sec-rooms .word-inner", {
    y: "0%",
    duration: 0.9,
    stagger: 0.03,
    ease: "power4.out"
  }, "-=0.7");

  masterTl.fromTo("#sec-rooms .suite-card",
    { opacity: 0, y: 55 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" },
    "-=0.7"
  );

  masterTl.addLabel("nav-2");

  // STEP 3 -> STEP 4: Slide up Culinary Dining Sheet
  masterTl.addLabel("active-3", masterTl.duration() + .85);
  masterTl.to("#sec-dining", {
    y: "0%",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    duration: 1.5,
    ease: "power2.inOut"
  });

  masterTl.to("#sec-dining .word-inner", {
    y: "0%",
    duration: 0.9,
    stagger: 0.03,
    ease: "power4.out"
  }, "-=0.7");

  masterTl.addLabel("nav-3");

  // Horizontal scrub slide transitions (culinary panels moving horizontally)
  masterTl.to(".dining-scroll-container", {
    x: "-300vw",
    duration: 3.5, // extended timeline scrub space
    ease: "none"
  });

  // STEP 4 -> STEP 5: Slide up Spa Wellness panel clearing image blur
  masterTl.addLabel("active-4", masterTl.duration() + .85);
  masterTl.to("#sec-spa", {
    y: "0%",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    duration: 1.5,
    ease: "power2.inOut"
  });

  masterTl.to("#sec-spa .word-inner", {
    y: "0%",
    duration: 0.9,
    stagger: 0.03,
    ease: "power4.out"
  }, "-=0.7");

  masterTl.fromTo(".spa-bg-img",
    { filter: "blur(25px) scale(1.15)" },
    { filter: "blur(0px) scale(1.02)", duration: 1.2, ease: "power2.out" },
    "-=1"
  );

  masterTl.fromTo(".spa-pill",
    { opacity: 0, scale: 0.8, y: 15 },
    { opacity: 1, scale: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "back.out(1.5)" },
    "-=0.8"
  );

  masterTl.addLabel("nav-4");

  // STEP 5 -> STEP 6: Slide up interactive estate map blueprint
  masterTl.addLabel("active-5", masterTl.duration() + .85);
  masterTl.to("#sec-map", {
    y: "0%",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    duration: 1.5,
    ease: "power2.inOut"
  });

  masterTl.fromTo(".map-visual-container",
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" },
    "-=0.7"
  );

  masterTl.addLabel("nav-5");

  // STEP 6 -> End: Slide up Reservation Sanctuary booking panel
  masterTl.addLabel("active-6", masterTl.duration() + .85);
  masterTl.to("#sec-booking", {
    y: "0%",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    duration: 1.5,
    ease: "power2.inOut"
  });

  masterTl.to("#sec-booking .word-inner", {
    y: "0%",
    duration: 0.9,
    stagger: 0.03,
    ease: "power4.out"
  }, "-=0.7");

  masterTl.fromTo(".booking-form-wrapper",
    { opacity: 0, y: 35 },
    { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    "-=0.7"
  );
  masterTl.addLabel('nav-6');
  // Lobby adds 3.2 units; removing the portal removes 1.5. Preserve sunset scroll speed.
  const originalDuration = masterTl.duration() - 1.7;
  masterTl.scrollTrigger.vars.end = () => '+=' + (innerHeight * 6 * masterTl.duration() / originalDuration);
  masterTl.scrollTrigger.refresh();
  window.updateStepUI?.(0);

}
