import { Link, Outlet } from "@tanstack/react-router";
import React from "react";

export function Layout() {
  return (
    <main className="app">
      <nav className="nav">
        <Link to="/" activeOptions={{ exact: true }}>
          Home
        </Link>
        <Link to="/todo">Todo</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/threads">Threads</Link>
      </nav>
      <Outlet />
    </main>
  );
}
