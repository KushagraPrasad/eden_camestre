/* ═══════════════════════════════════════════════
   EDÉN CAMPESTRE — Premium Interactions
   Counter animations, parallax, crossfade gallery,
   multi-directional reveals, FAQ accordion, back-to-top
   ═══════════════════════════════════════════════ */

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const galleryMain = document.querySelector("[data-gallery-main]");
const galleryView = galleryMain?.closest(".gallery-view");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryButtons = document.querySelectorAll("[data-gallery-src]");
const contactForm = document.querySelector("[data-contact-form]");
const backToTop = document.querySelector("[data-back-to-top]");

/* ─── HEADER SCROLL ─── */
function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ─── BACK TO TOP ─── */
function updateBackToTop() {
  if (!backToTop) return;
  backToTop.classList.toggle("is-visible", window.scrollY > 600);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ─── SCROLL REVEAL (Multi-directional) ─── */
const revealConfig = [
  { selector: ".section-heading",           direction: "reveal-up" },
  { selector: ".intro-grid article",        direction: "reveal-up" },
  { selector: ".split-section .media-frame", direction: "reveal-left" },
  { selector: ".section-copy",              direction: "reveal-right" },
  { selector: ".lot-card",                  direction: "reveal-up" },
  { selector: ".amenity-hero",              direction: "reveal-scale" },
  { selector: ".amenity-grid article",      direction: "reveal-up" },
  { selector: ".gallery-view",              direction: "reveal-scale" },
  { selector: ".gallery-strip",             direction: "reveal-up" },
  { selector: ".map-frame",                 direction: "reveal-right" },
  { selector: ".map-section .section-copy",  direction: "reveal-left" },
  { selector: ".faq-item",                  direction: "reveal-up" },
  { selector: ".contact-copy",              direction: "reveal-left" },
  { selector: ".contact-form",              direction: "reveal-right" },

  { selector: ".check-list",               direction: "reveal-fade" },
];

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const allRevealItems = [];

  revealConfig.forEach(({ selector, direction }) => {
    document.querySelectorAll(selector).forEach((item) => {
      item.classList.add("reveal", "is-reveal-ready", direction);
      allRevealItems.push(item);
    });
  });

  // Add stagger delays to grid items
  const gridSelectors = [
    ".intro-grid article",
    ".amenity-grid article",
    ".lot-card",
    ".faq-item",
  ];

  gridSelectors.forEach((sel) => {
    const items = document.querySelectorAll(sel);
    items.forEach((item, i) => {
      const delay = Math.min(i % 4, 3) * 90;
      item.style.setProperty("--reveal-delay", `${delay}ms`);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  allRevealItems.forEach((item) => revealObserver.observe(item));
}

/* ─── HERO PARALLAX ─── */
const heroMedia = document.querySelector(".hero-media img");

if (heroMedia && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector(".hero")?.offsetHeight || 800;

        if (scrollY < heroHeight) {
          const parallaxOffset = scrollY * 0.25;
          heroMedia.style.transform = `scale(${1 + scrollY * 0.0001}) translateY(${parallaxOffset}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ─── COUNTER ANIMATION ─── */
const counterElements = document.querySelectorAll("[data-count-to]");

if (counterElements.length && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.dataset.countTo, 10);
        const prefix = el.dataset.countPrefix || "";
        const suffix = el.dataset.countSuffix || "";
        const useSeparator = el.hasAttribute("data-count-separator");
        const duration = 1800;
        const startTime = performance.now();

        function easeOutQuart(t) {
          return 1 - Math.pow(1 - t, 4);
        }

        function animate(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutQuart(progress);
          let value = Math.round(eased * target);

          if (useSeparator) {
            value = value.toLocaleString("es-MX");
          }

          el.textContent = prefix + value + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((el) => counterObserver.observe(el));
}

/* ─── MOBILE MENU ─── */
menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ─── GALLERY WITH CROSSFADE ─── */
let isGallerySwitching = false;

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isGallerySwitching) return;

    galleryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    // Crossfade transition
    isGallerySwitching = true;
    galleryView?.classList.add("is-fading");

    setTimeout(() => {
      galleryMain.src = button.dataset.gallerySrc;
      galleryMain.alt = button.dataset.galleryAlt || "";

      if (galleryCaption) {
        galleryCaption.textContent = button.dataset.galleryCaption || "";
      }

      galleryView?.classList.toggle("is-contain", button.dataset.galleryFit === "contain");
      galleryView?.classList.toggle("is-cover", button.dataset.galleryFit !== "contain");

      // Wait for image to load then fade in
      const onLoad = () => {
        galleryView?.classList.remove("is-fading");
        isGallerySwitching = false;
      };

      if (galleryMain.complete) {
        onLoad();
      } else {
        galleryMain.addEventListener("load", onLoad, { once: true });
        // Fallback timeout in case load event doesn't fire
        setTimeout(onLoad, 800);
      }
    }, 300);
  });
});

/* ─── FAQ ACCORDION (exclusive open) ─── */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item && other.open) {
          other.open = false;
        }
      });
    }
  });
});

/* ─── CONTACT FORM → WHATSAPP ─── */
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const text = [
    "Hola, quiero información sobre Edén Campestre.",
    name ? `Nombre: ${name}` : "",
    phone ? `Teléfono: ${phone}` : "",
    email ? `Email: ${email}` : "",
    message ? `Mensaje: ${message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  window.open(
    `https://wa.me/529845811387?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener"
  );
});
