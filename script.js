// ============================
// Mobile nav toggle
// ============================
const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

function openMenu() {
  navMenu.classList.add("open");
  navToggle.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  navMenu.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // close when a link is tapped
  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // close when tapping anywhere outside the nav
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) closeMenu();
  });

  // close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // if the viewport grows back to desktop size, reset any open state
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

// ============================
// Scroll progress bar
// ============================
const progressBar = document.getElementById("progressBar");

function updateProgressBar() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + "%";
}

// ============================
// Active nav link on scroll
// ============================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveLink() {
  let current = "";
  const scrollPos = window.scrollY + 140;

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", () => {
  updateProgressBar();
  updateActiveLink();
}, { passive: true });

// init on load
updateProgressBar();
updateActiveLink();