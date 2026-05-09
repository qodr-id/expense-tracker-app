import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { todos } from "../../db/schema.js";
import { now } from "../../shared/date.js";
import { parseId } from "../../shared/params.js";

export function registerTodoRoutes(app) {
  app.get("/todos", async (req, res) => {
    const data = await db.select().from(todos).orderBy(desc(todos.createdAt));
    res.json(data);
  });

  app.post("/todos", async (req, res) => {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

    if (!title) {
      return res.status(400).json({ message: "Title wajib diisi." });
    }

    const timestamp = now();
    const [todo] = await db
      .insert(todos)
      .values({ title, completed: false, createdAt: timestamp, updatedAt: timestamp })
      .returning();

    res.status(201).json(todo);
  });

  app.patch("/todos/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID todo tidak valid." });
    }

    const changes = { updatedAt: now() };

    if ("title" in req.body) {
      const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

      if (!title) {
        return res.status(400).json({ message: "Title wajib diisi." });
      }

      changes.title = title;
    }

    if ("completed" in req.body) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({ message: "Completed harus boolean." });
      }

      changes.completed = req.body.completed;
    }

    const [todo] = await db.update(todos).set(changes).where(eq(todos.id, id)).returning();

    if (!todo) {
      return res.status(404).json({ message: "Todo tidak ditemukan." });
    }

    res.json(todo);
  });

  app.delete("/todos/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID todo tidak valid." });
    }

    const [todo] = await db.delete(todos).where(eq(todos.id, id)).returning();

    if (!todo) {
      return res.status(404).json({ message: "Todo tidak ditemukan." });
    }

    res.status(204).send();
  });
}
