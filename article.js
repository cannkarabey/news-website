(function () {
  'use strict';

  var data = window.KESF_DATA;
  if (!data) return;

  /* ── Makale ID'sini URL'den al ── */
  var params     = new URLSearchParams(window.location.search);
  var id         = params.get('id');
  var article    = id ? data.articles[id] : null;

  /* ── Bulunamazsa hata göster ── */
  if (!article) {
    document.title = 'Keşfet — Makale Bulunamadı';
    var body = document.querySelector('.article-body');
    if (body) {
      body.innerHTML =
        '<div class="article-not-found">' +
          '<h2>Makale bulunamadı.</h2>' +
          '<p><a href="index.html">Ana sayfaya dön →</a></p>' +
        '</div>';
    }
    var hero = document.getElementById('articleHero');
    if (hero) hero.style.display = 'none';
    var related = document.getElementById('relatedSection');
    if (related) related.style.display = 'none';
    return;
  }

  /* ── Sayfa title ── */
  document.title = 'Keşfet — ' + article.title;

  /* ── Hero ── */
  var heroImg   = document.getElementById('heroImg');
  var heroCat   = document.getElementById('heroCat');
  var heroTitle = document.getElementById('heroTitle');
  var heroDate  = document.getElementById('heroDate');
  var heroRead  = document.getElementById('heroRead');

  if (heroImg)   { heroImg.src = article.img; heroImg.alt = article.title; }
  if (heroCat)   heroCat.textContent = article.cat;
  if (heroTitle) heroTitle.textContent = article.title;
  if (heroDate)  heroDate.textContent = article.date;
  if (heroRead)  heroRead.textContent = article.readMin + ' dk okuma';

  /* ── Geri linki ── */
  var backLink = document.getElementById('backLink');
  if (backLink) {
    backLink.href = 'category.html?cat=' + article.catKey;
    backLink.textContent = '← ' + (data.categories[article.catKey] || { name: 'Kategoriye' }).name + '\'e Dön';
  }

  /* ── Aktif nav linki ── */
  document.querySelectorAll('[data-cat]').forEach(function (link) {
    link.classList.toggle('active', link.dataset.cat === article.catKey);
  });

  /* ── Makale metni ── */
  var textEl = document.getElementById('articleText');
  if (textEl && article.body) {
    textEl.innerHTML = article.body
      .map(function (item) {
        /* Görsel bloğu: { img: '...', caption: '...' } */
        if (item && typeof item === 'object' && item.img) {
          return (
            '<figure class="article-figure">' +
              '<img src="' + item.img + '" alt="' + (item.caption || article.title) + '" loading="lazy">' +
              (item.caption ? '<figcaption>' + item.caption + '</figcaption>' : '') +
            '</figure>'
          );
        }
        /* Düz paragraf */
        return '<p>' + item + '</p>';
      })
      .join('');
  }

  /* ── İlgili haberler (aynı kategoriden, bu makale hariç, max 3) ── */
  var catData = data.categories[article.catKey];
  var relatedGrid = document.getElementById('relatedGrid');

  if (catData && relatedGrid) {
    var relatedIds = catData.articles
      .filter(function (rid) { return rid !== article.id; })
      .slice(0, 3);

    if (relatedIds.length) {
      relatedGrid.innerHTML = relatedIds.map(function (rid) {
        var a = data.articles[rid];
        if (!a) return '';
        return (
          '<article class="news-card grid-card reveal">' +
            '<div class="card-image">' +
              '<img src="' + a.img + '" alt="' + a.title + '" loading="lazy">' +
              '<span class="card-category">' + a.cat + '</span>' +
            '</div>' +
            '<div class="card-content">' +
              '<h3 class="card-title">' + a.title + '</h3>' +
              '<p class="card-excerpt">' + a.excerpt + '</p>' +
              '<a href="article.html?id=' + a.id + '" class="card-link">Devamını Oku →</a>' +
            '</div>' +
          '</article>'
        );
      }).join('');

      if (typeof window.initReveal === 'function') {
        window.initReveal(relatedGrid);
      }
    } else {
      document.getElementById('relatedSection').style.display = 'none';
    }
  }

})();
