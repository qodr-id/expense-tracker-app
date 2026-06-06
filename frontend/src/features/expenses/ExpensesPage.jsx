import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { authClient } from "../../shared/auth-client";
import { QueryMessage } from "../../shared/QueryMessage";
import {
  createExpense,
  deleteExpense,
  expenseCategories,
  expenseQueryKey,
  getExpenses
} from "./api";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return today().slice(0, 7);
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

function initialForm() {
  return {
    amount: "",
    description: "",
    category: expenseCategories[0],
    transactionDate: today()
  };
}

export function ExpensesPage() {
  const [month, setMonth] = useState(currentMonth());
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const expensesQuery = useQuery({
    queryKey: expenseQueryKey(month),
    queryFn: () => getExpenses(month)
  });

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: async () => {
      setForm(initialForm());
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] })
  });

  function handleSubmit(event) {
    event.preventDefault();

    createMutation.mutate({
      ...form,
      amount: Number(form.amount)
    });
  }

  async function handleSignOut() {
    await authClient.signOut();
    queryClient.clear();
    navigate({ to: "/sign-in" });
  }

  const expenses = expensesQuery.data?.data ?? [];

  return (
    <section className="panel expense-panel">
      <header className="expense-header">
        <div>
          <p className="eyebrow">Expense Tracker</p>
          <h1>Pengeluaran</h1>
          {session ? <p className="expense-user">{session.user.name}</p> : null}
        </div>
        <button className="ghost-button" type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      <div className="expense-summary">
        <span>Total bulan ini</span>
        <strong>{formatRupiah(expensesQuery.data?.total ?? 0)}</strong>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label>
          Nominal
          <input
            type="number"
            min="1"
            step="1"
            value={form.amount}
            onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            placeholder="Contoh: 25000"
            required
          />
        </label>
        <label>
          Deskripsi
          <input
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Contoh: Makan siang"
            required
          />
        </label>
        <label>
          Kategori
          <select
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          >
            {expenseCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Tanggal
          <input
            type="date"
            value={form.transactionDate}
            onChange={(event) =>
              setForm((current) => ({ ...current, transactionDate: event.target.value }))
            }
            required
          />
        </label>
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Menyimpan..." : "Tambah Pengeluaran"}
        </button>
      </form>

      {createMutation.isError ? (
        <p className="message error">{createMutation.error.message}</p>
      ) : null}

      <div className="expense-toolbar">
        <h2>Riwayat</h2>
        <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
      </div>

      <QueryMessage query={expensesQuery} pendingText="Memuat pengeluaran..." />

      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id}>
            <div>
              <strong>{expense.description}</strong>
              <span>
                {expense.category} · {expense.transactionDate}
              </span>
            </div>
            <div className="expense-amount">
              <strong>{formatRupiah(expense.amount)}</strong>
              <button
                className="ghost-button"
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(expense.id)}
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!expensesQuery.isPending && expenses.length === 0 ? (
        <p className="message">Belum ada pengeluaran pada bulan ini.</p>
      ) : null}
    </section>
  );
}
