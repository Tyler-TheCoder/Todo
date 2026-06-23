const overlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const nameInput = document.getElementById("modal-name-input");
const colorField = document.getElementById("color-field");
const colorOptionsEl = document.getElementById("color-options");
const confirmBtn = document.getElementById("modal-confirm");
const cancelBtn = document.getElementById("modal-cancel");

const COLORS = [
  "#f97316", "#ef4444", "#8b5cf6",
  "#3b82f6", "#10b981", "#f59e0b",
  "#ec4899", "#06b6d4", "#84cc16",
];

let selectedColor = COLORS[0];
let onConfirmCallback = null;

function buildColorSwatches() {
  colorOptionsEl.innerHTML = "";
  COLORS.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch" + (color === selectedColor ? " selected" : "");
    swatch.style.backgroundColor = color;
    swatch.addEventListener("click", () => {
      selectedColor = color;
      document.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("selected"));
      swatch.classList.add("selected");
    });
    colorOptionsEl.appendChild(swatch);
  });
}

export function openModal({ title, showColor = true, initialName = "", initialColor = COLORS[0], onConfirm }) {
  modalTitle.textContent = title;
  nameInput.value = initialName;
  selectedColor = initialColor;
  colorField.style.display = showColor ? "flex" : "none";
  onConfirmCallback = onConfirm;
  buildColorSwatches();
  overlay.classList.add("open");
  nameInput.focus();
}

export function closeModal() {
  overlay.classList.remove("open");
  nameInput.value = "";
  onConfirmCallback = null;
}

export function initModal() {
  cancelBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  confirmBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.style.borderColor = "var(--danger)";
      setTimeout(() => (nameInput.style.borderColor = ""), 1000);
      return;
    }
    if (onConfirmCallback) onConfirmCallback({ name, color: selectedColor });
    closeModal();
  });

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmBtn.click();
    if (e.key === "Escape") closeModal();
  });
}
