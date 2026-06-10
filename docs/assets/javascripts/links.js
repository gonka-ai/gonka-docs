document.addEventListener("DOMContentLoaded", function() {
  const links = document.querySelectorAll("a[href^='http']");
  links.forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  // Only show the header drop-shadow once the user has scrolled off the top.
  // Material renders .md-header--shadow statically, so we drive it ourselves.
  const header = document.querySelector(".md-header");
  if (header) {
    const sync = () => header.classList.toggle("md-header--shadow", window.scrollY > 0);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  shuffleBrokerList();
  shuffleList(".broker-dashboards");
});

// Fisher-Yates shuffle for children of a container element.
function shuffleChildren(container) {
  const items = Array.from(container.children);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  items.forEach((el) => container.appendChild(el));
}

// Shuffle the community broker list on the developer quickstart page so no
// single broker is permanently displayed first. The list is identified by the
// presence of links to the known broker hostnames, so no markdown change is
// required when this script ships. New brokers added to the same <ul> in
// docs/developer/quickstart.md will be shuffled together automatically as long
// as at least one of the known hostnames is still present.
//
// The order is re-randomized on every page load.
function shuffleBrokerList() {
  const BROKER_HOST_PATTERN = /(proxy\.gonka\.gg|gonkagate\.com|gate\.joingonka\.ai|router\.gonkascan\.com|gonka-api\.org|gonkabroker\.com|gonka-gateway\.mingles\.ai|console\.hyperfusion\.io)/i;

  const targets = new Set();
  document.querySelectorAll("a[href]").forEach((a) => {
    if (!BROKER_HOST_PATTERN.test(a.href)) return;
    const ul = a.closest("ul");
    if (ul) targets.add(ul);
  });
  if (targets.size === 0) return;

  targets.forEach((ul) => shuffleChildren(ul));
}

// Shuffle any list identified by CSS selector.
function shuffleList(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    if (el.children.length > 1) shuffleChildren(el);
  });
}
