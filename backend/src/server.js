import "dotenv/config";
import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { registerAuthExampleRoutes } from "./features/auth/routes.js";
import { registerNoteRoutes } from "./features/notes/routes.js";
import { registerThreadRoutes } from "./features/threads/routes.js";
import { registerTodoRoutes } from "./features/todos/routes.js";

const app = express();
const port = 3000;
const host = "127.0.0.1";

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true
  })
);

app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());

registerAuthExampleRoutes(app);
registerTodoRoutes(app);
registerNoteRoutes(app);
registerThreadRoutes(app);

app.listen(port, host, () => {
  console.log(`Backend berjalan di http://localhost:${port}`);
});
