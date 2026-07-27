import { Summary } from "@/types/transaction";
import { formatCurrency } from "@/lib/formatters";

interface SummaryCardsProps {
  summary: Summary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <p className="text-sm font-medium text-green-600">Total Income</p>
        <p className="mt-1 text-2xl font-bold text-green-700">
          {formatCurrency(summary.total_income)}
        </p>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-medium text-red-600">Total Expenses</p>
        <p className="mt-1 text-2xl font-bold text-red-700">
          {formatCurrency(Math.abs(summary.total_expenses))}
        </p>
      </div>
      <div
        className={`rounded-xl border p-5 ${
          summary.net >= 0
            ? "border-emerald-200 bg-emerald-50"
            : "border-orange-200 bg-orange-50"
        }`}
      >
        <p
          className={`text-sm font-medium ${
            summary.net >= 0 ? "text-emerald-600" : "text-orange-600"
          }`}
        >
          Net
        </p>
        <p
          className={`mt-1 text-2xl font-bold ${
            summary.net >= 0 ? "text-emerald-700" : "text-orange-700"
          }`}
        >
          {summary.net >= 0 ? "+" : ""}
          {formatCurrency(summary.net)}
        </p>
      </div>
    </div>
  );
}
