from abc import ABC, abstractmethod
from Input.input import Input


class Expert(ABC):

    @abstractmethod
    def analyzeInput(self, input: Input) -> str:
        pass
