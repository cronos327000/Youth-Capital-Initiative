/* ==========================================================================
   YOUTH CAPITAL INITIATIVE - FINANCIAL LITERACY & INVESTMENT CHALLENGE 2026
   Full-featured interactive JS: Gate � Scroll-Reveal � Counters � Parallax
   Split-Flap � Particles � Charts � Simulator � FAQ � Confetti � Mobile Nav
   ========================================================================== */

'use strict';

/* ---------- global state ---------- */
let heroChartInstance = null;
let simChartInstance = null;

/* =========================================================================
   1. COUNTDOWN TIMER
   ========================================================================= */
function initCountdownTimer() {
  var target = new Date('October 21, 2026 23:59:59').getTime();
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function update() {
    var diff = target - Date.now();
    if (diff <= 0) {
      ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(function (id) {
        var el = document.getElementById(id); if (el) el.textContent = '00';
      }); return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var days = document.getElementById('cd-days'); if (days) days.textContent = pad(d);
    var hrs = document.getElementById('cd-hours'); if (hrs) hrs.textContent = pad(h);
    var mins = document.getElementById('cd-mins'); if (mins) mins.textContent = pad(m);
    var secs = document.getElementById('cd-secs');
    if (secs) {
      secs.textContent = pad(s);
      secs.classList.add('tick');
      setTimeout(function () { secs.classList.remove('tick'); }, 200);
    }
  }
  update();
  setInterval(update, 1000);
}

/* =========================================================================
   2. SCROLL-REVEAL (Directly triggers hero entrance on initial open)
   ========================================================================= */
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;

  function triggerElement(el) {
    var delay = parseFloat(el.dataset.delay || 0) * 1000;
    setTimeout(function () {
      el.classList.add('is-visible');
    }, delay);
  }

  // Directly trigger hero elements on initial open so entrance animation plays immediately
  var heroEls = document.querySelectorAll('#hero .reveal, #hero .reveal-up, #hero .reveal-scale, #hero .reveal-left, #hero .reveal-right');
  requestAnimationFrame(function () {
    heroEls.forEach(function (el) {
      triggerElement(el);
    });
  });

  if (!window.IntersectionObserver) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      triggerElement(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.05 });

  els.forEach(function (el) {
    if (!el.closest('#hero')) {
      io.observe(el);
    }
  });
}

/* =========================================================================
   3. ANIMATED COUNTERS
   ========================================================================= */
function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length || !window.IntersectionObserver) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var tgt = parseInt(el.dataset.count, 10);
      var dur = 1600, step = 16, cur = 0, inc = tgt / (dur / step);
      var timer = setInterval(function () {
        cur += inc;
        if (cur >= tgt) { cur = tgt; clearInterval(timer); }
        el.textContent = Math.floor(cur).toLocaleString();
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { io.observe(el); });
}

/* =========================================================================
   4. PARALLAX  (mouse + scroll on hero bg)
   ========================================================================= */
function initParallax() {
  var heroBg = document.getElementById('heroBgLayer');
  if (!heroBg) return;
  var tX = 0, tY = 0, cX = 0, cY = 0, S = 14;
  document.addEventListener('mousemove', function (e) {
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    tX = ((e.clientX - cx) / cx) * S;
    tY = ((e.clientY - cy) / cy) * S;
  });
  (function tick() {
    cX += (tX - cX) * 0.06; cY += (tY - cY) * 0.06;
    heroBg.style.transform = 'translate(' + cX + 'px,' + cY + 'px) scale(1.07)';
    requestAnimationFrame(tick);
  })();
  window.addEventListener('scroll', function () {
    heroBg.style.transform = 'translateY(' + (window.scrollY * 0.22) + 'px) scale(1.07)';
  }, { passive: true });
}

/* =========================================================================
   5. PARTICLE CANVAS
   ========================================================================= */
function initParticles() {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles = [];
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  var COLORS = ['rgba(16,185,129,0.5)', 'rgba(6,182,212,0.4)', 'rgba(245,158,11,0.3)'];
  for (var i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var j = 0; j < particles.length; j++) {
      var p = particles[j];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
    }
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 95) {
          ctx.globalAlpha = 0.09 * (1 - dist / 95); ctx.beginPath();
          ctx.strokeStyle = 'rgba(16,185,129,0.8)'; ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

/* =========================================================================
   6. STICKY NAV with active-section highlight
   ========================================================================= */
function initStickyNav() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) navbar.classList.add('nav-scrolled');
    else navbar.classList.remove('nav-scrolled');
  }, { passive: true });

  if (!window.IntersectionObserver) return;
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (l) { l.classList.remove('nav-link--active'); });
      var active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
      if (active) active.classList.add('nav-link--active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { io.observe(s); });
}

