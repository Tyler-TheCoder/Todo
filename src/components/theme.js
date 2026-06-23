import { getTheme, toggleTheme } from "../data/store.js";

const btn = document.getElementById("theme-toggle");

export function initTheme() {
  applyTheme(getTheme());
  btn.addEventListener("click", () => {
    toggleTheme();
    applyTheme(getTheme());
  });
}

function applyTheme(theme) {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  btn.textContent = theme === "dark" ? "🌙" : "☀️";
}
