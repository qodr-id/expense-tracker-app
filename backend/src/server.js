import cors from "cors";
import express from "express";
import { registerNoteRoutes } from "./features/notes/routes.js";
import { registerThreadRoutes } from "./features/threads/routes.js";
import { registerTodoRoutes } from "./features/todos/routes.js";

const app = express();
const port = 3000;
const host = "127.0.0.1";

app.use(cors());
app.use(express.json());

registerTodoRoutes(app);
registerNoteRoutes(app);
registerThreadRoutes(app);

app.listen(port, host, () => {
  console.log(`Backend berjalan di http://localhost:${port}`);
});
