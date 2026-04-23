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
});
