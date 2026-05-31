(function () {
  'use strict';

  var data = window.KESF_DATA;
  if (!data) return;

  /* ── URL parametresinden kategoriyi al ── */
  var params  = new URLSearchParams(window.location.search);
  var catKey  = params.get('cat') || 'gundem';
  var catInfo = data.categories[catKey] || data.categories.gundem;

  /* ── Başlık ve sayfa title ── */
  var nameEl = document.getElementById('catName');
  if (nameEl) nameEl.textContent = catInfo.name;
  document.title = 'Keşfet — ' + catInfo.name;

  /* ── Aktif nav bağlantısını işaretle ── */
  document.querySelectorAll('[data-cat]').forEach(function (link) {
    link.classList.toggle('active', link.dataset.cat === catKey);
  });

  /* ── Haberleri render et ── */
  var grid = document.getElementById('catGrid');
  if (!grid) return;

  var articleIds = catInfo.articles || [];
  var articles   = articleIds
    .map(function (id) { return data.articles[id]; })
    .filter(Boolean);

  if (!articles.length) {
    grid.innerHTML = '<p style="color:var(--muted);padding:2rem 0">Bu kategoride henüz haber bulunmuyor.</p>';
    return;
  }

  grid.innerHTML = articles.map(function (a) {
    return (
      '<article class="news-card cat-card reveal">' +
        '<div class="card-image">' +
          '<img src="' + a.img + '" alt="' + a.title + '" loading="lazy">' +
          '<span class="card-category">' + a.cat + '</span>' +
        '</div>' +
        '<div class="card-content">' +
          '<h2 class="card-title">' + a.title + '</h2>' +
          '<p class="card-excerpt">' + a.excerpt + '</p>' +
          '<a href="article.html?id=' + a.id + '" class="card-link">Devamını Oku →</a>' +
        '</div>' +
      '</article>'
    );
  }).join('');

  /* ── Reveal animasyonunu dinamik elementler için başlat ── */
  if (typeof window.initReveal === 'function') {
    window.initReveal(grid);
  }

})();
