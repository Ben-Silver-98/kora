/* ============================================================
   KORA — main.js
   ============================================================ */

/* === NAV: SCROLL SHADOW === */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 100);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* === NAV: MOBILE TOGGLE === */
(function () {
  var toggle = document.getElementById('nav-toggle');
  var links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close when a link is clicked
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* === NAV: ACTIVE LINK === */
(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* === SCROLL FADE-IN === */
(function () {
  var items = document.querySelectorAll('.fade-in');
  if (!items.length) return;

  // CRITICAL FALLBACK: show everything after 400ms regardless of scroll position
  setTimeout(function () {
    items.forEach(function (el) { el.classList.add('visible'); });
  }, 400);

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  });

  items.forEach(function (el) { observer.observe(el); });
})();

/* === FORM HANDLER === */
function initForm(formId, confirmId) {
  var form    = document.getElementById(formId);
  var confirm = document.getElementById(confirmId);
  if (!form || !confirm) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      var val = field.value.trim();
      var err = form.querySelector('[data-error="' + field.id + '"]');
      var isEmpty   = !val;
      var isBadEmail = field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

      if (isEmpty || isBadEmail) {
        field.classList.add('form-control--error');
        if (err) { err.textContent = isEmpty ? 'This field is required.' : 'Please enter a valid email.'; err.classList.add('visible'); }
        valid = false;
      } else {
        field.classList.remove('form-control--error');
        if (err) err.classList.remove('visible');
      }
    });

    if (valid) {
      form.style.display = 'none';
      confirm.classList.add('visible');
    }
  });

  // Live clear on input
  form.querySelectorAll('.form-control').forEach(function (field) {
    field.addEventListener('input', function () {
      field.classList.remove('form-control--error');
      var err = form.querySelector('[data-error="' + field.id + '"]');
      if (err) err.classList.remove('visible');
    });
  });
}

initForm('form-waitlist', 'confirm-waitlist');
initForm('form-preorder', 'confirm-preorder');
initForm('form-contact',  'confirm-contact');
