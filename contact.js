// ============================
// Firebase / Firestore setup
// (isolated in its own module so a failed/blocked Firebase load
// never breaks the nav, scroll progress, or rest of the site)
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