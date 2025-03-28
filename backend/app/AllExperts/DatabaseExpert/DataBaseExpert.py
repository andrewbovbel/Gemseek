from AllExperts.AbsExpert import Expert
from Input.input import Input


class DataBaseExpert(Expert):

    def __init__(self, api):
        self.api = api

    def analyzeInput(self, input: Input) -> str:
        return "diamond"

    def createQuery(self) -> str:
        pass
