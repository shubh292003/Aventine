/**
 * AVENTINE HOTEL - CORE INTERACTIVE ENGINE
 * Vanilla JavaScript implementation supporting step progress bars and Awwwards-style overlays.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI features
  initPreloader();
  initCustomCursor();
  initThemeAndAudio();
  initMobileDrawer();
  initStepClicks();
  initAmbientWeatherCanvas();
  initInteractiveResortMap();
  initRoomShowcaseAndBookingCalc();
  initPanoramicTour();
  initAIConcierge();
});

/* ==========================================================================
   1. CINEMATIC PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const bar = document.querySelector(".loader-progress-bar");
  const percentage = document.querySelector(".loader-percentage");

  if (!preloader) return;

  let progress = 0;
  const totalDuration = 2000;
  const interval = 20;
  const increment = 100 / (totalDuration / interval);

  const timer = setInterval(() => {
    progress += increment + Math.random() * 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      finishLoading();
    }
    const formatted = Math.floor(progress).toString().padStart(2, "0");
    percentage.textContent = `${formatted}%`;
    bar.style.width = `${progress}%`;
  }, interval);

  function finishLoading() {
    // Notify GSAP Timeline to start
    const event = new CustomEvent("preloader-finished");
    document.dispatchEvent(event);

    gsap.to(preloader, {
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        preloader.style.display = "none";
      }
    });
  }
}

/* ==========================================================================
   2. CUSTOM SPOTLIGHT & CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const spotlight = document.getElementById("cursor-spotlight");
  if (!cursor || !spotlight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let spotlightX = mouseX;
  let spotlightY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    spotlightX += (mouseX - spotlightX) * 0.08;
    spotlightY += (mouseY - spotlightY) * 0.08;
    spotlight.style.left = `${spotlightX}px`;
    spotlight.style.top = `${spotlightY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover animations on trigger selectors
  const interactives = document.querySelectorAll(
    "a, button, select, input, .magnetic-btn-hover, .map-path, .step-dot"
  );
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });
}

function initThemeAndAudio() {
  const themeBtn = document.getElementById("theme-toggle-btn");
  const sunBtn = document.getElementById("ambience-sun-btn");
  const soundBtn = document.getElementById("sound-toggle-btn");
  const audioPlayer = document.getElementById("ambient-audio-player");
  const htmlEl = document.documentElement;

  // Initialize Default State
  document.body.classList.add("solar-active");
  htmlEl.setAttribute("data-theme", "day");

  if (sunBtn) {
    sunBtn.addEventListener("click", () => {
      document.body.classList.add("solar-active");
      htmlEl.setAttribute("data-theme", "day");

      sunBtn.classList.add("active");
      if (themeBtn) themeBtn.classList.remove("active");

      // Reset colors to Day theme
      htmlEl.style.setProperty("--bg-primary", "#0c0c0e");
      htmlEl.style.setProperty("--gold", "#c5a880");
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.remove("solar-active");
      htmlEl.setAttribute("data-theme", "night");

      themeBtn.classList.add("active");
      if (sunBtn) sunBtn.classList.remove("active");

      // Set colors to Midnight theme
      htmlEl.style.setProperty("--bg-primary", "#020307");
      htmlEl.style.setProperty("--gold", "#9e815d");
    });
  }

  if (soundBtn && audioPlayer) {
    soundBtn.addEventListener("click", () => {
      const icon = soundBtn.querySelector("i");

      if (audioPlayer.paused) {
        audioPlayer.volume = 0.25;

        audioPlayer.play().then(() => {
          icon.className = "ri-volume-up-line";
        }).catch((err) => {
          console.log("Audio play blocked", err);
        });
      } else {
        audioPlayer.pause();
        icon.className = "ri-volume-mute-line";
      }
    });
  }
}

/* ==========================================================================
   4. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const mobileBtn = document.querySelector(".mobile-menu-trigger");
  const mobileDrawer = document.querySelector(".mobile-nav-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (!mobileBtn || !mobileDrawer) return;

  mobileBtn.addEventListener("click", () => {
    mobileDrawer.classList.toggle("open");
    mobileBtn.classList.toggle("open");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileDrawer.classList.remove("open");
      mobileBtn.classList.remove("open");
    });
  });
}

/* ==========================================================================
   5. STEP CLICKS & SCROLL TARGETING
   ========================================================================== */
