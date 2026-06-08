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
  shuffleUseAiBrokerTable();
});

// Shuffle the community broker list on the developer quickstart page so no
// single broker is permanently displayed first. The list is identified by the
// presence of links to the known broker hostnames, so no markdown change is
// required when this script ships. New brokers added to the same <ul> in
// docs/developer/quickstart.md will be shuffled together automatically as long
// as at least one of the known hostnames is still present.
//
// The order is re-randomized on every page load.
function shuffleBrokerList() {
  const BROKER_HOST_PATTERN = /(proxy\.gonka\.gg|gonkagate\.com|gate\.joingonka\.ai)/i;

  const targets = new Set();
  document.querySelectorAll("a[href]").forEach((a) => {
    if (!BROKER_HOST_PATTERN.test(a.href)) return;
    const ul = a.closest("ul");
    if (ul) targets.add(ul);
  });
  if (targets.size === 0) return;

  targets.forEach((ul) => {
    const items = Array.from(ul.children);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    items.forEach((li) => ul.appendChild(li));
  });
}

// Shuffle the broker table on the Use AI page so table position is not a
// ranking. The table is identified by its header labels.
function shuffleUseAiBrokerTable() {
  document.querySelectorAll("table").forEach((table) => {
    const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
      th.textContent.trim().toLowerCase()
    );
    const isUseAiBrokerTable =
      headers[0] === "broker" &&
      headers[1] === "for humans" &&
      headers[2] === "for agents";
    if (!isUseAiBrokerTable) return;

    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr"));
    for (let i = rows.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rows[i], rows[j]] = [rows[j], rows[i]];
    }
    rows.forEach((row) => tbody.appendChild(row));
  });
}
