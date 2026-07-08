from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entities import (
    ArchitectureReport,
    CompatibilityRule,
    CostEstimate,
    FeatureRule,
    Project,
    QuestionnaireResponse,
    Recommendation,
    RecommendationItem,
    RecommendationRule,
    Technology,
    TechnologyCategory,
)
from app.schemas.dto import QuestionnaireInput


class StackWiseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_project(self, payload: QuestionnaireInput) -> Project:
        project = Project(
            name=payload.name,
            description=payload.description,
            status=payload.status,
            budget=payload.budget,
            expected_users=payload.expected_users,
            timeline=payload.timeline,
            team_size=payload.team_size,
        )
        self.db.add(project)
        self.db.flush()
        self.db.add(QuestionnaireResponse(project_id=project.id, responses=payload.model_dump()))
        self.db.commit()
        self.db.refresh(project)
        return project

    def get_project(self, project_id: int) -> Project | None:
        return self.db.get(Project, project_id)

    def list_projects(self) -> list[Project]:
        return list(self.db.scalars(select(Project).order_by(Project.created_at.desc())))

    def get_project_payload(self, project_id: int) -> dict | None:
        stmt = select(QuestionnaireResponse).where(QuestionnaireResponse.project_id == project_id).order_by(QuestionnaireResponse.created_at.desc())
        response = self.db.scalars(stmt).first()
        return response.responses if response else None

    def technologies(self) -> list[Technology]:
        return list(self.db.scalars(select(Technology).order_by(Technology.name)))

    def rules(self) -> list[RecommendationRule]:
        return list(self.db.scalars(select(RecommendationRule)))

    def compatibility_rules(self) -> list[CompatibilityRule]:
        return list(self.db.scalars(select(CompatibilityRule)))

    def feature_rules(self) -> list[FeatureRule]:
        return list(self.db.scalars(select(FeatureRule)))

    def latest_report(self, project_id: int) -> ArchitectureReport | None:
        stmt = select(ArchitectureReport).where(ArchitectureReport.project_id == project_id).order_by(ArchitectureReport.id.desc())
        return self.db.scalars(stmt).first()

    def save_outputs(self, project_id: int, result: dict) -> None:
        recommendation = Recommendation(
            project_id=project_id,
            architecture_pattern=result["architecture"]["pattern"],
            confidence=result["confidence"],
            score_breakdown=result["scores"],
            explanation=result["summary"],
        )
        self.db.add(recommendation)
        self.db.flush()
        tech_by_name = {tech.name: tech for tech in self.technologies()}
        for item in result["recommended_stack"] + result["alternative_stack"]:
            tech = tech_by_name[item["name"]]
            self.db.add(RecommendationItem(
                recommendation_id=recommendation.id,
                technology_id=tech.id,
                role=item["role"],
                confidence=item["confidence"],
                score=item["score"],
                explanation=item["explanation"],
            ))
        cost = result["cost_estimate"]
        self.db.add(CostEstimate(
            project_id=project_id,
            monthly_total=cost["monthly_total"],
            annual_total=cost["annual_total"],
            development_total=cost["development_total"],
            breakdown=cost["breakdown"],
        ))
        self.db.add(ArchitectureReport(
            project_id=project_id,
            pattern=result["architecture"]["pattern"],
            mermaid=result["architecture"]["mermaid"],
            migration_report=result["existing_project_analysis"],
            html_report=result["report_html"],
        ))
        self.db.commit()
