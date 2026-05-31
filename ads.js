(function () {
  'use strict';

  var PREF_KEY     = 'kesf_ad_pref';   // 'ads' | 'noads'
  var SHOWN_KEY    = 'kesf_ad_shown';  // sessionStorage

  /* ── Tercihi uygula ── */
  function applyPref(pref) {
    if (pref === 'noads') {
      document.body.classList.add('no-ads');
      document.documentElement.classList.add('no-ads');
    } else {
      document.body.classList.remove('no-ads');
      document.documentElement.classList.remove('no-ads');
    }
    updateToggleLabel(pref);
  }

  /* ── Floating buton etiketini güncelle ── */
  function updateToggleLabel(pref) {
    var btn = document.getElementById('adChangePref');
    if (!btn) return;
    var span = btn.querySelector('.ad-pref-label');
    if (span) span.textContent = pref === 'noads' ? 'Reklamlı Moda Geç' : 'Reklamsız Moda Geç';
  }

  /* ── Kayıtlı tercihi oku ve uygula (flash engelleme için de <head> scripti var) ── */
  var storedPref = null;
  try { storedPref = localStorage.getItem(PREF_KEY); } catch (e) {}
  if (storedPref) applyPref(storedPref);

  /* ══════════════════════════════════════
     Deneyim Seçim Ekranı
  ══════════════════════════════════════ */
  var choice      = document.getElementById('adChoice');
  var choiceFree  = document.getElementById('adChoiceFree');
  var choiceNoAd  = document.getElementById('adChoiceNoAd');

  function openChoice()  { if (choice) choice.classList.add('open'); }
  function closeChoice() { if (choice) choice.classList.remove('open'); }

  function setPref(pref) {
    try { localStorage.setItem(PREF_KEY, pref); } catch (e) {}
    applyPref(pref);
    closeChoice();
    if (pref === 'ads') schedulePopup();
  }

  /* İlk ziyarette tercih ekranını göster */
  if (!storedPref) {
    setTimeout(openChoice, 800);
  }

  if (choiceFree)  choiceFree.addEventListener('click',  function () { setPref('ads'); });
  if (choiceNoAd)  choiceNoAd.addEventListener('click',  function () { setPref('noads'); });

  /* ── Floating "Reklam Ayarı" butonu ── */
  var prefToggle = document.getElementById('adChangePref');
  if (prefToggle) {
    prefToggle.addEventListener('click', openChoice);
    updateToggleLabel(storedPref);
  }

  /* ══════════════════════════════════════
     Popup Reklam
  ══════════════════════════════════════ */
  var popup      = document.getElementById('adPopup');
  var popupClose = document.getElementById('adPopupClose');

  function closePopup() {
    if (!popup) return;
    popup.classList.remove('open');
    try { sessionStorage.setItem(SHOWN_KEY, '1'); } catch (e) {}
  }

  function schedulePopup() {
    if (!popup) return;
    var shown = false;
    try { shown = sessionStorage.getItem(SHOWN_KEY) === '1'; } catch (e) {}
    if (!shown) setTimeout(function () { popup.classList.add('open'); }, 4500);
  }

  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (popup)      popup.addEventListener('click', function (e) { if (e.target === popup) closePopup(); });

  /* Sadece reklamlı tercihi varsa popup göster */
  if (storedPref === 'ads') schedulePopup();

  /* ══════════════════════════════════════
     Bireysel Reklam Kapatma Butonları
  ══════════════════════════════════════ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.ad-close-btn');
    if (!btn) return;
    /* Popup kapat butonu ayrı işlenir */
    if (btn.id === 'adPopupClose') return;
    var ad = btn.closest('.ad-sidebar, .ad-inline');
    if (ad) ad.style.display = 'none';
  });

  /* ESC tuşu: açık olan her şeyi kapat */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closePopup();
    closeChoice();
  });

})();
