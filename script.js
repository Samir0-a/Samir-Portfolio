// ============================
// Firebase / Firestore setup
// ============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================
// Mobile nav toggle
// ============================
const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navBackdrop = document.getElementById("navBackdrop");

// Keep the drawer's top offset in sync with the real header height
// (avoids a hardcoded px value that drifts on different screens/zoom levels)
function setHeaderHeightVar() {
  if (!header) return;
  document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
}
setHeaderHeightVar();
window.addEventListener("resize", setHeaderHeightVar);

function openMenu() {
  navMenu.classList.add("open");
  navToggle.classList.add("open");
  navBackdrop.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("nav-locked");
}

function closeMenu() {
  navMenu.classList.remove("open");
  navToggle.classList.remove("open");
  navBackdrop.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-locked");
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // close when a link is tapped
  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // close when tapping the dimmed backdrop
  navBackdrop.addEventListener("click", closeMenu);

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

// ============================
// Header shrink/blur is handled via CSS sticky + backdrop-filter already
// ============================

// ============================
// Contact form → Firestore
// ============================
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const submitBtn = contactForm.querySelector("button[type='submit']");

    if (!name || !email || !message) {
      formNote.style.color = "#ff8a8a";
      formNote.textContent = "Please fill in every field before sending.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formNote.style.color = "var(--cyan)";
    formNote.textContent = "";

    try {
      await addDoc(collection(db, "portfolioMessages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
        read: false
      });

      formNote.style.color = "var(--cyan)";
      formNote.textContent = `Thanks, ${name}! Your message has been sent.`;
      contactForm.reset();
    } catch (err) {
      console.error("Error sending message:", err);
      formNote.style.color = "#ff8a8a";
      formNote.textContent = "Something went wrong — please try again in a moment.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

// init on load
updateProgressBar();
updateActiveLink();