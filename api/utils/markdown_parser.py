import re
from datetime import datetime

DATE_FORMATS = [
    "%m/%d/%Y", "%m/%d/%y", "%m-%d-%Y", "%m-%d-%y",
    "%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y",
    "%b %d, %Y", "%B %d, %Y", "%d %b %Y", "%d %B %Y",
    "%m/%d", "%m-%d",
]

# Regex for lines like: 01/15 STARBUCKS STORE 12345 -4.85
# or: 01/15/2025  STARBUCKS STORE 12345  $4.85
LINE_PATTERN = re.compile(
    r"^(\d{1,2}[/\-]\d{1,2}(?:[/\-]\d{2,4})?)"  # date
    r"\s+"
    r"(.+?)"                                       # description
    r"\s+"
    r"(-?\$?[\d,]+\.\d{2})\s*$"                   # amount
)


def parse_markdown_tables(markdown_text: str) -> list[list[str]]:
    """Extract all rows from markdown tables in the text."""
    rows = []
    for line in markdown_text.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        # Skip separator rows like |---|---|
        if re.match(r"^\|[\s\-:|]+\|$", line):
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if cells:
            rows.append(cells)
    return rows


def parse_lines(markdown_text: str) -> list[dict]:
    """Fallback parser: extract transactions from plain text lines with date + description + amount."""
    transactions = []
    for line in markdown_text.splitlines():
        line = line.strip()
        if not line:
            continue
        m = LINE_PATTERN.match(line)
        if m:
            date_str = try_parse_date(m.group(1))
            if not date_str:
                continue
            description = m.group(2).strip()
            amount = try_parse_amount(m.group(3))
            if amount is not None and description:
                transactions.append({
                    "date": date_str,
                    "description": description,
                    "amount": amount,
                })
    return transactions


def try_parse_date(value: str) -> str | None:
    """Try to parse a date string into ISO format. Returns None if not a date."""
    value = value.strip()
    if not value:
        return None
    for fmt in DATE_FORMATS:
        try:
            dt = datetime.strptime(value, fmt)
            # If year is missing (formats like %m/%d), use current year
            if dt.year == 1900:
                dt = dt.replace(year=datetime.now().year)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def try_parse_amount(value: str) -> float | None:
    """Try to parse an amount string into a float."""
    value = value.strip()
    if not value or value == "-":
        return None
    # Remove currency symbols, commas, spaces
    cleaned = re.sub(r"[$ ,]", "", value)
    # Handle parentheses for negative: (123.45) -> -123.45
    paren_match = re.match(r"^\((.+)\)$", cleaned)
    if paren_match:
        cleaned = "-" + paren_match.group(1)
    try:
        return float(cleaned)
    except ValueError:
        return None


def identify_columns(header_row: list[str]) -> dict[str, int]:
    """Identify date, description, and amount columns from a header row."""
    mapping = {}
    header_lower = [h.lower().strip() for h in header_row]

    # Find date column
    for i, h in enumerate(header_lower):
        if any(kw in h for kw in ["date", "posted", "trans"]):
            mapping["date"] = i
            break

    # Find description column
    for i, h in enumerate(header_lower):
        if any(kw in h for kw in ["description", "desc", "details", "memo", "narrative", "payee", "merchant"]):
            mapping["description"] = i
            break

    # Find amount column(s)
    for i, h in enumerate(header_lower):
        if any(kw in h for kw in ["amount", "total"]):
            mapping["amount"] = i
            break

    # Check for split debit/credit columns
    debit_idx = credit_idx = None
    for i, h in enumerate(header_lower):
        if any(kw in h for kw in ["debit", "withdrawal", "charge"]):
            debit_idx = i
        if any(kw in h for kw in ["credit", "deposit", "payment"]):
            credit_idx = i

    if debit_idx is not None:
        mapping["debit"] = debit_idx
    if credit_idx is not None:
        mapping["credit"] = credit_idx

    return mapping