/* =========================================================================
   7. SPLIT-FLAP for stat displays (all 4 metric boxes)
   ========================================================================= */
var FLAP_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-%.';

function createFlapDisplay(container, finalText, delay) {
  delay = delay || 0;
  container.innerHTML = '';
  var chars = finalText.split('');

  chars.forEach(function (ch, idx) {
    if (ch === ' ') {
      var space = document.createElement('span');
      space.className = 'flap-space';
      space.innerHTML = '&nbsp;';
      container.appendChild(space);
      return;
    }

    var cell = document.createElement('span');
    cell.className = 'flap-cell';
    cell.textContent = FLAP_CHARS[Math.floor(Math.random() * 10)];
    container.appendChild(cell);

    var frame = 0;
    var totalFrames = 10 + (idx * 2);

    setTimeout(function () {
      var timer = setInterval(function () {
        frame++;
        if (frame >= totalFrames) {
          clearInterval(timer);
          cell.textContent = ch;
          cell.classList.remove('flap-flip');
          cell.style.transform = 'none';
          cell.classList.add('flap-settled');
        } else {
          cell.textContent = FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
          cell.classList.toggle('flap-flip');
        }
      }, 45);
    }, delay + (idx * 35));
  });
}

function initFlapCounters() {
  var flapEls = document.querySelectorAll('[data-flap]');
  if (!flapEls.length) return;

  function triggerFlap(el) {
    if (el.dataset.flapTriggered) return;
    el.dataset.flapTriggered = 'true';
    createFlapDisplay(el, el.dataset.flap, 0);
  }

  if (!window.IntersectionObserver) {
    flapEls.forEach(triggerFlap);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      triggerFlap(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  flapEls.forEach(function (el) { io.observe(el); });
}

/* =========================================================================
   8. HERO CHART
   ========================================================================= */
function initHeroChart() {
  var ctx = document.getElementById('heroAllocationChart');
  if (!ctx || typeof Chart === 'undefined') return;
  heroChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Stocks', 'ETFs', 'Bonds', 'REITs', 'Commodities'],
      datasets: [{
        data: [40, 30, 15, 10, 5],
        backgroundColor: ['#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#E1306C'],
        borderWidth: 2, borderColor: '#0B132B', hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { animateRotate: true, duration: 1400, easing: 'easeInOutQuart' },
      plugins: { legend: { position: 'right', labels: { color: '#94A3B8', font: { family: "'Inter', 'Poppins', 'Montserrat', sans-serif", size: 11 } } } },
      cutout: '72%'
    }
  });
}

/* =========================================================================
   9. SIMULATOR CHART + SLIDERS
   ========================================================================= */
function initSimulatorChart() {
  var ctx = document.getElementById('simPieChart');
  if (!ctx || typeof Chart === 'undefined') return;
  simChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Stocks', 'ETFs', 'Bonds', 'REITs', 'Commodities'],
      datasets: [{
        data: [40, 30, 15, 10, 5],
        backgroundColor: ['#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#E1306C'],
        borderWidth: 2, borderColor: '#030712'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 400 },
      plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', font: { family: "'Inter', 'Poppins', 'Montserrat', sans-serif", size: 12 } } } },
      cutout: '60%'
    }
  });
}

function updateSimChart() {
  var stocks = parseInt(document.getElementById('sim-stocks').value);
  var etfs = parseInt(document.getElementById('sim-etfs').value);
  var bonds = parseInt(document.getElementById('sim-bonds').value);
  var reits = parseInt(document.getElementById('sim-reits').value);
  var commodities = parseInt(document.getElementById('sim-commodities').value);
  document.getElementById('val-stocks').textContent = stocks + '%';
  document.getElementById('val-etfs').textContent = etfs + '%';
  document.getElementById('val-bonds').textContent = bonds + '%';
  document.getElementById('val-reits').textContent = reits + '%';
  document.getElementById('val-commodities').textContent = commodities + '%';
  var total = stocks + etfs + bonds + reits + commodities;
  document.getElementById('sim-total-val').textContent = total + '%';
  var bar = document.getElementById('sim-total-bar');
  bar.style.width = Math.min(total, 100) + '%';
  bar.style.background = total > 100 ? '#EF4444' : total === 100 ? '#10B981' : 'linear-gradient(90deg,#10B981,#06B6D4)';
  var msg = document.getElementById('sim-alloc-msg');
  if (total === 100) { msg.textContent = '? Allocation perfectly balanced at 100%.'; msg.style.color = '#10B981'; }
  else if (total < 100) { msg.textContent = '? ' + (100 - total) + '% unallocated cash remaining.'; msg.style.color = '#F59E0B'; }
  else { msg.textContent = '? Exceeds 100% by ' + (total - 100) + '% � rebalance.'; msg.style.color = '#EF4444'; }
  if (simChartInstance) { simChartInstance.data.datasets[0].data = [stocks, etfs, bonds, reits, commodities]; simChartInstance.update(); }
  var eq = stocks + etfs, badge = document.getElementById('diag-badge'), dt = document.getElementById('diag-text');
  if (eq >= 75) {
    badge.textContent = 'AGGRESSIVE GROWTH'; badge.style.background = 'rgba(239,68,68,0.2)'; badge.style.color = '#EF4444';
    dt.textContent = 'High equity focus (75%+). Strong long-term capital expansion but higher market downside exposure.';
  } else if (eq >= 50) {
    badge.textContent = 'BALANCED DIVERSIFIED'; badge.style.background = 'rgba(16,185,129,0.2)'; badge.style.color = '#10B981';
    dt.textContent = 'Well-balanced between equity growth and income stability (50-74%). Great for steady risk-adjusted returns.';
  } else {
    badge.textContent = 'CONSERVATIVE PROTECTION'; badge.style.background = 'rgba(245,158,11,0.2)'; badge.style.color = '#F59E0B';
    dt.textContent = 'Heavy fixed income & REITs. Excellent capital preservation but may underperform inflation in strong markets.';
  }
}

