from AllExperts.AbsExpert import Expert
from AllExperts.Experts import Experts
from blackboard.ExpertWeights import ExpertWeights
from Input.input import Input


class GemstoneBlackBoard:
    allexperts: Experts
    expert_weights: ExpertWeights
    input: Input
    answers = {} # will look something like this answers = {"ruby": 0.4,"quarts": 0.3,"diamond": 0.3}

    def __init__(self, allexperts: Experts, weights: ExpertWeights, input: Input):
        self.allexperts = allexperts
        self.expert_weights = weights
        self.input = input

    def activate_experts(self):
        for expert in self.allexperts.experts:
            expert_weight = self._lookup_expert_weight(expert)
            answer = expert.analyzeInput(self.input)
            if answer is None:
                return
            answer = answer.lower()
            if answer in self.answers:
                self.answers[answer] += expert_weight
            else:
                self.answers[answer] = expert_weight



    def determineFinalAnswer(self) -> str:
        max_value = float('-inf')

        max_key = None
        for key in self.answers:
            value = self.answers[key]

            if value > max_value:
                max_value = value
                max_key = key

        return max_key

    def _lookup_expert_weight(self, expert: Expert) -> float:
        for key in self.expert_weights.expertWeights.keys():
            if key.value == type(expert).__name__:
                return self.expert_weights.expertWeights[key]

