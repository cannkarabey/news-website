(function () {
  'use strict';

  /* ── Navbar scroll shadow ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ── Hero Slider ── */
  var slides   = Array.from(document.querySelectorAll('.slide'));
  var dots     = Array.from(document.querySelectorAll('.dot'));
  var prevBtn  = document.getElementById('prevBtn');
  var nextBtn  = document.getElementById('nextBtn');
  var current  = 0;
  var timer    = null;
  var INTERVAL = 5000;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function startTimer() { clearInterval(timer); timer = setInterval(next, INTERVAL); }

  if (slides.length > 1) {
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startTimer(); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { goTo(parseInt(dot.dataset.index, 10)); startTimer(); });
    });
    var sliderEl = document.getElementById('heroSlider');
    if (sliderEl) {
      var touchX = 0;
      sliderEl.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
      sliderEl.addEventListener('touchend', function (e) {
        var diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 45) { if (diff > 0) next(); else prev(); startTimer(); }
      }, { passive: true });
    }
    startTimer();
  }

  /* ── Scroll-reveal ── */
  window.initReveal = function (scope) {
    var root = scope || document;
    var els  = Array.from(root.querySelectorAll('.reveal:not(.visible)'));
    if (!els.length) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      els.forEach(function (el) { obs.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('visible'); });
    }
  };
  window.initReveal(document);

  /* ── Search Modal ── */
  var searchBtn     = document.getElementById('searchBtn');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput   = document.getElementById('searchInput');
  var searchClose   = document.getElementById('searchClose');
  var searchResults = document.getElementById('searchResults');

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (searchInput) searchInput.focus(); }, 50);
  }
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) { if (e.target === searchOverlay) closeSearch(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearch(); });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      if (!searchResults) return;
      if (!q) { searchResults.innerHTML = ''; return; }

      var data = window.KESF_DATA;
      if (!data) return;

      var matches = Object.values(data.articles).filter(function (a) {
        return (
          a.title.toLowerCase().indexOf(q) !== -1 ||
          a.excerpt.toLowerCase().indexOf(q) !== -1 ||
          a.cat.toLowerCase().indexOf(q) !== -1
        );
      }).slice(0, 8);

      if (!matches.length) {
        searchResults.innerHTML = '<p class="search-no-results">Sonuç bulunamadı.</p>';
        return;
      }

      searchResults.innerHTML = matches.map(function (a) {
        return (
          '<a href="article.html?id=' + a.id + '" class="search-result-item" onclick="(function(){document.body.style.overflow=\'\';})();">' +
            '<img src="' + a.img + '" alt="' + a.title + '" class="search-result-img">' +
            '<div class="search-result-info">' +
              '<span class="search-result-cat">' + a.cat + '</span>' +
              '<span class="search-result-title">' + a.title + '</span>' +
            '</div>' +
          '</a>'
        );
      }).join('');
    });
  }

  /* ── Son Yazılanlar & Popüler Haberler (homepage only) ── */
  var data = window.KESF_DATA;

  function makeLatestCard(a) {
    return (
      '<a href="article.html?id=' + a.id + '" class="latest-card">' +
        '<img src="' + a.img + '" alt="' + a.title + '" class="lc-img" loading="lazy">' +
        '<div class="lc-body">' +
          '<span class="lc-cat">' + a.cat + '</span>' +
          '<p class="lc-title">' + a.title + '</p>' +
          '<span class="lc-date">' + a.date + '</span>' +
        '</div>' +
      '</a>'
    );
  }

  function makePopularCard(a) {
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
  }

  var latestGrid  = document.getElementById('latestGrid');
  var popularGrid = document.getElementById('popularGrid');

  if (data && latestGrid) {
    var latestHtml = (data.recent || []).map(function (id) {
      var a = data.articles[id];
      return a ? makeLatestCard(a) : '';
    }).join('');
    latestGrid.innerHTML = latestHtml;
  }

  if (data && popularGrid) {
    var popularHtml = (data.popular || []).slice(0, 6).map(function (id) {
      var a = data.articles[id];
      return a ? makePopularCard(a) : '';
    }).join('');
    popularGrid.innerHTML = popularHtml;
    window.initReveal(popularGrid);
  }

})();
