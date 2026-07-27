export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface Summary {
  total_income: number;
  total_expenses: number;
  net: number;
  by_category: Record<string, number>;
}

export interface ParseResponse {
  bank: string;
  transactions: Transaction[];
  summary: Summary;
  warning?: string;
}