function initStepClicks() {
  const steps = document.querySelectorAll(".step-dot");
  const navLinks = document.querySelectorAll(".js-nav-step");

  // Step dots sidebar clicks
  steps.forEach((dot) => {
    dot.addEventListener("click", () => {
      const stepIdx = parseInt(dot.getAttribute("data-step"));
      navigateToStep(stepIdx);
    });
  });

  // Nav capsule menu clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const stepIdx = parseInt(link.getAttribute("data-target-step"));
      navigateToStep(stepIdx);
    });
  });

  window.navigateToAventineStep = function(stepIndex) {
    const timeline = window.aventineStoryTimeline;
    if (!timeline?.scrollTrigger) return;
    const trigger = timeline.scrollTrigger;
    const marker = timeline.labels['nav-' + stepIndex];
    if (marker === undefined) return;
    const destination = trigger.start + (marker / timeline.duration()) * (trigger.end - trigger.start);
    if (window.lenisInstance) window.lenisInstance.scrollTo(destination, { duration: 1.5 });
    else window.scrollTo({ top: destination, behavior: 'smooth' });
  };
  function navigateToStep(stepIndex) { window.navigateToAventineStep(stepIndex); }

}

// Global update method invoked by GSAP timelines
window.updateStepUI = function(stepIndex) {
  window.aventineCurrentStep = stepIndex;
  const dots = document.querySelectorAll('.step-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === stepIndex);
    if (index === stepIndex) dot.setAttribute('aria-current', 'step');
    else dot.removeAttribute('aria-current');
  });
  const progress = document.querySelector('.step-indicator-progress');
  if (progress && dots.length > 1) progress.style.height = `${stepIndex / (dots.length - 1) * 100}%`;
  document.querySelectorAll('.nav-menu .nav-link, .mobile-link, .nav-booking-btn').forEach(link => {
    const active = Number(link.dataset.targetStep) === stepIndex;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  const wrapper = document.querySelector('.nav-links-wrapper');
  const pill = document.querySelector('.nav-active-pill');
  const link = wrapper?.querySelector('.nav-link.active');
  if (!pill) return;
  if (!link || !link.getClientRects().length) { pill.style.display = 'none'; return; }
  const rect = link.getBoundingClientRect();
  const parent = wrapper.getBoundingClientRect();
  pill.style.display = 'block';
  pill.style.width = `${rect.width}px`;
  pill.style.height = `${rect.height}px`;
  pill.style.transform = `translate(${rect.left - parent.left}px, ${rect.top - parent.top}px)`;
};
window.addEventListener('resize', () => window.updateStepUI(window.aventineCurrentStep || 0));
document.fonts?.ready.then(() => window.updateStepUI(window.aventineCurrentStep || 0));

/* ==========================================================================
   6. AMBIENT WEATHER PARTICLE CANVAS SYSTEM
   ========================================================================== */
function initAmbientWeatherCanvas() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const htmlEl = document.documentElement;
  let weatherMode = "sunny";
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      if (weatherMode === "rainy") {
        this.y = -20;
        this.length = Math.random() * 22 + 12;
        this.speed = Math.random() * 10 + 8;
        this.opacity = Math.random() * 0.3 + 0.1;
      } else if (weatherMode === "misty") {
        this.x = -150 - Math.random() * 100;
        this.y = Math.random() * height;
        this.radius = Math.random() * 80 + 70;
        this.speed = Math.random() * 0.35 + 0.15;
        this.opacity = Math.random() * 0.1 + 0.02;
      } else {
        // sunny warm sparkles
        this.y = height + 20;
        this.radius = Math.random() * 4 + 2;
        this.speed = Math.random() * 0.45 + 0.25;
        this.opacity = Math.random() * 0.35 + 0.1;
        this.sway = Math.random() * 2;
        this.swaySpeed = Math.random() * 0.015;
      }
    }

    update() {
      if (weatherMode === "rainy") {
        this.y += this.speed;
        this.x += 0.8;
        if (this.y > height) this.reset();
      } else if (weatherMode === "misty") {
        this.x += this.speed;
        if (this.x > width + 150) this.reset();
      } else {
        this.y -= this.speed;
        this.sway += this.swaySpeed;
        this.x += Math.sin(this.sway) * 0.3;
        if (this.y < -20) this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      if (weatherMode === "rainy") {
        ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 1, this.y + this.length);
        ctx.stroke();
      } else if (weatherMode === "misty") {
        let grad = ctx.createRadialGradient(
          this.x, this.y, 10,
          this.x, this.y, this.radius
        );
        grad.addColorStop(0, `rgba(240, 240, 245, ${this.opacity})`);
        grad.addColorStop(1, "rgba(240, 240, 245, 0)");
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        let grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        grad.addColorStop(0, `rgba(255, 235, 180, ${this.opacity})`);
        grad.addColorStop(1, "rgba(255, 235, 180, 0)");
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function buildParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  buildParticles(70);

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(renderLoop);
  }
  renderLoop();

  const buttons = document.querySelectorAll(".weather-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const prevMode = weatherMode;
      weatherMode = btn.getAttribute("data-weather");

      const count = weatherMode === "rainy" ? 130 : weatherMode === "misty" ? 25 : 70;
      buildParticles(count);

      // Transition styles dynamically
      if (weatherMode === "rainy") {
        htmlEl.style.setProperty("--bg-primary", "#0a0e14");
        htmlEl.style.setProperty("--gold", "#718096");
      } else if (weatherMode === "misty") {
        htmlEl.style.setProperty("--bg-primary", "#141519");
        htmlEl.style.setProperty("--gold", "#9d968b");
      } else {
        const theme = htmlEl.getAttribute("data-theme");
        if (theme === "night") {
          htmlEl.style.setProperty("--bg-primary", "#020307");
          htmlEl.style.setProperty("--gold", "#9e815d");
        } else {
          htmlEl.style.setProperty("--bg-primary", "#0c0c0e");
          htmlEl.style.setProperty("--gold", "#c5a880");
        }
      }
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE RESORT MAP
   ========================================================================== */
function initInteractiveResortMap() {
  const paths = document.querySelectorAll(".map-path");
  const areaTitle = document.getElementById("map-area-title");
  const areaDesc = document.getElementById("map-area-desc");
  const areaStatus = document.getElementById("map-area-status");

  if (paths.length === 0 || !areaTitle) return;

  const areaData = {
    "wing-west": {
      title: "West Suites Pavilions",
      desc: "Architectural oceanfront suites featuring private infinity decks, open-air basalt bathtubs, and elevated views of the sunset coastline.",
      status: "Occupancy: 82% | 3 Suites Available"
    },
    "wing-lobby": {
      title: "The Great Basalt Lobby",
      desc: "Double-height stone archways featuring floating water courtyards, cozy fire vaults, and our boutique art lounge collection.",
      status: "Operational: 24 Hours | High Activity"
    },
    "wing-spa": {
      title: "Senses Thermal Spa Sanctuary",
      desc: "Nestled into lush mountain forests. Houses therapeutic mineral springs, vapor chambers, and custom body massage salas.",
      status: "Booking Required | 2 Private Rooms Free"
    },
    "wing-villas": {
      title: "Water Sunset Villas",
      desc: "Secluded overwater villas accessible via private wooden jetties. Glass floor features offer views of the living coral garden below.",
      status: "Occupancy: 100% | Fully Occupied"
    }
  };

  paths.forEach((path) => {
    path.addEventListener("mouseenter", () => {
      paths.forEach((p) => p.classList.remove("active-area"));
      path.classList.add("active-area");

      const wingId = path.getAttribute("id");
      const info = areaData[wingId];
      if (info) {
        areaTitle.textContent = info.title;
        areaDesc.textContent = info.desc;
        areaStatus.textContent = info.status;
      }
    });
  });
}

/* ==========================================================================
   8. LUXURY SUITES SELECTOR & LIVE BOOKING CALCULATOR
   ========================================================================== */
function initRoomShowcaseAndBookingCalc() {
  const roomSelect = document.getElementById("booking-suite");
  const checkIn = document.getElementById("check-in");
  const checkOut = document.getElementById("check-out");

  const calcNights = document.getElementById("calc-nights");
  const calcBase = document.getElementById("calc-base-price");
  const calcAddons = document.getElementById("calc-addons-price");
  const calcTotal = document.getElementById("calc-total-price");

  const addSpa = document.getElementById("addon-spa");
  const addHeli = document.getElementById("addon-heli");

  const confirmBtn = document.getElementById("confirm-booking-btn");
  const successModal = document.getElementById("booking-success-modal");
  const successRoom = document.getElementById("success-room-text");
  const successIn = document.getElementById("success-in-date");
  const successOut = document.getElementById("success-out-date");
  const closeSuccess = document.getElementById("close-success-modal-btn");

  const selectRoomButtons = document.querySelectorAll(".js-select-room");
  selectRoomButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const roomVal = btn.getAttribute("data-room-price");
      const card = btn.closest(".suite-card");

      document.querySelectorAll(".suite-card").forEach((c) => c.classList.remove("selected-suite"));
      card.classList.add("selected-suite");

      if (roomSelect) {
        roomSelect.value = roomVal;
        updatePricing();
      }

      // Navigate to Booking tab (Step 6)
      window.navigateToAventineStep?.(6);
    });
  });

  if (checkIn && checkOut) {
    const today = new Date();
    const tom = new Date(today);
    tom.setDate(tom.getDate() + 3);

    checkIn.min = today.toISOString().split("T")[0];
    checkIn.value = today.toISOString().split("T")[0];

    checkOut.min = tom.toISOString().split("T")[0];
    checkOut.value = tom.toISOString().split("T")[0];

    checkIn.addEventListener("change", () => {
      const minOut = new Date(checkIn.value);
      minOut.setDate(minOut.getDate() + 1);
      checkOut.min = minOut.toISOString().split("T")[0];
      if (new Date(checkOut.value) <= new Date(checkIn.value)) {
        checkOut.value = minOut.toISOString().split("T")[0];
      }
      updatePricing();
    });

    checkOut.addEventListener("change", updatePricing);
  }

  // Steppers calculation increments
  const steppers = document.querySelectorAll(".number-stepper");
  steppers.forEach((stepper) => {
    const input = stepper.querySelector("input");
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || 10;

    stepper.querySelector(".btn-minus").addEventListener("click", () => {
      let val = parseInt(input.value) || 0;
      if (val > min) {
        input.value = val - 1;
        updatePricing();
      }
    });

    stepper.querySelector(".btn-plus").addEventListener("click", () => {
      let val = parseInt(input.value) || 0;
      if (val < max) {
        input.value = val + 1;
        updatePricing();
      }
    });
  });

  function updatePricing() {
    if (!roomSelect || !checkIn || !checkOut) return;

    const rate = parseFloat(roomSelect.value) || 0;
    const date1 = new Date(checkIn.value);
    const date2 = new Date(checkOut.value);

    const diffTime = Math.abs(date2 - date1);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const basePrice = rate * nights;
    
    let addonsTotal = 0;
    if (addSpa && addSpa.checked) addonsTotal += parseFloat(addSpa.value);
    if (addHeli && addHeli.checked) addonsTotal += parseFloat(addHeli.value);

    const total = basePrice + addonsTotal;

    if (calcNights) calcNights.textContent = nights;
    if (calcBase) calcBase.textContent = `$${basePrice.toLocaleString()}`;
    if (calcAddons) calcAddons.textContent = `$${addonsTotal.toLocaleString()}`;
    if (calcTotal) calcTotal.textContent = `$${total.toLocaleString()}`;
  }

  if (roomSelect) roomSelect.addEventListener("change", updatePricing);
  if (addSpa) addSpa.addEventListener("change", updatePricing);
  if (addHeli) addHeli.addEventListener("change", updatePricing);

  updatePricing();

  if (confirmBtn && successModal) {
    confirmBtn.addEventListener("click", () => {
      const selectedOption = roomSelect.options[roomSelect.selectedIndex].text.split(" ($")[0];
      successRoom.textContent = selectedOption;
      successIn.textContent = checkIn.value;
      successOut.textContent = checkOut.value;

      successModal.classList.add("open");
    });
  }

  if (closeSuccess && successModal) {
    closeSuccess.addEventListener("click", () => {
      successModal.classList.remove("open");
    });
  }
}

