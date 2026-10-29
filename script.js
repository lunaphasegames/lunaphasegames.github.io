(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav");
  const year = document.querySelector("#year");
  const steamUrl = "https://store.steampowered.com/app/5169010/";
  const discordUrl = "https://discord.gg/uvZzBc7vxM";
  let lastTrigger = null;

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  }

  const openModal = (id, trigger) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastTrigger = trigger || document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const close = modal.querySelector(".modal-close");
    if (close) close.focus();
  };
  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal-layer.is-open")) document.body.classList.remove("modal-open");
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  };

  document.querySelectorAll('a[href="' + steamUrl + '"], a[href="' + steamUrl + '"]').forEach((link) => {
    if (link.classList.contains("modal-external")) return;
    link.addEventListener("click", (event) => { event.preventDefault(); openModal("steam-modal", link); });
  });
  document.querySelectorAll('a[href="' + discordUrl + '"]').forEach((link) => {
    if (link.classList.contains("modal-external")) return;
    link.addEventListener("click", (event) => { event.preventDefault(); openModal("discord-modal", link); });
  });

  document.querySelectorAll(".modal-layer").forEach((modal) => {
    modal.querySelectorAll(".modal-close, .modal-dismiss").forEach((button) => {
      button.addEventListener("click", () => closeModal(modal));
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      document.querySelectorAll(".modal-layer.is-open").forEach(closeModal);
    }
  });
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 641px)").matches) closeMenu();
  });
})();