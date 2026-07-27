"use client";

import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { formatCurrency, formatDate, getCategoryColor } from "@/lib/formatters";

type SortField = "date" | "description" | "amount" | "category";
type SortDir = "asc" | "desc";

interface TransactionTableProps {
  transactions: Transaction[];
  filterCategories: Set<string>;
}

export default function TransactionTable({
  transactions,
  filterCategories,
}: TransactionTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const filtered =
    filterCategories.size === 0
      ? transactions
      : transactions.filter((t) => filterCategories.has(t.category));

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "date":
        cmp = a.date.localeCompare(b.date);
        break;
      case "description":
        cmp = a.description.localeCompare(b.description);
        break;
      case "amount":
        cmp = a.amount - b.amount;
        break;
      case "category":
        cmp = a.category.localeCompare(b.category);
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              {(
                [
                  ["date", "Date"],
                  ["description", "Description"],
                  ["amount", "Amount"],
                  ["category", "Category"],
                ] as [SortField, string][]
              ).map(([field, label]) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                >
                  {label}
                  {sortIcon(field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {formatDate(t.date)}
                </td>
                <td className="px-4 py-3 text-gray-900 max-w-xs truncate">
                  {t.description}
                </td>
                <td
                  className={`px-4 py-3 font-medium whitespace-nowrap ${
                    t.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.amount >= 0 ? "+" : ""}
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: getCategoryColor(t.category) }}
                  >
                    {t.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          No transactions match the selected filters.
        </p>
      )}
    </div>
  );
}
