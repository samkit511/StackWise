import json
from pathlib import Path

from sqlalchemy import select

from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.models.entities import CompatibilityRule, FeatureRule, RecommendationRule, Technology, TechnologyCategory, TechnologyKnowledgeBase


def seed_root() -> Path:
    current = Path(__file__).resolve()
    candidates = [
        current.parents[2] / "Database" / "seeds",
        current.parents[3] / "Database" / "seeds",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[0]


SEED_ROOT = seed_root()


def load_json(name: str) -> list[dict]:
    return json.loads((SEED_ROOT / name).read_text(encoding="utf-8"))


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(Technology).limit(1)):
            return
        categories: dict[str, TechnologyCategory] = {}
        for item in load_json("technologies.json"):
            category = categories.get(item["category"])
            if category is None:
                category = TechnologyCategory(name=item["category"], description=f"{item['category']} technologies")
                db.add(category)
                db.flush()
                categories[item["category"]] = category
            technology = Technology(
                name=item["name"],
                category_id=category.id,
                language=item["language"],
                supports_ai=item["supports_ai"],
                supports_realtime=item["supports_realtime"],
                learning_curve=item["learning_curve"],
                community=item["community"],
                performance=item["performance"],
                cost=item["cost"],
                official_url=item["official_url"],
                pros=item["pros"],
                cons=item["cons"],
                use_cases=item["use_cases"],
            )
            db.add(technology)
            db.flush()
            db.add(TechnologyKnowledgeBase(technology_id=technology.id, details=item))
        db.flush()
        tech_by_name = {tech.name: tech for tech in db.scalars(select(Technology))}
        for rule in load_json("recommendation_rules.json"):
            db.add(RecommendationRule(technology_id=tech_by_name[rule["technology"]].id, conditions=rule["conditions"], positive_weight=rule["positive_weight"], negative_weight=rule["negative_weight"], compatibility_score=rule["compatibility_score"], cost_score=rule["cost_score"], scalability_score=rule["scalability_score"], learning_curve_score=rule["learning_curve_score"]))
        for rule in load_json("compatibility_rules.json"):
            db.add(CompatibilityRule(source_technology_id=tech_by_name[rule["source"]].id, target_technology_id=tech_by_name[rule["target"]].id, status=rule["status"], score=rule["score"], reason=rule["reason"]))
        for rule in load_json("feature_rules.json"):
            db.add(FeatureRule(trigger=rule["trigger"], recommendations=rule["recommendations"]))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()