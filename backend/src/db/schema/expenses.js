import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth.js";

export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  transactionDate: text("transaction_date").notNull(),
  createdAt: text("created_at").notNull()
});
