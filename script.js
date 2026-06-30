const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const galleryMain = document.querySelector("[data-gallery-main]");
const galleryView = galleryMain?.closest(".gallery-view");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryButtons = document.querySelectorAll("[data-gallery-src]");
const contactForm = document.querySelector("[data-contact-form]");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

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
