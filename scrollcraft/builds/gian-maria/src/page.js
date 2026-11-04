// Small helpers only. The page is complete and usable without this file.
(function () {
  var here = document.querySelector('.bar__here');
  var homeLabel = here ? here.textContent : '';

  // Menus close after a choice, on Escape and when tapping elsewhere; only one stays open.
  var drops = Array.prototype.slice.call(document.querySelectorAll('details.drop'));
  drops.forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target.closest('a')) d.open = false; });
    d.addEventListener('toggle', function () {
      if (d.open) drops.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    drops.forEach(function (d) { if (d.open) { d.open = false; d.querySelector('summary').focus(); } });
  });
  document.addEventListener('click', function (e) {
    drops.forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; });
  });

  // Switching language keeps your place on the page.
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      var base = a.getAttribute('href').split('#')[0];
      a.setAttribute('href', base + location.hash);
    });
  });

  // The bar says, in words, which part of the page you are reading.
  var chapters = document.querySelectorAll('[data-chapter]');
  var links = document.querySelectorAll('.menu__panel a[href^="#"]');
  if ('IntersectionObserver' in window && here) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        here.textContent = en.target.getAttribute('data-chapter') || homeLabel;
        var id = '#' + en.target.id;
        links.forEach(function (l) {
          if (l.getAttribute('href') === id) l.setAttribute('aria-current', 'location');
          else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    chapters.forEach(function (c) { io.observe(c); });
  }

  // Printing needs a script, so the button only appears when it can work.
  var pr = document.querySelector('[data-print]');
  if (pr) { pr.hidden = false; pr.addEventListener('click', function () { window.print(); }); }

  // The confirmation form. It only says "thank you" after the service has really
  // answered yes; anything else keeps what was typed and says so.
  var form = document.querySelector('.rsvp');
  if (form && window.fetch) {
    var status = form.querySelector('.rsvp__status');
    var send = form.querySelector('button[type="submit"]');
    var done = document.querySelector('.rsvp__done');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send.disabled = true;
      status.removeAttribute('data-kind');
      status.textContent = form.getAttribute('data-sending');
      var fail = function () {
        send.disabled = false;
        status.setAttribute('data-kind', 'err');
        status.textContent = form.getAttribute('data-error');
      };
      fetch(form.action, { method: 'POST', body: new URLSearchParams(new FormData(form)) })
        .then(function (r) { return r.json().then(function (j) { return r.ok && j.success === true; }); })
        .then(function (ok) {
          if (!ok) return fail();
          form.hidden = true;
          done.hidden = false;
          done.setAttribute('tabindex', '-1');
          done.focus();
        })
        .catch(fail);
    });
  }

  if (window.ScrollCraft) window.ScrollCraft.mount(document.body);

  // The door glides: the arch eases toward the scroll position instead of jumping
  // with each notch of the wheel. Without this script, or with reduced motion, the
  // stylesheet draws it directly from scroll progress.
  var door = document.querySelector('.door');
  var stage = door && door.querySelector('.door__stage');
  if (stage) {
    var far = stage.querySelector('.door__far');
    var farImg = far.querySelector('img');
    var nearImg = stage.querySelector('.door__near img');
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var phone = window.matchMedia('(max-width: 860px) and (orientation: portrait)');
    var progress = function () {
      var r = door.getBoundingClientRect();
      var travel = r.height - innerHeight;
      return travel > 0 ? Math.max(0, Math.min(1, -r.top / travel)) : 0;
    };
    var opening = function (p) { return Math.max(0, Math.min(1, (p - 0.05) / 0.68)); };
    // Soft start and soft landing.
    var soft = function (x) { return x * x * x * (x * (6 * x - 15) + 10); };
    var cur = opening(progress());
    var last = 0;
    var running = false;
    var report = function (p, a) {
      stage.setAttribute('data-sc-verify-state', a.toFixed(2));
      stage.setAttribute('data-sc-verify-hold', p > 0.82 || p < 0.05 ? 'true' : 'false');
    };
    var paint = function (a) {
      var x = phone.matches ? 50 : 58;
      var y = phone.matches ? 70 : 72;
      var e = soft(a);
      var arch = Math.min(e * 50, (1 - e) * 120);
      far.style.clipPath = 'inset(' + (y * (1 - e)).toFixed(3) + '% ' + ((100 - x) * (1 - e)).toFixed(3) + '% 0 ' + (x * (1 - e)).toFixed(3) + '% round ' + arch.toFixed(3) + 'vw ' + arch.toFixed(3) + 'vw 0 0)';
      nearImg.style.transform = 'scale(' + (1 + 0.28 * e).toFixed(5) + ')';
      farImg.style.transform = 'scale(' + (1.14 - 0.14 * e).toFixed(5) + ')';
    };
    var frame = function (t) {
      var p = progress();
      var target = opening(p);
      var dt = last ? Math.min(t - last, 64) : 16;
      last = t;
      cur += (target - cur) * (1 - Math.exp(-dt / 110));
      if (Math.abs(target - cur) < 0.0008) cur = target;
      paint(cur);
      report(p, cur);
      if (cur !== target) { requestAnimationFrame(frame); } else { running = false; last = 0; }
    };
    var wake = function () {
      if (running) return;
      running = true;
      requestAnimationFrame(frame);
    };
    if (calm) {
      var calmReport = function () { var p = progress(); report(p, opening(p)); };
      addEventListener('scroll', calmReport, { passive: true });
      calmReport();
    } else {
      // Decode both photographs ahead of time, so the first reveal never stutters.
      [farImg, nearImg].forEach(function (i) { if (i.decode) i.decode().catch(function () {}); });
      stage.classList.add('door__stage--live');
      paint(cur);
      report(progress(), cur);
      addEventListener('scroll', wake, { passive: true });
      addEventListener('resize', wake, { passive: true });
    }
  }
})();