/* ==========================================================================
   9. 360° DRAGGING PANORAMIC VIEW MODAL
   ========================================================================== */
function initPanoramicTour() {
  const openButtons = document.querySelectorAll(".js-open-360");
  const modal = document.getElementById("pano-modal");
  const closeBtn = document.getElementById("close-pano-btn");
  const title = document.getElementById("pano-room-title");
  const dragTarget = document.getElementById("pano-drag-target");
  const hotspotsContainer = document.getElementById("pano-hotspots");

  if (openButtons.length === 0 || !modal || !dragTarget) return;

  const roomPanoImages = {
    "ocean-villa": {
      img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=2400&q=80",
      title: "Ocean Sunset Villa",
      hotspots: ["Private Horizon Deck", "Outdoor Basalt Tub", "Bespoke Super-King Bed"]
    },
    "zen-suite": {
      img: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=2400&q=80",
      title: "Zen Forest Sanctuary",
      hotspots: ["Interior Tea Table", "Acoustic Bamboo Soundwalls", "Sunken Spa Garden"]
    },
    "royal-penthouse": {
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2400&q=80",
      title: "Aventine Penthouse Suite",
      hotspots: ["12-Guest Basalt Dining Bench", "Private Heliport Lift", "Obsidian Fireplace Area"]
    }
  };

  let isDragging = false;
  let startX = 0;
  let currentBackgroundX = 0;
  let speedMultiplier = 0.5;

  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const roomId = btn.getAttribute("data-room");
      const details = roomPanoImages[roomId];

      if (details) {
        title.textContent = details.title;
        dragTarget.style.backgroundImage = `url('${details.img}')`;
        currentBackgroundX = 0;
        dragTarget.style.backgroundPosition = `0px center`;

        hotspotsContainer.innerHTML = "";
        details.hotspots.forEach((spot) => {
          const item = document.createElement("div");
          item.className = "pano-hotspot-indicator";
          item.innerHTML = `<span class="pano-hotspot-dot"></span><span>${spot}</span>`;
          hotspotsContainer.appendChild(item);
        });

        modal.classList.add("open");
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open");
    });
  }

  // Dragger coords
  dragTarget.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    startX = e.clientX;

    currentBackgroundX += deltaX * speedMultiplier;
    dragTarget.style.backgroundPosition = `${currentBackgroundX}px center`;
  });

  dragTarget.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    startX = e.touches[0].clientX;

    currentBackgroundX += deltaX * speedMultiplier;
    dragTarget.style.backgroundPosition = `${currentBackgroundX}px center`;
  });
}

