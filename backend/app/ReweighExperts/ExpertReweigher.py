from blackboard.ExpertWeights import ExpertWeights

class ExpertReweigher:

    def __init__(self):
        self.expert_weights = ExpertWeights.getInstance()

    # Subtracts 0.1 from the highest weighted one and distributes it to the others
    def reshuffle_negative(self):
        weights = self.expert_weights.getAllWeights()

        highest_expert = max(weights, key=weights.get)
        highest_weight = weights[highest_expert]

        if highest_weight < 0.1:
            raise ValueError("Highest weight is too low to subtract 0.1")
        self.expert_weights.updateWeight(highest_expert, highest_weight - 0.1)

        other_experts = [expert for expert in weights if expert != highest_expert]
        distribute_amount = 0.1 / len(other_experts)

        for expert in other_experts:
            new_weight = self.expert_weights.getWeight(expert) + distribute_amount
            self.expert_weights.updateWeight(expert, new_weight)
        return

    # Adds 0.1 to the highest weighted one and subtracts it from the others
    def reshuffle_positive(self):
        weights = self.expert_weights.getAllWeights()

        highest_expert = max(weights, key=weights.get)
        lowest_expert = min(weights, key=weights.get)
        highest_weight = weights[highest_expert]
        lowest_weight = weights[lowest_expert]

        #otherwise it will get to more than 1
        if highest_weight >= 0.8:
            return
        # otherwise they will get to less than 0
        if lowest_weight < 0.1:
            return

        self.expert_weights.updateWeight(highest_expert, highest_weight + 0.1)

        other_experts = [expert for expert in weights if expert != highest_expert]
        if not other_experts:
            return  # nothing to redistribute from

        subtract_amount = 0.1 / len(other_experts)

        for expert in other_experts:
            current_weight = self.expert_weights.getWeight(expert)
            new_weight = current_weight - subtract_amount
            if new_weight < 0:
                raise ValueError(f"Resulting weight for {expert.name} would be negative.")
            self.expert_weights.updateWeight(expert, new_weight)
        return
