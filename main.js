/**
 * Maji Flow · main.js
 * Global JavaScript utilities shared across all pages.
 * Page-specific logic lives in the individual template <script> blocks.
 */

/* ── Helper: show a temporary toast notification ── */
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `flash flash-${type}`;
  toast.style.cssText =
    "position:fixed;top:70px;right:1.5rem;z-index:9999;max-width:340px;box-shadow:0 4px 16px rgba(0,0,0,.15);animation:fadeIn .3s;";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

/* ── Helper: generic fetch with JSON body ── */
async function postJSON(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

/* ── Auto-hide flash messages after 5s ── */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".flash").forEach((el) => {
    setTimeout(() => {
      el.style.transition = "opacity .5s";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 500);
    }, 5000);
  });
});

/* ── Highlight active nav link (optional visual aid) ── */
document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname;
  document.querySelectorAll(".nav-btn").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.style.fontWeight = "800";
    }
  });
});
