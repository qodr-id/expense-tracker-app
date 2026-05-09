import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { NotesPage } from "./features/notes/NotesPage";
import { ThreadsPage } from "./features/threads/ThreadsPage";
import { TodoPage } from "./features/todos/TodoPage";
import { HomePage } from "./routes/HomePage";
import { Layout } from "./routes/Layout";

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage
});

const todoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/todo",
  component: TodoPage
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes",
  component: NotesPage
});

const threadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/threads",
  component: ThreadsPage
});

const routeTree = rootRoute.addChildren([indexRoute, todoRoute, notesRoute, threadsRoute]);

export const router = createRouter({ routeTree });
