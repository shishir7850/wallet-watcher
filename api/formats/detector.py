BANK_SIGNATURES = {
    "chase": ["jpmorgan chase", "chase bank", "jpmcb"],
    "bofa": ["bank of america", "bankofamerica"],
    "wells_fargo": ["wells fargo"],
    "citi": ["citibank", "citi bank"],
    "capital_one": ["capital one"],
    "usbank": ["u.s. bank", "us bank"],
    "pnc": ["pnc bank"],
    "td": ["td bank"],
    "amex": ["american express"],
    "discover": ["discover bank", "discover financial"],
}


def detect_bank(markdown_text: str) -> str:
    """Detect bank from markdown text by scanning for signatures."""
    text_lower = markdown_text.lower()
    for bank_id, signatures in BANK_SIGNATURES.items():
        for sig in signatures:
            if sig in text_lower:
                return bank_id
    return "unknown"
