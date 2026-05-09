import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { QueryMessage } from "../../shared/QueryMessage";
import { createNote, getNotes, notesKey } from "./api";

export function NotesPage() {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ title: "", content: "" });
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: [...notesKey, page],
    queryFn: () => getNotes(page),
    placeholderData: keepPreviousData
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      setForm({ title: "", content: "" });
      setPage(1);
      queryClient.invalidateQueries({ queryKey: notesKey });
    }
  });

  function handleSubmit(event) {
    event.preventDefault();
    const title = form.title.trim();
    const content = form.content.trim();

    if (!title || !content) return;
    createMutation.mutate({ title, content });
  }

  const notes = notesQuery.data?.data ?? [];
  const totalPages = notesQuery.data?.totalPages ?? 1;

  return (
    <section className="panel">
      <header className="header">
        <p className="eyebrow">Paginated Query</p>
        <h1>Notes</h1>
      </header>

      <form className="note-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Judul note"
        />
        <textarea
          value={form.content}
          onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
          placeholder="Isi note"
          rows="3"
        />
        <button type="submit" disabled={createMutation.isPending || !form.title.trim() || !form.content.trim()}>
          Simpan Note
        </button>
      </form>

      <QueryMessage query={notesQuery} pendingText="Memuat notes..." />

      <ul className="item-list">
        {notes.map((note) => (
          <li className="note-item" key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>

      <div className="pager">
        <button type="button" onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={page === 1}>
          Sebelumnya
        </button>
        <span>
          Page {page} / {totalPages || 1}
        </span>
        <button
          type="button"
          onClick={() => setPage((current) => current + 1)}
          disabled={notesQuery.isPlaceholderData || page >= totalPages}
        >
          Berikutnya
        </button>
      </div>
    </section>
  );
}
