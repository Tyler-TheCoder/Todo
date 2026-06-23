import { loadState, saveState } from "../utils/storage.js";

function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function createDefaultState() {
  const defaultProjectId = generateId();
  return {
    projects: [
      {
        id: defaultProjectId,
        name: "Default",
        color: "#f97316",
        todos: [],
      },
    ],
    activeProjectId: defaultProjectId,
    theme: "dark",
  };
}

let state = loadState() || createDefaultState();

function persist() {
  saveState(state);
}

// ─── Theme ───────────────────────────────────────────────
export function getTheme() {
  return state.theme;
}

export function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  persist();
}

// ─── Projects ────────────────────────────────────────────
export function getProjects() {
  return state.projects;
}

export function getActiveProject() {
  return state.projects.find((p) => p.id === state.activeProjectId) || state.projects[0];
}

export function setActiveProject(id) {
  state.activeProjectId = id;
  persist();
}

export function addProject(name, color) {
  const project = {
    id: generateId(),
    name,
    color,
    todos: [],
  };
  state.projects.push(project);
  state.activeProjectId = project.id;
  persist();
  return project;
}

export function editProject(id, name, color) {
  const project = state.projects.find((p) => p.id === id);
  if (!project) return;
  project.name = name;
  project.color = color;
  persist();
}

export function deleteProject(id) {
  // prevent deleting last project
  if (state.projects.length === 1) return;
  state.projects = state.projects.filter((p) => p.id !== id);
  if (state.activeProjectId === id) {
    state.activeProjectId = state.projects[0].id;
  }
  persist();
}

// ─── Todos ───────────────────────────────────────────────
export function getTodos() {
  return getActiveProject().todos;
}

export function addTodo(text) {
  const todo = {
    id: generateId(),
    text,
    done: false,
    createdAt: Date.now(),
  };
  getActiveProject().todos.push(todo);
  persist();
  return todo;
}

export function editTodo(todoId, text) {
  const todo = getActiveProject().todos.find((t) => t.id === todoId);
  if (!todo) return;
  todo.text = text;
  persist();
}

export function toggleTodo(todoId) {
  const todo = getActiveProject().todos.find((t) => t.id === todoId);
  if (!todo) return;
  todo.done = !todo.done;
  persist();
}

export function deleteTodo(todoId) {
  const project = getActiveProject();
  project.todos = project.todos.filter((t) => t.id !== todoId);
  persist();
}
