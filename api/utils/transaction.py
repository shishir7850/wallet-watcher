from dataclasses import dataclass, asdict


@dataclass
class Transaction:
    date: str
    description: str
    amount: float
    category: str = "Uncategorized"

    def to_dict(self) -> dict:
        return asdict(self)