/* ==========================================================================
   10. AI CONCIERGE ASSISTANT WIDGET
   ========================================================================== */
function initAIConcierge() {
  const trigger = document.getElementById("ai-concierge-trigger");
  const panel = document.getElementById("ai-concierge-panel");
  const closeBtn = document.getElementById("ai-concierge-close");
  const chatLog = document.getElementById("concierge-chat-log");
  const textInput = document.getElementById("concierge-text-input");
  const sendBtn = document.getElementById("concierge-send-btn");
  const suggestionChips = document.querySelectorAll(".suggestion-chip");

  if (!trigger || !panel) return;

  trigger.addEventListener("click", () => {
    panel.classList.toggle("open");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel.classList.remove("open");
    });
  }

  const replies = {
    "helicopter": "Certainly, madam. Aventine's private helipad is located on the East Cliff. Transfers to/from the capital airport take 18 minutes. We will register your flight details and organize our ground team.",
    "yacht": "A magnificent request. Our resort operates two private solar-electric catamarans. A sunset cruise with a private sashimi chef and vintage reserve Champagne starts at $2,400. Shall I block our afternoon slot?",
    "pillow": "Of course. Our pillow menu contains pure Siberian goose-down, cooling natural latex, and warm lavender-infused memory foam options. I will have your butler arrange them before sunset.",
    "spa": "The thermal spa pavilion is open from 6:00 AM until midnight. Our signature Volcanic Stone Ritual is highly recommended for jetlag restoration. I can book you a slot tomorrow at 10:00 AM.",
    "default": "Of course. I will notify your personal 1-on-1 butler immediately to address this request. Is there anything else I can coordinate to elevate your comfort?"
  };

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `<p>${text}</p>`;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function handleGuestInquiry(inquiryText) {
    if (!inquiryText.trim()) return;

    addMessage("guest", inquiryText);
    textInput.value = "";

    setTimeout(() => {
      const lower = inquiryText.toLowerCase();
      let response = replies["default"];

      if (lower.includes("helicopter") || lower.includes("heli")) {
        response = replies["helicopter"];
      } else if (lower.includes("yacht") || lower.includes("cruise") || lower.includes("boat")) {
        response = replies["yacht"];
      } else if (lower.includes("pillow") || lower.includes("bed")) {
        response = replies["pillow"];
      } else if (lower.includes("spa") || lower.includes("massage") || lower.includes("bath")) {
        response = replies["spa"];
      }

      addMessage("concierge", response);
    }, 850);
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      handleGuestInquiry(textInput.value);
    });
  }

  if (textInput) {
    textInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleGuestInquiry(textInput.value);
      }
    });
  }

  suggestionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      handleGuestInquiry(chip.textContent);
    });
  });
}