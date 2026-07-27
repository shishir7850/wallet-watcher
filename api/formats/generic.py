from api.formats.base import BaseParser
from api.utils.transaction import Transaction
from api.utils.markdown_parser import (
    parse_markdown_tables,
    parse_lines,
    try_parse_date,
    try_parse_amount,
    identify_columns,
)


class GenericParser(BaseParser):
    def parse(self, markdown_text: str) -> list[Transaction]:
        # Try markdown table parsing first
        rows = parse_markdown_tables(markdown_text)
        if len(rows) >= 2:
            col_map = identify_columns(rows[0])
            data_rows = rows[1:]

            if "date" in col_map and "description" in col_map:
                result = self._parse_mapped(data_rows, col_map)
                if result:
                    return result

            result = self._parse_heuristic(rows)
            if result:
                return result

        # Fallback: line-based parsing for non-table output
        line_results = parse_lines(markdown_text)
        if line_results:
            return [
                Transaction(
                    date=r["date"],
                    description=r["description"],
                    amount=round(r["amount"], 2),
                )
                for r in line_results
            ]

        return []

    def _parse_mapped(self, rows: list[list[str]], col_map: dict[str, int]) -> list[Transaction]:
        transactions = []
        for cells in rows:
            if len(cells) <= max(col_map.values()):
                continue

            date_str = try_parse_date(cells[col_map["date"]])
            if not date_str:
                continue

            description = cells[col_map["description"]].strip()
            if not description:
                continue

            amount = None
            if "amount" in col_map:
                amount = try_parse_amount(cells[col_map["amount"]])
            elif "debit" in col_map or "credit" in col_map:
                debit = try_parse_amount(cells[col_map["debit"]]) if "debit" in col_map else None
                credit = try_parse_amount(cells[col_map["credit"]]) if "credit" in col_map else None
                if debit is not None:
                    amount = -abs(debit)
                elif credit is not None:
                    amount = abs(credit)

            if amount is None:
                continue

            transactions.append(Transaction(
                date=date_str,
                description=description,
                amount=round(amount, 2),
            ))
        return transactions

    def _parse_heuristic(self, rows: list[list[str]]) -> list[Transaction]:
        transactions = []
        for cells in rows:
            date_str = None
            amounts = []
            description_parts = []

            for cell in cells:
                parsed_date = try_parse_date(cell)
                if parsed_date and not date_str:
                    date_str = parsed_date
                    continue

                parsed_amount = try_parse_amount(cell)
                if parsed_amount is not None:
                    amounts.append(parsed_amount)
                    continue

                if cell.strip():
                    description_parts.append(cell.strip())

            if not date_str or not amounts or not description_parts:
                continue

            # Use the last amount found (usually the transaction amount)
            amount = amounts[-1]
            description = " ".join(description_parts)

            transactions.append(Transaction(
                date=date_str,
                description=description,
                amount=round(amount, 2),
            ))
        return transactions
