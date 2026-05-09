import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const threads = sqliteTable("threads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const threadReactions = sqliteTable("thread_reactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  threadId: integer("thread_id").notNull(),
  emoji: text("emoji").notNull(),
  count: integer("count").notNull().default(0)
});
