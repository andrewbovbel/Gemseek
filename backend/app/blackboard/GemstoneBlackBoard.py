from AllExperts.Experts import Experts
from ReweighingSystem.ExpertWeights import ExpertWeights
from Input.input import Input


class GemstoneBlackBoard:
    allexperts: Experts
    weights: ExpertWeights
    input: Input
    final_answer = {}

    def __init__(self, allexperts: Experts, weights: ExpertWeights, input: Input):
        self.allexperts = allexperts
        self.weights = weights
        self.input = input

    def activate_experts(self):
        for expert in self.allexperts:
            expert.analyze_input(self.input)


    def determineFinalAnswer(self) -> str:
        pass
