import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { QueryMessage } from "../../shared/QueryMessage";
import { createThread, getThreads, reactToThread, reactionEmojis, threadsKey } from "./api";

export function ThreadsPage() {
  const [content, setContent] = useState("");
  const observerRef = useRef(null);
  const queryClient = useQueryClient();

  const threadsQuery = useInfiniteQuery({
    queryKey: threadsKey,
    queryFn: getThreads,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });

  const createMutation = useMutation({
    mutationFn: createThread,
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: threadsKey });
    }
  });

  const reactionMutation = useMutation({
    mutationFn: ({ id, emoji }) => reactToThread(id, emoji),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: threadsKey })
  });

  const lastThreadRef = useCallback(
    (node) => {
      if (threadsQuery.isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && threadsQuery.hasNextPage) {
          threadsQuery.fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [threadsQuery]
  );

  function handleSubmit(event) {
    event.preventDefault();
    const nextContent = content.trim();
    if (!nextContent) return;
    createMutation.mutate(nextContent);
  }

  const threads = threadsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <section className="panel thread-panel">
      <header className="header">
        <p className="eyebrow">Infinite Query</p>
        <h1>Threads</h1>
      </header>

      <form className="note-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Tulis thread baru"
          rows="3"
        />
        <button type="submit" disabled={createMutation.isPending || !content.trim()}>
          Post
        </button>
      </form>

      <QueryMessage query={threadsQuery} pendingText="Memuat threads..." />

      <ul className="item-list">
        {threads.map((thread, index) => {
          const isLast = index === threads.length - 1;

          return (
            <li className="thread-item" key={thread.id} ref={isLast ? lastThreadRef : null}>
              <p>{thread.content}</p>
              <div className="reaction-row">
                <details className="reaction-picker">
                  <summary>React</summary>
                  <div className="emoji-popover">
                    {reactionEmojis.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => reactionMutation.mutate({ id: thread.id, emoji })}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </details>
                {reactionEmojis.map((emoji) => (
                  <span className="reaction-count" key={emoji}>
                    {emoji} {thread.reactions?.[emoji] ?? 0}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {threadsQuery.isFetchingNextPage ? <p className="message">Memuat thread berikutnya...</p> : null}
      {!threadsQuery.hasNextPage && threads.length > 0 ? <p className="message">Semua thread sudah tampil.</p> : null}
    </section>
  );
}
