from AllExperts.AbsExpert import Expert
from Input.input import Input


class AIExpert(Expert):

    def __init__(self, api):
        self.api = api

    def createPrompt(self, input: Input):
        return "ruby"

    def analyzeInput(self, input: Input) -> str:
        return "ruby"


