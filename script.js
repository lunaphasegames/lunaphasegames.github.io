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
    if (!document.querySelector(".modal-layer.is-open")) {
      document.body.classList.remove("modal-open");
    }
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  };

  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modal = document.getElementById(trigger.dataset.modalOpen);
      openModal(modal, trigger);
    });
  });

  document.querySelectorAll(".modal-layer").forEach((modal) => {
    modal.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", () => closeModal(modal));
    });
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
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
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
    if (window.matchMedia("(min-width: 641px)").matches) closeMenu();
  });

  // Remove an opaque dark matte from the supplied logo in the browser only.
  // The original art stays untouched in the repository; existing PNG transparency is preserved.
  const logo = document.querySelector("[data-cutout-logo]");
  if (logo) {
    const prepareLogo = () => {
      try {
        if (!logo.naturalWidth || !logo.naturalHeight || logo.dataset.cutoutDone) return;
        const canvas = document.createElement("canvas");
        canvas.width = logo.naturalWidth;
        canvas.height = logo.naturalHeight;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(logo, 0, 0);
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = image.data;
        const width = canvas.width;
        const height = canvas.height;
        const patch = 10;
        const cornerStats = [];
        let transparentSamples = 0;
        let sampled = 0;
        const corners = [
          [0, 0],
          [width - patch, 0],
          [0, height - patch],
          [width - patch, height - patch]
        ];
        corners.forEach(([left, top]) => {
          let alphaSum = 0;
          const colourSum = [0, 0, 0];
          let opaqueCount = 0;
          for (let y = top; y < top + patch; y++) {
            for (let x = left; x < left + patch; x++) {
              const p = (y * width + x) * 4;
              sampled++;
              alphaSum += pixels[p + 3];
              if (pixels[p + 3] < 240) transparentSamples++;
              if (pixels[p + 3] > 10) {
                colourSum[0] += pixels[p];
                colourSum[1] += pixels[p + 1];
                colourSum[2] += pixels[p + 2];
                opaqueCount++;
              }
            }
          }
          const denominator = Math.max(1, opaqueCount);
          cornerStats.push({
            alpha: alphaSum / (patch * patch),
            rgb: colourSum.map((value) => value / denominator)
          });
        });
        // Leave native transparent logos untouched; only process uniformly dark matte corners.
        if (transparentSamples / sampled > 0.08) {
          logo.dataset.cutoutDone = "true";
          return;
        }
        const cornerColours = cornerStats.map((corner) => corner.rgb);
        const avgLuma = cornerColours.reduce((sum, c) => sum + 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2], 0) / cornerColours.length;
        const colourSpread = Math.max(...[0, 1, 2].map((channel) => {
          const values = cornerColours.map((c) => c[channel]);
          return Math.max(...values) - Math.min(...values);
        }));
        const channelSpread = Math.max(...cornerColours.map((c) => Math.max(...c) - Math.min(...c)));
        if (avgLuma > 42 || colourSpread > 35 || channelSpread > 55) {
          logo.dataset.cutoutDone = "true";
          return;
        }
        const bg = [0, 1, 2].map((channel) =>
          cornerColours.reduce((sum, color) => sum + color[channel], 0) / cornerColours.length
        );
        const total = width * height;
        const visited = new Uint8Array(total);
        const queue = new Int32Array(total);
        let head = 0;
        let tail = 0;
        const threshold = 82;
        const seed = (index) => {
          if (visited[index]) return;
          const p = index * 4;
          const distance = Math.hypot(pixels[p] - bg[0], pixels[p + 1] - bg[1], pixels[p + 2] - bg[2]);
          if (distance > threshold) return;
          visited[index] = 1;
          queue[tail++] = index;
        };
        for (let x = 0; x < width; x++) {
          seed(x);
          seed((height - 1) * width + x);
        }
        for (let y = 1; y < height - 1; y++) {
          seed(y * width);
          seed(y * width + width - 1);
        }
        while (head < tail) {
          const index = queue[head++];
          const p = index * 4;
          const distance = Math.hypot(pixels[p] - bg[0], pixels[p + 1] - bg[1], pixels[p + 2] - bg[2]);
          pixels[p + 3] = distance < 24 ? 0 : Math.round(pixels[p + 3] * Math.min(1, (distance - 24) / (threshold - 24)));
          const x = index % width;
          const y = (index / width) | 0;
          if (x > 0) seed(index - 1);
          if (x < width - 1) seed(index + 1);
          if (y > 0) seed(index - width);
          if (y < height - 1) seed(index + width);
        }
        context.putImageData(image, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        document.querySelectorAll("[data-cutout-logo]").forEach((imageElement) => {
          imageElement.src = dataUrl;
          imageElement.dataset.cutoutDone = "true";
        });
      } catch (error) {
        // If pixel access is unavailable, keep the original artwork rather than hide it.
        document.querySelectorAll("[data-cutout-logo]").forEach((imageElement) => {
          imageElement.dataset.cutoutDone = "true";
        });
      }
    };
    if (logo.complete) prepareLogo();
    else logo.addEventListener("load", prepareLogo, { once: true });
  }
})();