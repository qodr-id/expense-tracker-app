import { request } from "../../shared/request";

export const expenseCategories = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Hiburan",
  "Lainnya"
];

export function expenseQueryKey(month) {
  return ["expenses", month];
}

export function getExpenses(month) {
  return request(`/api/expenses?month=${month}`);
}

export function createExpense(data) {
  return request("/api/expenses", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function deleteExpense(id) {
  return request(`/api/expenses/${id}`, {
    method: "DELETE"
  });
}
