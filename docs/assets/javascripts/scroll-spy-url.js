/**
 * Scroll-spy URL: обновляет hash в адресной строке по текущей видимой секции
 * при скролле (какой заголовок «в зоне видимости» — тот и в URL).
 */
(function () {
  var ticking = false;
  var lastHash = "";

  function getHeadingElements() {
    var container = document.querySelector(".md-content__inner") || document.querySelector(".md-content") || document.body;
    return container.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");
  }

  function getActiveHeading() {
    var headings = getHeadingElements();
    if (!headings.length) return null;
    // Отступ сверху: фиксированный хедер Material + запас
    var offsetTop = 120;
    var active = null;
    for (var i = 0; i < headings.length; i++) {
      var rect = headings[i].getBoundingClientRect();
      // Заголовок «достигнут», если он уже прошёл верх viewport (с учётом offset)
      if (rect.top <= offsetTop) {
        active = headings[i];
      }
    }
    return active;
  }

  function updateHash() {
    var active = getActiveHeading();
    var hash = active ? "#" + active.id : "";
    if (hash && hash !== lastHash) {
      lastHash = hash;
      if (history.replaceState) {
        history.replaceState(null, null, hash);
      } else {
        location.hash = hash;
      }
    }
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHash);
  }

  function init() {
    var container = document.querySelector(".md-content__inner") || document.querySelector(".md-content");
    if (!container) return;
    lastHash = location.hash || "";
    window.addEventListener("scroll", onScroll, { passive: true });
    // Первое обновление после загрузки/перехода по якорю
    requestAnimationFrame(updateHash);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
