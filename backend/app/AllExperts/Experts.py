from AllExperts.AbsExpert import Expert


class Experts:
    experts = []

    def __init__(self, experts: list[Expert]):
        self.experts = experts