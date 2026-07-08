class CostEstimator:
    def estimate(self, payload: dict, stack: list[dict], features: list[dict]) -> dict:
        expected_users = int(payload["expected_users"])
        team_size = int(payload["team_size"])
        budget = int(payload["budget"])
        scale_multiplier = 1 if expected_users <= 10000 else 2 if expected_users <= 100000 else 4
        feature_multiplier = max(1, len(features) / 4)
        monthly = {
            "hosting": 60 * scale_multiplier,
            "database": 45 * scale_multiplier,
            "monitoring": 25 * scale_multiplier,
            "authentication": 20 if "authentication" in payload.get("features", []) else 0,
            "storage": 30 * scale_multiplier,
            "cdn": 20 * scale_multiplier,
            "cache": 35 if any(item["name"] == "Redis" for item in stack) else 0,
            "queue": 25 if payload.get("need_realtime") else 0,
            "email": 15 if "authentication" in payload.get("features", []) else 0,
            "sms": 20 if "Two Factor Authentication" in [f["feature"] for f in features] else 0,
            "maintenance": 120 * scale_multiplier,
        }
        development_total = int((team_size * 3200 + len(stack) * 750 + len(features) * 400) * feature_multiplier)
        development_total = min(max(development_total, 6000), max(budget, 6000))
        monthly_total = sum(monthly.values())
        return {
            "monthly_total": monthly_total,
            "annual_total": monthly_total * 12,
            "development_total": development_total,
            "breakdown": monthly,
        }
