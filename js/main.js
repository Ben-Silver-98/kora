/* ============================================================
   KORA — main.js
   Handles: nav toggle, active links, scroll fade, forms, toast
   ============================================================ */

/* === MOBILE NAV TOGGLE === */
(function () {
  var toggle = document.getElementById('nav-toggle');
  var links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked (mobile UX)
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* === ACTIVE NAV LINK === */
(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    if (a.getAttribute('href') === page) {
      a.classList.add('active');
    }
  });
})();

/* === SCROLL FADE-IN === */
(function () {
  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show immediately
    els.forEach(function (el) { el.classList.add('visible'); });
  }
})();

/* === FORM HANDLER === */
function initForm(formId, confirmId) {
  var form    = document.getElementById(formId);
  var confirm = document.getElementById(confirmId);
  if (!form || !confirm) return;

  // Live clear errors on input
  form.querySelectorAll('.form-control').forEach(function (field) {
    field.addEventListener('input', function () {
      clearError(form, field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      var val = field.value.trim();
      if (!val) {
        showError(form, field, 'This field is required.');
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError(form, field, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError(form, field);
      }
    });

    if (valid) {
      form.style.display = 'none';
      confirm.classList.add('visible');
      confirm.focus();
    }
  });
}

function showError(form, field, msg) {
  field.classList.add('form-control--error');
  var err = form.querySelector('[data-error="' + field.id + '"]');
  if (err) {
    err.textContent = msg;
    err.classList.add('visible');
  }
}

function clearError(form, field) {
  field.classList.remove('form-control--error');
  var err = form.querySelector('[data-error="' + field.id + '"]');
  if (err) err.classList.remove('visible');
}

// Initialise all forms used across pages
initForm('form-waitlist',  'confirm-waitlist');
initForm('form-preorder',  'confirm-preorder');
initForm('form-contact',   'confirm-contact');

/* === PRODUCT TOAST === */
(function () {
  var toast      = document.getElementById('product-toast');
  var toastClose = document.getElementById('toast-close');
  var toastTimer;

  function showToast() {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.classList.add('visible');
    toastTimer = setTimeout(function () {
      toast.classList.remove('visible');
    }, 4000);
  }

  document.querySelectorAll('.product-cta').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showToast();
    });
  });

  if (toastClose && toast) {
    toastClose.addEventListener('click', function () {
      clearTimeout(toastTimer);
      toast.classList.remove('visible');
    });
  }
})();
