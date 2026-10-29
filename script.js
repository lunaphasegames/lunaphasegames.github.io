(() => {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav");
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  if (!button || !nav) return;
  const close = () => { button.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); };
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
  window.addEventListener("resize", () => { if (window.matchMedia("(min-width: 601px)").matches) close(); });
})();