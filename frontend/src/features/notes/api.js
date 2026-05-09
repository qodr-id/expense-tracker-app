import { request } from "../../shared/request";

export const notesKey = ["notes"];

export function getNotes(page) {
  return request(`/notes?page=${page}&limit=5`);
}

export function createNote(data) {
  return request("/notes", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
