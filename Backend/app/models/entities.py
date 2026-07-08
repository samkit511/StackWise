from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str | None] = mapped_column(String(255), unique=True)
    created_at: Mapped[object] = mapped_column(DateTime, server_default=func.now())


class TechnologyCategory(Base):
    __tablename__ = "technology_categories"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    technologies: Mapped[list["Technology"]] = relationship(back_populates="category")


class Technology(Base):
    __tablename__ = "technologies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("technology_categories.id"))
    language: Mapped[str] = mapped_column(String(80))
    supports_ai: Mapped[bool] = mapped_column(Boolean, default=False)
    supports_realtime: Mapped[bool] = mapped_column(Boolean, default=False)
    learning_curve: Mapped[str] = mapped_column(String(40))
    community: Mapped[str] = mapped_column(String(40))
    performance: Mapped[str] = mapped_column(String(40))
    cost: Mapped[str] = mapped_column(String(40))
    official_url: Mapped[str] = mapped_column(String(500))
    pros: Mapped[list[str]] = mapped_column(JSON)
    cons: Mapped[list[str]] = mapped_column(JSON)
    use_cases: Mapped[list[str]] = mapped_column(JSON)
    category: Mapped[TechnologyCategory] = relationship(back_populates="technologies")


class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(40))
    budget: Mapped[int] = mapped_column(Integer)
    expected_users: Mapped[int] = mapped_column(Integer)
    timeline: Mapped[str] = mapped_column(String(40))
    team_size: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[object] = mapped_column(DateTime, server_default=func.now())


class QuestionnaireResponse(Base):
    __tablename__ = "questionnaire_responses"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    responses: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[object] = mapped_column(DateTime, server_default=func.now())


class TechnologyKnowledgeBase(Base):
    __tablename__ = "technology_knowledge_base"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    technology_id: Mapped[int] = mapped_column(ForeignKey("technologies.id"))
    details: Mapped[dict] = mapped_column(JSON)


class RecommendationRule(Base):
    __tablename__ = "recommendation_rules"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    technology_id: Mapped[int] = mapped_column(ForeignKey("technologies.id"))
    conditions: Mapped[dict] = mapped_column(JSON)
    positive_weight: Mapped[int] = mapped_column(Integer)
    negative_weight: Mapped[int] = mapped_column(Integer)
    compatibility_score: Mapped[int] = mapped_column(Integer)
    cost_score: Mapped[int] = mapped_column(Integer)
    scalability_score: Mapped[int] = mapped_column(Integer)
    learning_curve_score: Mapped[int] = mapped_column(Integer)
    technology: Mapped[Technology] = relationship()


class CompatibilityRule(Base):
    __tablename__ = "compatibility_rules"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source_technology_id: Mapped[int] = mapped_column(ForeignKey("technologies.id"))
    target_technology_id: Mapped[int] = mapped_column(ForeignKey("technologies.id"))
    status: Mapped[str] = mapped_column(String(40))
    score: Mapped[int] = mapped_column(Integer)
    reason: Mapped[str] = mapped_column(Text)
    source: Mapped[Technology] = relationship(foreign_keys=[source_technology_id])
    target: Mapped[Technology] = relationship(foreign_keys=[target_technology_id])


class FeatureRule(Base):
    __tablename__ = "feature_rules"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    trigger: Mapped[str] = mapped_column(String(80))
    recommendations: Mapped[list[dict]] = mapped_column(JSON)


class Recommendation(Base):
    __tablename__ = "recommendations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    architecture_pattern: Mapped[str] = mapped_column(String(120))
    confidence: Mapped[int] = mapped_column(Integer)
    score_breakdown: Mapped[dict] = mapped_column(JSON)
    explanation: Mapped[str] = mapped_column(Text)
    created_at: Mapped[object] = mapped_column(DateTime, server_default=func.now())


class RecommendationItem(Base):
    __tablename__ = "recommendation_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    recommendation_id: Mapped[int] = mapped_column(ForeignKey("recommendations.id"))
    technology_id: Mapped[int] = mapped_column(ForeignKey("technologies.id"))
    role: Mapped[str] = mapped_column(String(40))
    confidence: Mapped[int] = mapped_column(Integer)
    score: Mapped[int] = mapped_column(Integer)
    explanation: Mapped[str] = mapped_column(Text)


class CostEstimate(Base):
    __tablename__ = "cost_estimates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    monthly_total: Mapped[int] = mapped_column(Integer)
    annual_total: Mapped[int] = mapped_column(Integer)
    development_total: Mapped[int] = mapped_column(Integer)
    breakdown: Mapped[dict] = mapped_column(JSON)


class ArchitectureReport(Base):
    __tablename__ = "architecture_reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    pattern: Mapped[str] = mapped_column(String(120))
    mermaid: Mapped[str] = mapped_column(Text)
    migration_report: Mapped[dict] = mapped_column(JSON)
    html_report: Mapped[str] = mapped_column(Text)
