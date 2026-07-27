from abc import ABC, abstractmethod
from api.utils.transaction import Transaction


class BaseParser(ABC):
    @abstractmethod
    def parse(self, markdown_text: str) -> list[Transaction]:
        """Parse markdown text into a list of transactions."""
        ...
