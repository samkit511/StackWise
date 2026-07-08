from app.architecture_engine.engine import ArchitectureEngine
from app.compatibility_engine.engine import CompatibilityEngine
from app.cost_engine.engine import CostEstimator
from app.feature_engine.engine import FeatureRecommendationEngine
from app.models.entities import CompatibilityRule, FeatureRule, RecommendationRule, Technology
from app.services.report_service import build_report_html


CATEGORY_ROLE = {
    "Frontend": "Frontend",
    "Backend": "Backend",
    "Database": "Database",
    "Cache": "Cache",
    "DevOps": "DevOps",
    "Cloud": "Cloud",
    "Security": "Security",
}


class RecommendationEngine:
    def __init__(self) -> None:
        self.compatibility = CompatibilityEngine()
        self.features = FeatureRecommendationEngine()
        self.costs = CostEstimator()
        self.architecture = ArchitectureEngine()

    def recommend(self, payload: dict, technologies: list[Technology], rules: list[RecommendationRule], compatibility_rules: list[CompatibilityRule], feature_rules: list[FeatureRule]) -> dict:
        scored = []
        for technology in technologies:
            tech_rules = [rule for rule in rules if rule.technology_id == technology.id]
            score = 45
            reasons = []
            for rule in tech_rules:
                matches = self._condition_matches(payload, rule.conditions)
                if matches:
                    score += rule.positive_weight
                    reasons.append(f"Matches {', '.join(rule.conditions.keys())}.")
                else:
                    score -= rule.negative_weight
                score += int((rule.compatibility_score + rule.cost_score + rule.scalability_score + rule.learning_curve_score) / 40)
            if payload.get("need_ai") and technology.supports_ai:
                score += 6
                reasons.append("Supports AI-adjacent product requirements.")
            if payload.get("need_realtime") and technology.supports_realtime:
                score += 6
                reasons.append("Supports realtime requirements.")
            score = max(1, min(100, score))
            scored.append({
                "name": technology.name,
                "role": CATEGORY_ROLE.get(technology.category.name, technology.category.name),
                "category": technology.category.name,
                "score": score,
                "confidence": score,
                "official_url": technology.official_url,
                "explanation": " ".join(reasons) or f"{technology.name} is a viable option but matched fewer project-specific rules.",
                "business_justification": f"{technology.name} balances delivery speed, cost, and maintainability for the stated constraints.",
                "technical_justification": f"{technology.name} scored {score} using StackWise weighted rules and knowledge-base attributes.",
                "scalability": technology.performance,
                "estimated_cost": technology.cost,
                "learning_resources": [technology.official_url],
            })
        best_by_role: dict[str, dict] = {}
        for item in sorted(scored, key=lambda x: x["score"], reverse=True):
            role = item["role"]
            if role not in best_by_role:
                best_by_role[role] = item
        required_roles = ["Frontend", "Backend", "Database", "DevOps", "Cloud", "Security"]
        stack = [best_by_role[role] for role in required_roles if role in best_by_role]
        blocked = self.compatibility.incompatible_names([item["name"] for item in stack], compatibility_rules)
        stack = [item for item in stack if item["name"] not in blocked]
        alternatives = [item for item in sorted(scored, key=lambda x: x["score"], reverse=True) if item not in stack][:6]
        feature_recommendations = self.features.recommend(payload.get("features", []), feature_rules)
        matrix = self.compatibility.build_matrix(stack, compatibility_rules)
        architecture = self.architecture.recommend(payload, stack)
        existing_analysis = self.architecture.analyze_existing_project(payload, stack)
        cost_estimate = self.costs.estimate(payload, stack, feature_recommendations)
        scores = {
            "overall_architecture": self._average([item["score"] for item in stack]),
            "scalability": self._average([item["score"] for item in stack if item["role"] in {"Backend", "Database", "Cloud", "Cache"}]),
            "security": self._average([item["score"] for item in stack if item["role"] in {"Security", "Backend", "Database"}]),
            "cost": max(40, 100 - int(cost_estimate["monthly_total"] / 12)),
            "maintainability": self._average([item["score"] for item in stack if item["role"] in {"Frontend", "Backend", "DevOps"}]),
        }
        result = {
            "summary": f"StackWise recommends a {architecture['pattern']} using {', '.join(item['name'] for item in stack)} because it best fits the submitted business, team, budget, and scale constraints.",
            "confidence": self._average([item["confidence"] for item in stack]),
            "scores": scores,
            "recommended_stack": stack,
            "alternative_stack": alternatives,
            "compatibility_matrix": matrix,
            "feature_recommendations": feature_recommendations,
            "existing_project_analysis": existing_analysis,
            "cost_estimate": cost_estimate,
            "architecture": architecture,
            "development_timeline": self._timeline(payload, len(feature_recommendations)),
        }
        result["report_html"] = build_report_html(result)
        return result

    def _condition_matches(self, payload: dict, conditions: dict) -> bool:
        matched = 0
        for key, expected in conditions.items():
            actual = payload.get(key)
            if key == "expected_users" and isinstance(expected, str) and expected.startswith(">"):
                matched += int(int(actual) > int(expected[1:]))
            elif isinstance(expected, list):
                if isinstance(actual, list):
                    matched += int(bool(set(expected) & set(actual)))
                else:
                    matched += int(actual in expected)
            else:
                matched += int(actual == expected)
        return matched > 0

    def _average(self, values: list[int]) -> int:
        return int(sum(values) / len(values)) if values else 70

    def _timeline(self, payload: dict, feature_count: int) -> list[dict]:
        base = 2 if payload["timeline"] == "urgent" else 3
        return [
            {"phase": "Discovery and architecture", "weeks": base, "outcome": "Validated scope, stack, and delivery plan"},
            {"phase": "MVP build", "weeks": base + max(2, feature_count // 2), "outcome": "Core product workflows and APIs"},
            {"phase": "Hardening and launch", "weeks": 2, "outcome": "Testing, deployment, documentation, and monitoring"},
        ]
