# Wallet Watcher

A web app that analyzes bank statement PDFs and visualizes spending by category. Upload a PDF, get instant charts and a sortable transaction table. No data is stored — everything is processed server-side and discarded.

## Features

- **PDF Parsing** — Converts bank statement PDFs to structured data using [MarkItDown](https://github.com/microsoft/markitdown)
- **Auto-categorization** — Classifies transactions into 11 categories (Groceries, Dining, Transport, etc.) using keyword matching
- **Bank Detection** — Identifies the issuing bank from statement content
- **Spending Charts** — Pie chart and horizontal bar chart breakdown via Recharts
- **Transaction Table** — Sortable by date, description, amount, or category with color-coded badges
- **Category Filtering** — Filter the transaction table by one or more categories
- **Summary Cards** — Total income, total expenses, and net at a glance

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Recharts, react-dropzone
- **Backend**: Python 3.12 serverless function on Vercel
- **PDF Processing**: Microsoft MarkItDown

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Python 3.12+
- [Vercel CLI](https://vercel.com/docs/cli) (for local development with Python functions)

### Installation

```bash
git clone https://github.com/shishir7850/wallet-watcher.git
cd wallet-watcher
pnpm install
pip install -r requirements.txt
```

### Development

```bash
npx vercel dev
```

This starts both the Next.js frontend and the Python serverless function locally.

### Production Build

```bash
pnpm build
```

## Deployment

Push to GitHub and connect the repo to [Vercel](https://vercel.com). The `vercel.json` config handles Python runtime setup automatically.

## Supported Banks

The parser uses a generic approach that works with any bank statement containing tabular transaction data. It also detects specific banks for labeling: Chase, Bank of America, Wells Fargo, Citi, Capital One, US Bank, PNC, TD Bank, American Express, and Discover.

## Categories

| Category | Examples |
|----------|----------|
| Groceries | Walmart, Costco, Kroger, Whole Foods |
| Dining | Starbucks, DoorDash, Chipotle, McDonald's |
| Transport | Uber, Lyft, Shell, Chevron, Parking |
| Entertainment | Netflix, Spotify, Hulu, Steam |
| Utilities | Comcast, Verizon, AT&T, Electric |
| Housing | Rent, Mortgage, Home Depot, IKEA |
| Health | CVS, Walgreens, Pharmacy, Hospital |
| Shopping | Amazon, Best Buy, Target, Nike |
| Subscriptions | Gym, Adobe, iCloud, Memberships |
| Income | Payroll, Direct Deposit, Refunds |
| Transfer | Zelle, Venmo, PayPal, Wire |

Transactions that don't match any keyword are labeled **Uncategorized**.

## API

### `POST /api/parse`

Accepts a bank statement PDF via `multipart/form-data`.

**Response:**

```json
{
  "bank": "chase",
  "transactions": [
    {
      "date": "2025-01-03",
      "description": "SPOTIFY USA",
      "amount": -9.99,
      "category": "Entertainment"
    }
  ],
  "summary": {
    "total_income": 5200.00,
    "total_expenses": -3847.52,
    "net": 1352.48,
    "by_category": {
      "Groceries": -624.30,
      "Dining": -312.45
    }
  }
}
```

## License

MIT
