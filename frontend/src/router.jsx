import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { ProtectedPage, PublicPage, SignInPage, SignUpPage } from "./features/auth/AuthPages";
import { ExpensesPage } from "./features/expenses/ExpensesPage";
import { NotesPage } from "./features/notes/NotesPage";
import { ThreadsPage } from "./features/threads/ThreadsPage";
import { TodoPage } from "./features/todos/TodoPage";
import { Layout } from "./routes/Layout";
import { authClient } from "./shared/auth-client";

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    throw redirect({ to: session ? "/expenses" : "/sign-in" });
  }
});

const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/expenses",
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: ExpensesPage
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
  expensesRoute,
  todoRoute,
  notesRoute,
  threadsRoute,
  signUpRoute,
  signInRoute,
  publicRoute,
  protectedRoute
]);

export const router = createRouter({ routeTree });
