from app.models.entities import FeatureRule


class FeatureRecommendationEngine:
    def recommend(self, selected_features: list[str], rules: list[FeatureRule]) -> list[dict]:
        selected = {feature.lower() for feature in selected_features}
        recommendations: list[dict] = []
        seen: set[str] = set()
        for rule in rules:
            if rule.trigger.lower() in selected:
                for item in rule.recommendations:
                    if item["feature"] not in seen:
                        recommendations.append(item)
                        seen.add(item["feature"])
        return recommendations