/* =========================================================================
   10. FAQ ACCORDION + SEARCH
   ========================================================================= */
function toggleFaq(element) {
  var card = element.parentElement;
  document.querySelectorAll('.faq-card.open').forEach(function (c) { if (c !== card) c.classList.remove('open'); });
  card.classList.toggle('open');
}

function filterFaqs() {
  var q = document.getElementById('faqSearch').value.toLowerCase().trim();
  document.querySelectorAll('.faq-card').forEach(function (item) {
    item.style.display = item.innerText.toLowerCase().includes(q) ? 'block' : 'none';
  });
}

/* =========================================================================
   11. EASTER EGG TERMINAL + CONFETTI
   ========================================================================= */
function triggerSecretTerminal() { var m = document.getElementById('secretModal'); if (m) m.classList.remove('hidden'); }
function closeSecretModal() { var m = document.getElementById('secretModal'); if (m) m.classList.add('hidden'); }
function triggerConfetti() {
  if (typeof confetti !== 'function') return;
  var colors = ['#10B981', '#06B6D4', '#F59E0B', '#8B5CF6'];
  confetti({ particleCount: 160, spread: 80, origin: { y: 0.55 }, colors: colors });
  setTimeout(function () { confetti({ particleCount: 80, spread: 100, origin: { y: 0.6, x: 0.25 }, colors: colors }); }, 300);
  setTimeout(function () { confetti({ particleCount: 80, spread: 100, origin: { y: 0.6, x: 0.75 }, colors: colors }); }, 500);
}

/* =========================================================================
   12. MOBILE NAV TOGGLE
   ========================================================================= */
function initMobileNav() {
  var toggle = document.getElementById('mobileToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('active');
    toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('active');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* =========================================================================
   13. CARD TILT  (3D perspective on hover)
   ========================================================================= */
function initCardTilt() {
  document.querySelectorAll('.card-tilt').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      card.style.transform = 'perspective(600px) rotateY(' + (dx * 7) + 'deg) rotateX(' + (-dy * 7) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });
}

/* =========================================================================
   14. SMOOTH SCROLL
   ========================================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* =========================================================================
   15. STAGGERED SECTION CHILDREN
   ========================================================================= */
function initStaggeredSections() {
  var groups = document.querySelectorAll('.stagger-children');
  if (!groups.length || !window.IntersectionObserver) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      Array.from(entry.target.children).forEach(function (child, i) {
        setTimeout(function () { child.classList.add('is-visible'); }, i * 110);
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  groups.forEach(function (g) { io.observe(g); });
}

/* =========================================================================
   16. MARQUEE TICKER duplicate for seamless loop
   ========================================================================= */
function initTicker() {
  var track = document.querySelector('.ticker-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/* =========================================================================
   BOOT
   ========================================================================= */
document.addEventListener('DOMContentLoaded', function () {
  initCountdownTimer();
  initHeroChart();
  initSimulatorChart();
  initMobileNav();
  initScrollReveal();
  initCounters();
  initStickyNav();
  initFlapCounters();
  initCardTilt();
  initSmoothScroll();
  initStaggeredSections();
  initTicker();

  /* Lock scroll while gate is showing */
  document.body.style.overflow = 'hidden';
});

/* =========================================================================
   ENTRY GATE
   ========================================================================= */
function closeGate() {
  var gate = document.getElementById('entryGate');
  if (!gate) return;

  /* Fade out the gate */
  gate.classList.add('gate-exit');

  /* After transition, fully hide it and unlock scroll */
  setTimeout(function () {
    gate.style.display = 'none';
    document.body.style.overflow = '';
  }, 750);
}
