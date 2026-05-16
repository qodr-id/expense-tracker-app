import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { ProtectedPage, PublicPage, SignInPage, SignUpPage } from "./features/auth/AuthPages";
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

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUpPage
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInPage
});

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/public",
  component: PublicPage
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/protected",
  component: ProtectedPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  todoRoute,
  notesRoute,
  threadsRoute,
  signUpRoute,
  signInRoute,
  publicRoute,
  protectedRoute
]);

export const router = createRouter({ routeTree });
