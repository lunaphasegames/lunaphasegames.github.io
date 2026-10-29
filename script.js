(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  const year = document.querySelector("#year");
  let lastTrigger = null;

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a,button").forEach((item) => item.addEventListener("click", closeMenu));
  }

  const openModal = (modal, trigger) => {
    if (!modal) return;
    lastTrigger = trigger || document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const panel = modal.querySelector('[role="dialog"]');
    if (panel) panel.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal-layer.is-open")) document.body.classList.remove("modal-open");
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  };

  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(document.getElementById(trigger.dataset.modalOpen), trigger));
  });

  document.querySelectorAll(".modal-layer").forEach((modal) => {
    modal.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", () => closeModal(modal)));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(modal.querySelectorAll("a[href],button:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      document.querySelectorAll(".modal-layer.is-open").forEach((modal) => closeModal(modal));
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 681px)").matches) closeMenu();
  });
})();