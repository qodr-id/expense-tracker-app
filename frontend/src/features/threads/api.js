import { request } from "../../shared/request";

export const threadsKey = ["threads"];
export const reactionEmojis = ["👍", "❤️", "😂", "😮", "🔥"];

export function getThreads({ pageParam = null }) {
  const search = new URLSearchParams({ limit: "5" });

  if (pageParam) {
    search.set("cursor", pageParam);
  }

  return request(`/threads?${search.toString()}`);
}

export function createThread(content) {
  return request("/threads", {
    method: "POST",
    body: JSON.stringify({ content })
  });
}

export function reactToThread(id, emoji) {
  return request(`/threads/${id}/reactions`, {
    method: "POST",
    body: JSON.stringify({ emoji })
  });
}
