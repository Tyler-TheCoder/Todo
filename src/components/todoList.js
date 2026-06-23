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
        <div class="empty-icon">📋</div>
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
        <button class="delete-btn" title="Delete">✕</button>
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
