/* Decorative, scroll-driven waxing moon; phase is an artistic sequence. */
(() => {
  const root = document.documentElement;
  const moon = document.getElementById('moon-orbit');
  const path = document.getElementById('moon-phase-path');
  const stars = document.getElementById('moon-stars');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  for (let i = 0; i < 65; i++) {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', (i * 137.51 + 47) % 1000);
    dot.setAttribute('cy', (i * 83.37 + 19) % 650);
    dot.setAttribute('r', i % 7 === 0 ? 1.3 : .65);
    dot.setAttribute('opacity', .25 + (i % 5) * .13);
    stars.appendChild(dot);
  }
  window.updateMoonPhase = function(time = 0) {
    const progress = clamp(time / 12.5);
    const phase = reduce.matches ? 1 : .08 + progress * .92;
    const radius = Math.max(.001, Math.abs(Math.cos(Math.PI * phase)) * 90);
    // Right-hand illuminated limb, with the terminator moving right to left.
    path.setAttribute('d', `M100 10 A90 90 0 0 1 100 190 A${radius} 90 0 0 ${phase < .5 ? 0 : 1} 100 10 Z`);
    moon.style.transform = `translate(-50%, -50%) translate3d(${(reduce.matches ? 0 : -progress * 12)}vw,${(reduce.matches ? 0 : progress * 38)}vh,0)`;
    const fade = 1 - clamp((time - 12.5) / 1.5);
    moon.style.opacity = String(fade);
    stars.style.opacity = String(fade * (.5 + progress * .5));
  };
  function sync() {
    const night = root.dataset.theme === 'night';
    document.getElementById('theme-toggle-btn')?.setAttribute('aria-pressed', String(night));
    document.getElementById('ambience-sun-btn')?.setAttribute('aria-pressed', String(!night));
    window.updateMoonPhase(window.aventineStoryTimeline?.time() || 0);
  }
  new MutationObserver(sync).observe(root, {attributes: true, attributeFilter: ['data-theme']});
  reduce.addEventListener('change', sync);
  sync();
})();
