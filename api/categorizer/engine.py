from api.categorizer.dictionary import CATEGORY_KEYWORDS


def _build_lookup() -> list[tuple[str, str]]:
    """Build a flat list of (keyword, category) sorted longest-first."""
    pairs = []
    for category, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            pairs.append((kw.lower(), category))
    pairs.sort(key=lambda p: len(p[0]), reverse=True)
    return pairs


_LOOKUP = _build_lookup()


def categorize(description: str) -> str:
    """Categorize a transaction description using longest-match-first keyword matching."""
    desc_lower = description.lower()
    for keyword, category in _LOOKUP:
        if keyword in desc_lower:
            return category
    return "Uncategorized"
