import { Link } from "@tanstack/react-router";
import React from "react";

export function HomePage() {
  return (
    <section className="panel">
      <header className="header">
        <p className="eyebrow">TanStack Demo</p>
        <h1>Frontend + Backend</h1>
      </header>
      <div className="feature-grid">
        <Link to="/todo">Todo List</Link>
        <Link to="/notes">Notes Pagination</Link>
        <Link to="/threads">Thread Infinite Scroll</Link>
      </div>
    </section>
  );
}
