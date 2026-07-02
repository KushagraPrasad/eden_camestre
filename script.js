const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const galleryMain = document.querySelector("[data-gallery-main]");
const galleryView = galleryMain?.closest(".gallery-view");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryButtons = document.querySelectorAll("[data-gallery-src]");
const contactForm = document.querySelector("[data-contact-form]");
const revealItems = document.querySelectorAll(
  ".section-heading, .intro-grid article, .split-section .media-frame, .section-copy, .lot-card, .amenity-hero, .amenity-grid article, .gallery-view, .gallery-strip, .map-frame, .faq-item, .contact-copy, .contact-form"
);

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if ("IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal", "is-reveal-ready");

    if (item.matches(".intro-grid article, .amenity-grid article, .lot-card, .faq-item")) {
      item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    }
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.16,
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}

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

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    galleryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    galleryMain.src = button.dataset.gallerySrc;
    galleryMain.alt = button.dataset.galleryAlt || "";
    if (galleryCaption) {
      galleryCaption.textContent = button.dataset.galleryCaption || "";
    }
    galleryView?.classList.toggle("is-contain", button.dataset.galleryFit === "contain");
    galleryView?.classList.toggle("is-cover", button.dataset.galleryFit !== "contain");
  });
});

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
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/529845811387?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});
