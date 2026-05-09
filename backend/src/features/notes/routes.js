import { count, desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { notes } from "../../db/schema.js";
import { now } from "../../shared/date.js";
import { parsePositiveInt } from "../../shared/params.js";

export function registerNoteRoutes(app) {
  app.get("/notes", async (req, res) => {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(parsePositiveInt(req.query.limit, 5), 20);
    const offset = (page - 1) * limit;

    const [{ value: total }] = await db.select({ value: count() }).from(notes);
    const data = await db.select().from(notes).orderBy(desc(notes.createdAt)).limit(limit).offset(offset);

    res.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  });

  app.post("/notes", async (req, res) => {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";

    if (!title) {
      return res.status(400).json({ message: "Title note wajib diisi." });
    }

    if (!content) {
      return res.status(400).json({ message: "Content note wajib diisi." });
    }

    const timestamp = now();
    const [note] = await db
      .insert(notes)
      .values({ title, content, createdAt: timestamp, updatedAt: timestamp })
      .returning();

    res.status(201).json(note);
  });
}
