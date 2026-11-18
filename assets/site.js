/* Aforeday — progressive enhancement.
   Pages read fully without this file. It adds a header hairline after
   scroll, reveal-on-scroll, a hero crossfade, and the current-section
   marker in document sidebars. No storage, no cookies, no requests.
   Crossfades are 360ms (see styles.css). Motion stops when the visitor
   prefers reduced motion, or checks “Pause motion”. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var paused = function () {
    return reduce.matches || (document.getElementById('pause-motion') || {}).checked;
  };

  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window && !reduce.matches) {
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

  var screen = document.querySelector('.screen[data-cycle]');
  if (screen) {
    var frames = Array.prototype.slice.call(screen.querySelectorAll('img'));
    var index = 0;
    var timer = null;
    var show = function (i) {
      index = i;
      frames.forEach(function (img, j) {
        var on = j === i;
        img.classList.toggle('is-on', on);
        if (on) {
          img.setAttribute('alt', img.getAttribute('data-alt') || '');
          img.removeAttribute('aria-hidden');
        } else {
          img.setAttribute('alt', '');
          img.setAttribute('aria-hidden', 'true');
        }
      });
    };
    var stop = function () {
      if (timer) { clearInterval(timer); timer = null; }
    };
    var play = function () {
      if (timer || paused() || frames.length < 2) { return; }
      timer = setInterval(function () { show((index + 1) % frames.length); }, 6400);
    };
    show(0);
    var pause = document.getElementById('pause-motion');
    if (pause) {
      pause.addEventListener('change', function () {
        if (pause.checked) { stop(); } else { play(); }
      });
    }
    if (!paused()) { play(); }
    if (reduce.addEventListener) {
      reduce.addEventListener('change', function () {
        if (reduce.matches) { stop(); show(0); } else { play(); }
      });
    }
  }

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
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-current', on);
        if (on) { a.setAttribute('aria-current', 'true'); }
        else { a.removeAttribute('aria-current'); }
      });
    };
    var pick = function () {
      var best = targets[0];
      targets.forEach(function (t) {
        if (t.getBoundingClientRect().top <= 120) { best = t; }
      });
      if (best) { mark(best.id); }
    };
    window.addEventListener('scroll', pick, { passive: true });
    pick();
  }
})();
