(function () {
  'use strict';

  var form    = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if (!form) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setInvalid(field, invalid) {
    var wrap = field.closest('.form-field');
    if (wrap) wrap.classList.toggle('invalid', invalid);
  }

  /* Yazmaya başlayınca hata durumunu temizle */
  form.addEventListener('input', function (e) {
    if (e.target.matches('input, textarea')) setInvalid(e.target, false);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = form.elements.name;
    var email   = form.elements.email;
    var subject = form.elements.subject;
    var message = form.elements.message;

    var valid = true;
    if (!name.value.trim())                { setInvalid(name, true);    valid = false; }
    if (!EMAIL_RE.test(email.value.trim())) { setInvalid(email, true);   valid = false; }
    if (!subject.value.trim())             { setInvalid(subject, true); valid = false; }
    if (!message.value.trim())             { setInvalid(message, true); valid = false; }

    if (!valid) return;

    /* Statik site: gerçek gönderim yerine başarı durumu gösterilir.
       Backend/Formspree entegrasyonu buraya eklenebilir. */
    form.reset();
    if (success) {
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

})();
