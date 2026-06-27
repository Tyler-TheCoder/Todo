import {
  getTodos,
  getActiveProject,
  addTodo,
  editTodo,
  toggleTodo,
  deleteTodo,
} from "../data/store.js";
import { openModal } from "./modal.js";

const todoListEl = document.getElementById("todo-list");
const addTodoBtn = document.getElementById("add-todo-btn");
const projectNameLabel = document.getElementById("project-name-label");
const todoCount = document.getElementById("todo-count");
const dot = document.querySelector("#active-project-title .dot");

export function renderTodoList() {
  const project = getActiveProject();
  const todos = getTodos();

  // update header
  projectNameLabel.textContent = project.name;
  dot.style.backgroundColor = project.color;
  const done = todos.filter((t) => t.done).length;
  todoCount.textContent = todos.length === 0
    ? "No todos yet"
    : `${done} / ${todos.length} completed`;

  todoListEl.innerHTML = "";

  if (todos.length === 0) {
    todoListEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>file-document-remove</title><path d="M21.12 15.46L19 17.59L16.88 15.46L15.46 16.88L17.59 19L15.46 21.12L16.88 22.54L19 20.41L21.12 22.54L22.54 21.12L20.41 19L22.54 16.88M6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H13.81C13.28 21.09 13 20.05 13 19C13 18.67 13.03 18.33 13.08 18H6V16H13.81C14.27 15.2 14.91 14.5 15.68 14H6V12H18V13.08C18.33 13.03 18.67 13 19 13C19.34 13 19.67 13.03 20 13.08V8L14 2M13 3.5L18.5 9H13Z" /></svg></div>
        <p>No todos yet. Add one!</p>
      </div>`;
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.innerHTML = `
      <div class="todo-checkbox ${todo.done ? "checked" : ""}" data-id="${todo.id}">
        ${todo.done ? "✓" : ""}
      </div>
      <span class="todo-text ${todo.done ? "done" : ""}">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <button class="edit-btn" title="Edit">✎</button>
        <button class="delete-btn" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></button>
      </div>
    `;

    li.addEventListener("click", (e) => {
      if (e.target.closest(".todo-actions")) return;
      toggleTodo(todo.id);
      renderTodoList();
    });

    li.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openModal({
        title: "Edit Todo",
        showColor: false,
        initialName: todo.text,
        onConfirm: ({ name }) => {
          editTodo(todo.id, name);
          renderTodoList();
        },
      });
    });

    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
      renderTodoList();
    });

    todoListEl.appendChild(li);
  });
}

export function initTodoList() {
  addTodoBtn.addEventListener("click", () => {
    openModal({
      title: "New Todo",
      showColor: false,
      onConfirm: ({ name }) => {
        addTodo(name);
        renderTodoList();
      },
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
