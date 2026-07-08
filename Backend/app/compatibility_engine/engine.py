from app.models.entities import CompatibilityRule


class CompatibilityEngine:
    def build_matrix(self, stack: list[dict], rules: list[CompatibilityRule]) -> list[dict]:
        names = [item["name"] for item in stack]
        matrix: list[dict] = []
        for source in names:
            for target in names:
                if source == target:
                    continue
                rule = next((r for r in rules if r.source.name == source and r.target.name == target), None)
                if rule:
                    matrix.append({"source": source, "target": target, "status": rule.status, "score": rule.score, "reason": rule.reason})
                else:
                    matrix.append({"source": source, "target": target, "status": "compatible", "score": 78, "reason": "No blocking rule exists in the StackWise knowledge base."})
        return matrix

    def incompatible_names(self, names: list[str], rules: list[CompatibilityRule]) -> set[str]:
        blocked: set[str] = set()
        for rule in rules:
            if rule.status == "incompatible" and rule.source.name in names and rule.target.name in names:
                blocked.add(rule.target.name)
        return blocked
