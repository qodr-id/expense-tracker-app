import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { QueryMessage } from "../../shared/QueryMessage";
import { createTodo, deleteTodo, getTodos, todosKey, updateTodo } from "./api";

export function TodoPage() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: todosKey,
    queryFn: getTodos
  });

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: todosKey });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTodo(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosKey })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosKey })
  });

  function handleSubmit(event) {
    event.preventDefault();

    const nextTitle = title.trim();
    if (!nextTitle) return;

    createMutation.mutate(nextTitle);
  }

  const todos = todosQuery.data ?? [];

  return (
    <section className="panel">
      <header className="header">
        <p className="eyebrow">Simple Todo</p>
        <h1>Todo List</h1>
      </header>

      <form className="stack-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Tulis todo baru"
          disabled={createMutation.isPending}
        />
        <button type="submit" disabled={createMutation.isPending || !title.trim()}>
          Tambah
        </button>
      </form>

      <QueryMessage query={todosQuery} pendingText="Memuat todo..." />

      <ul className="item-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(event) =>
                  updateMutation.mutate({
                    id: todo.id,
                    data: { completed: event.target.checked }
                  })
                }
              />
              <span className={todo.completed ? "completed" : ""}>{todo.title}</span>
            </label>
            <button className="ghost-button" type="button" onClick={() => deleteMutation.mutate(todo.id)}>
              Hapus
            </button>
          </li>
        ))}
      </ul>

      {!todosQuery.isLoading && todos.length === 0 ? <p className="message">Belum ada todo.</p> : null}
    </section>
  );
}
