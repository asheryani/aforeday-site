/* Aforeday — progressive enhancement only.
   Every page reads fully without this file. It adds: a header border
   once the page has scrolled, reveal-on-scroll, the approval stepper,
   a gentle parallax on the feature phones, and the current-section
   marker in document sidebars. No storage, no cookies, no requests. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReduced = function () { return reduceMotion.matches; };

  /* ---- Header border after scrolling ---------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Reveal on scroll ----------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window && !prefersReduced()) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---- Approval stepper ----------------------------------------- */
  var posture = document.getElementById('posture');
  if (posture) {
    var steps = Array.prototype.slice.call(posture.querySelectorAll('.step'));
    var buttons = steps.map(function (s) { return s.querySelector('button'); });
    var radios = posture.querySelectorAll('input[name="posture"]');
    var active = 0;
    var timer = null;
    var userDrove = false;

    var setActive = function (i) {
      active = i;
      steps.forEach(function (s, j) {
        s.classList.toggle('is-active', j === i);
        buttons[j].setAttribute('aria-pressed', j === i ? 'true' : 'false');
      });
    };

    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var play = function () {
      if (timer || userDrove || prefersReduced()) { return; }
      timer = setInterval(function () { setActive((active + 1) % steps.length); }, 2600);
    };

    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () { userDrove = true; stop(); setActive(i); });
    });
    radios.forEach(function (r) {
      r.addEventListener('change', function () {
        posture.setAttribute('data-posture', r.value);
        setActive(0);
        userDrove = false;
        stop();
        play();
      });
    });
    posture.addEventListener('mouseenter', stop);
    posture.addEventListener('mouseleave', play);
    posture.addEventListener('focusin', stop);
    posture.addEventListener('focusout', function () {
      setTimeout(function () { if (!posture.contains(document.activeElement)) { play(); } }, 0);
    });

    // Sync the initial state in case the browser restored a radio choice.
    var checked = posture.querySelector('input[name="posture"]:checked');
    if (checked) { posture.setAttribute('data-posture', checked.value); }

    if ('IntersectionObserver' in window) {
      var pio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { play(); } else { stop(); }
        });
      }, { threshold: 0.4 });
      pio.observe(posture);
    }
  }

  /* ---- Parallax on the feature phones --------------------------- */
  var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallax.length && !prefersReduced()) {
    var ticking = false;
    var update = function () {
      ticking = false;
      if (window.innerWidth < 832) {
        parallax.forEach(function (el) { el.style.transform = ''; });
        return;
      }
      var vh = window.innerHeight;
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var centre = r.top + r.height / 2;
        var t = (centre - vh / 2) / vh; // -0.5 .. 0.5 across the viewport
        var y = Math.max(-1, Math.min(1, t)) * -22;
        el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      });
    };
    var request = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    request();
  }

  /* ---- Document sidebar: mark the section in view --------------- */
  var aside = document.querySelector('.doc-aside');
  if (aside && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(aside.querySelectorAll('a[href^="#"]'));
    var targets = links.map(function (a) {
      return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    }).filter(Boolean);
    var current = null;
    var mark = function (id) {
      if (id === current) { return; }
      current = id;
      links.forEach(function (a) {
        a.classList.toggle('is-current', a.getAttribute('href') === '#' + id);
      });
    };
    var pick = function () {
      var line = 120;
      var best = targets[0];
      targets.forEach(function (t) {
        if (t.getBoundingClientRect().top <= line) { best = t; }
      });
      if (best) { mark(best.id); }
    };
    window.addEventListener('scroll', pick, { passive: true });
    pick();
  }
})();
