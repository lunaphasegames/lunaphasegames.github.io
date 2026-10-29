(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  const year = document.querySelector("#year");
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 681px)").matches) closeMenu();
  });
})();