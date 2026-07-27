export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const CATEGORY_COLORS: Record<string, string> = {
  Groceries: "#22c55e",
  Dining: "#f97316",
  Transport: "#3b82f6",
  Entertainment: "#a855f7",
  Utilities: "#64748b",
  Housing: "#eab308",
  Health: "#ef4444",
  Shopping: "#ec4899",
  Subscriptions: "#06b6d4",
  Income: "#10b981",
  Transfer: "#8b5cf6",
  Uncategorized: "#9ca3af",
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "#9ca3af";
}
