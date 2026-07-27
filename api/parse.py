import json
import tempfile
import os
from http.server import BaseHTTPRequestHandler
from markitdown import MarkItDown

from api.formats.generic import GenericParser
from api.formats.detector import detect_bank
from api.categorizer.engine import categorize


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def _parse_multipart(body: bytes, content_type: str) -> bytes | None:
    """Extract file bytes from multipart/form-data body."""
    # Get boundary from content-type header
    boundary = None
    for part in content_type.split(";"):
        part = part.strip()
        if part.startswith("boundary="):
            boundary = part[len("boundary="):].strip().strip('"')
            break

    if not boundary:
        return None

    boundary_bytes = boundary.encode()
    parts = body.split(b"--" + boundary_bytes)

    for part in parts:
        if b"filename=" in part and b"application/pdf" in part or b".pdf" in part:
            # Find the empty line that separates headers from body
            header_end = part.find(b"\r\n\r\n")
            if header_end == -1:
                continue
            file_data = part[header_end + 4:]
            # Remove trailing boundary markers
            if file_data.endswith(b"\r\n"):
                file_data = file_data[:-2]
            if file_data.endswith(b"--"):
                file_data = file_data[:-2]
            if file_data.endswith(b"\r\n"):
                file_data = file_data[:-2]
            return file_data

    return None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_type = self.headers.get("Content-Type", "")
        content_length = int(self.headers.get("Content-Length", 0))

        if content_length > MAX_FILE_SIZE:
            self._respond(413, {"error": "File too large. Maximum size is 10MB."})
            return

        if "multipart/form-data" not in content_type:
            self._respond(400, {"error": "Expected multipart/form-data"})
            return

        body = self.rfile.read(content_length)
        file_data = _parse_multipart(body, content_type)

        if not file_data:
            self._respond(400, {"error": "No PDF file found in request"})
            return

        try:
            # Write to temp file for MarkItDown
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                tmp.write(file_data)
                tmp_path = tmp.name

            try:
                md = MarkItDown()
                result = md.convert(tmp_path)
                markdown_text = result.text_content
            finally:
                os.unlink(tmp_path)

            # Detect bank
            bank = detect_bank(markdown_text)

            # Parse transactions
            parser = GenericParser()
            transactions = parser.parse(markdown_text)

            if not transactions:
                self._respond(200, {
                    "bank": bank,
                    "transactions": [],
                    "summary": {
                        "total_income": 0,
                        "total_expenses": 0,
                        "net": 0,
                        "by_category": {},
                    },
                    "warning": "No transactions could be extracted. The PDF format may not be supported.",
                })
                return

            # Categorize
            for txn in transactions:
                txn.category = categorize(txn.description)

            # Compute summary
            total_income = sum(t.amount for t in transactions if t.amount > 0)
            total_expenses = sum(t.amount for t in transactions if t.amount < 0)
            by_category: dict[str, float] = {}
            for t in transactions:
                by_category[t.category] = round(
                    by_category.get(t.category, 0) + t.amount, 2
                )

            self._respond(200, {
                "bank": bank,
                "transactions": [t.to_dict() for t in transactions],
                "summary": {
                    "total_income": round(total_income, 2),
                    "total_expenses": round(total_expenses, 2),
                    "net": round(total_income + total_expenses, 2),
                    "by_category": by_category,
                },
            })

        except Exception as e:
            self._respond(500, {"error": f"Failed to process PDF: {str(e)}"})

    def _respond(self, status: int, data: dict):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
