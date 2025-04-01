from typing import Dict
from blackboard.ExpertType import ExpertType

class ExpertWeights:
    _instance = None

    def __init__(self, weights: Dict[ExpertType, float]):
        # Prevent direct instantiation from outside
        if ExpertWeights._instance is not None:
            raise Exception("Use getInstance() to access the singleton instance.")
        self.expertWeights: Dict[ExpertType, float] = weights
        ExpertWeights._instance = self

    @staticmethod
    def getInstance():
        return ExpertWeights._instance

    def updateWeight(self, expert_type: ExpertType, new_weight: float):
        if expert_type in self.expertWeights:
            self.expertWeights[expert_type] = new_weight
        else:
            raise ValueError(f"{expert_type} has not been initialized in the weights.")

    def getWeight(self, expert_type: ExpertType) -> float:
        return self.expertWeights.get(expert_type, 0.0)

    def getAllWeights(self) -> Dict[ExpertType, float]:
        return self.expertWeights