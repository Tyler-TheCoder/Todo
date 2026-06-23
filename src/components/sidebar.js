import {
  getProjects,
  getActiveProject,
  setActiveProject,
  addProject,
  editProject,
  deleteProject,
} from "../data/store.js";
import { openModal } from "./modal.js";

const projectList = document.getElementById("project-list");
const newProjectBtn = document.getElementById("new-project-btn");

export function renderSidebar() {
  const projects = getProjects();
  const active = getActiveProject();
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const li = document.createElement("li");
    const isActive = project.id === active.id;
    li.className = "project-item" + (isActive ? " active" : "");
    li.innerHTML = `
      <span class="project-color-dot" style="background:${project.color}"></span>
      <span class="project-name" ${isActive ? `style="color:${project.color}"` : ""}>${escapeHtml(project.name)}</span>
      <div class="project-actions">
        <button class="edit-btn" title="Edit">✎</button>
        <button class="delete-btn" title="Delete">✕</button>
      </div>
    `;

    li.addEventListener("click", (e) => {
      if (e.target.closest(".project-actions")) return;
      setActiveProject(project.id);
      const appEl = document.getElementById("app");
      if (appEl) {
        appEl.classList.remove("sidebar-open");
      }
      document.dispatchEvent(new CustomEvent("projectChanged"));
    });

    li.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openModal({
        title: "Edit Project",
        showColor: true,
        initialName: project.name,
        initialColor: project.color,
        onConfirm: ({ name, color }) => {
          editProject(project.id, name, color);
          document.dispatchEvent(new CustomEvent("projectChanged"));
        },
      });
    });

    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (getProjects().length === 1) return;
      deleteProject(project.id);
      document.dispatchEvent(new CustomEvent("projectChanged"));
    });

    projectList.appendChild(li);
  });
}

export function initSidebar() {
  const appEl = document.getElementById("app");
  const menuToggle = document.getElementById("menu-toggle");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  if (menuToggle && appEl) {
    menuToggle.addEventListener("click", () => {
      appEl.classList.toggle("sidebar-open");
    });
  }

  if (sidebarOverlay && appEl) {
    sidebarOverlay.addEventListener("click", () => {
      appEl.classList.remove("sidebar-open");
    });
  }

  newProjectBtn.addEventListener("click", () => {
    openModal({
      title: "New Project",
      showColor: true,
      onConfirm: ({ name, color }) => {
        addProject(name, color);
        if (appEl) {
          appEl.classList.remove("sidebar-open");
        }
        document.dispatchEvent(new CustomEvent("projectChanged"));
      },
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
