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
        <Link to="/public">Public</Link>
        <Link to="/protected">Protected</Link>
        <Link to="/sign-in">Sign in</Link>
      </nav>
      <Outlet />
    </main>
  );
}
