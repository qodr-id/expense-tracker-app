import { request } from "../../shared/request";

export const todosKey = ["todos"];

export function getTodos() {
  return request("/todos");
}

export function createTodo(title) {
  return request("/todos", {
    method: "POST",
    body: JSON.stringify({ title })
  });
}

export function updateTodo(id, data) {
  return request(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export function deleteTodo(id) {
  return request(`/todos/${id}`, {
    method: "DELETE"
  });
}
