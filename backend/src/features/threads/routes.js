import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../../db/index.js";
import { threadReactions, threads } from "../../db/schema.js";
import { now } from "../../shared/date.js";
import { parseId, parsePositiveInt } from "../../shared/params.js";
import { reactionEmojis } from "./reactions.js";

async function attachReactions(threadRows) {
  const rows = await db.select().from(threadReactions);

  return threadRows.map((thread) => {
    const reactions = Object.fromEntries(reactionEmojis.map((emoji) => [emoji, 0]));

    for (const row of rows) {
      if (row.threadId === thread.id) {
        reactions[row.emoji] = row.count;
      }
    }

    return { ...thread, reactions };
  });
}

export function registerThreadRoutes(app) {
  app.get("/threads", async (req, res) => {
    const cursor = parseId(req.query.cursor);
    const limit = Math.min(parsePositiveInt(req.query.limit, 5), 20);

    let query = db.select().from(threads).orderBy(desc(threads.id)).limit(limit + 1);

    if (cursor) {
      query = query.where(lt(threads.id, cursor));
    }

    const rows = await query;
    const dataRows = rows.slice(0, limit);
    const data = await attachReactions(dataRows);
    const nextCursor = rows.length > limit ? dataRows[dataRows.length - 1].id : null;

    res.json({ data, nextCursor });
  });

  app.post("/threads", async (req, res) => {
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";

    if (!content) {
      return res.status(400).json({ message: "Thread wajib diisi." });
    }

    const timestamp = now();
    const [thread] = await db
      .insert(threads)
      .values({ content, createdAt: timestamp, updatedAt: timestamp })
      .returning();

    const [threadWithReactions] = await attachReactions([thread]);
    res.status(201).json(threadWithReactions);
  });

  app.post("/threads/:id/reactions", async (req, res) => {
    const threadId = parseId(req.params.id);
    const emoji = typeof req.body.emoji === "string" ? req.body.emoji : "";

    if (!threadId) {
      return res.status(400).json({ message: "ID thread tidak valid." });
    }

    if (!reactionEmojis.includes(emoji)) {
      return res.status(400).json({ message: "Emoji reaction tidak valid." });
    }

    const [thread] = await db.select().from(threads).where(eq(threads.id, threadId)).limit(1);

    if (!thread) {
      return res.status(404).json({ message: "Thread tidak ditemukan." });
    }

    const [existing] = await db
      .select()
      .from(threadReactions)
      .where(and(eq(threadReactions.threadId, threadId), eq(threadReactions.emoji, emoji)))
      .limit(1);

    let reaction;

    if (existing) {
      [reaction] = await db
        .update(threadReactions)
        .set({ count: existing.count + 1 })
        .where(eq(threadReactions.id, existing.id))
        .returning();
    } else {
      [reaction] = await db
        .insert(threadReactions)
        .values({ threadId, emoji, count: 1 })
        .returning();
    }

    res.json(reaction);
  });
}
