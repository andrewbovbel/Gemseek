from AllExperts.AbsExpert import Expert
from Input.input import Input


class ReverseImageExpert(Expert):

    def __init__(self, api):
        self.api = api

    def analyzeInput(self, input: Input) -> str:
        return "Diamond"

    def createSearchPrompt(self, input: Input):
        pass
