"use client";

import { useState, useCallback } from "react";
import { ParseResponse } from "@/types/transaction";
import SummaryCards from "./SummaryCards";
import CategoryPieChart from "./CategoryPieChart";
import CategoryBarChart from "./CategoryBarChart";
import TransactionTable from "./TransactionTable";
import CategoryFilter from "./CategoryFilter";

interface DashboardProps {
  data: ParseResponse;
}

export default function Dashboard({ data }: DashboardProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  const categories = Array.from(
    new Set(data.transactions.map((t) => t.category))
  ).sort();

  const handleToggle = useCallback((category: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  return (
    <div className="space-y-6">
      <SummaryCards summary={data.summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryPieChart byCategory={data.summary.by_category} />
        <CategoryBarChart byCategory={data.summary.by_category} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            Transactions ({data.transactions.length})
          </h3>
        </div>
        <CategoryFilter
          categories={categories}
          selected={selectedCategories}
          onToggle={handleToggle}
        />
        <TransactionTable
          transactions={data.transactions}
          filterCategories={selectedCategories}
        />
      </div>
    </div>
  );
}
