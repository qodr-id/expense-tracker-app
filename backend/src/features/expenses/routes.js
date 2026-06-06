import { and, desc, eq, gte, lt, sum } from "drizzle-orm";
import { db } from "../../db/index.js";
import { expenses } from "../../db/schema.js";
import { now } from "../../shared/date.js";
import { parseId } from "../../shared/params.js";
import { requireSession } from "../../shared/session.js";

export const expenseCategories = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Hiburan",
  "Lainnya"
];

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function parseMonth(value) {
  const month = typeof value === "string" ? value : currentMonth();
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : null;
}

function monthRange(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const nextMonth = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 10);

  return {
    start: `${month}-01`,
    end: nextMonth
  };
}

export function registerExpenseRoutes(app) {
  app.get("/api/expenses", async (req, res, next) => {
    try {
      const session = await requireSession(req, res);
      if (!session) return;

      const month = parseMonth(req.query.month);

      if (!month) {
        return res.status(400).json({ message: "Format bulan harus YYYY-MM." });
      }

      const range = monthRange(month);
      const filters = and(
        eq(expenses.userId, session.user.id),
        gte(expenses.transactionDate, range.start),
        lt(expenses.transactionDate, range.end)
      );

      const data = await db
        .select()
        .from(expenses)
        .where(filters)
        .orderBy(desc(expenses.transactionDate), desc(expenses.id));
      const [{ total }] = await db
        .select({ total: sum(expenses.amount) })
        .from(expenses)
        .where(filters);

      res.json({ data, month, total: Number(total ?? 0) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/expenses", async (req, res, next) => {
    try {
      const session = await requireSession(req, res);
      if (!session) return;

      const amount = Number(req.body.amount);
      const description =
        typeof req.body.description === "string" ? req.body.description.trim() : "";
      const category = typeof req.body.category === "string" ? req.body.category : "";
      const transactionDate =
        typeof req.body.transactionDate === "string" ? req.body.transactionDate : "";

      if (!Number.isInteger(amount) || amount <= 0) {
        return res.status(400).json({ message: "Nominal harus berupa angka bulat positif." });
      }

      if (!description) {
        return res.status(400).json({ message: "Deskripsi wajib diisi." });
      }

      if (!expenseCategories.includes(category)) {
        return res.status(400).json({ message: "Kategori tidak valid." });
      }

      if (!/^\d{4}-(0[1-9]|1[0-2])-\d{2}$/.test(transactionDate)) {
        return res.status(400).json({ message: "Tanggal transaksi tidak valid." });
      }

      const [expense] = await db
        .insert(expenses)
        .values({
          userId: session.user.id,
          amount,
          description,
          category,
          transactionDate,
          createdAt: now()
        })
        .returning();

      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/expenses/:id", async (req, res, next) => {
    try {
      const session = await requireSession(req, res);
      if (!session) return;

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({ message: "ID expense tidak valid." });
      }

      const [expense] = await db
        .delete(expenses)
        .where(and(eq(expenses.id, id), eq(expenses.userId, session.user.id)))
        .returning();

      if (!expense) {
        return res.status(404).json({ message: "Expense tidak ditemukan." });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
}
