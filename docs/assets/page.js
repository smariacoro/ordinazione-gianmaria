// Small helpers only. The page is complete and usable without this file.
(function () {
  var menu = document.querySelector('.menu');
  var here = document.querySelector('.bar__here');
  var homeLabel = here ? here.textContent : '';

  // The menu closes after a choice, on Escape, and when tapping elsewhere.
  if (menu) {
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.open = false; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  }

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

  // The door is drawn in CSS, so tell the verification harness what it paints:
  // how far the arch has opened, and when the altar is resolved and holding.
  var door = document.querySelector('.door');
  var stage = door && door.querySelector('.door__stage');
  if (stage) {
    var report = function () {
      var p = parseFloat(getComputedStyle(door).getPropertyValue('--sc-p')) || 0;
      var a = Math.max(0, Math.min(1, (p - 0.05) / 0.68));
      stage.setAttribute('data-sc-verify-state', a.toFixed(2));
      stage.setAttribute('data-sc-verify-hold', p > 0.82 || p < 0.05 ? 'true' : 'false');
    };
    addEventListener('scroll', report, { passive: true });
    report();
  }
})();
