import "./styles/main.css";
import { initTheme } from "./components/theme.js";
import { initModal } from "./components/modal.js";
import { initSidebar, renderSidebar } from "./components/sidebar.js";
import { initTodoList, renderTodoList } from "./components/todoList.js";

function render() {
  renderSidebar();
  renderTodoList();
}

initTheme();
initModal();
initSidebar();
initTodoList();

document.addEventListener("projectChanged", render);

render();
