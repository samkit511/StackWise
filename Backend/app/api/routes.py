from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.knowledge_base.seed import seed
from app.recommendation_engine.engine import RecommendationEngine
from app.repositories.store import StackWiseRepository
from app.schemas.dto import ApiResponse, ProjectRead, QuestionnaireInput, RecommendationRequest, SavedRecommendationRequest, TechnologyRead

router = APIRouter(prefix="/api")


def repo(db: Session) -> StackWiseRepository:
    seed()
    return StackWiseRepository(db)


@router.get("/health")
def health() -> ApiResponse:
    return ApiResponse(message="StackWise backend is running", data={"status": "ok"})


@router.post("/questionnaire")
def submit_questionnaire(payload: QuestionnaireInput, db: Session = Depends(get_db)) -> ApiResponse:
    repository = repo(db)
    project = repository.create_project(payload)
    result = RecommendationEngine().recommend(payload.model_dump(), repository.technologies(), repository.rules(), repository.compatibility_rules(), repository.feature_rules())
    repository.save_outputs(project.id, result)
    return ApiResponse(message="Questionnaire saved and recommendation generated", data={"project": ProjectRead.model_validate(project).model_dump(), "recommendation": result})


@router.get("/projects")
def projects(db: Session = Depends(get_db)) -> ApiResponse:
    repository = repo(db)
    return ApiResponse(message="Projects loaded", data=[ProjectRead.model_validate(project).model_dump() for project in repository.list_projects()])


@router.get("/projects/{project_id}")
def project(project_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    repository = repo(db)
    found = repository.get_project(project_id)
    if not found:
        raise HTTPException(status_code=404, detail="Project not found")
    return ApiResponse(message="Project loaded", data=ProjectRead.model_validate(found).model_dump())


@router.post("/recommendations")
def recommend(payload: RecommendationRequest, db: Session = Depends(get_db)) -> ApiResponse:
    repository = repo(db)
    result = RecommendationEngine().recommend(payload.questionnaire.model_dump(), repository.technologies(), repository.rules(), repository.compatibility_rules(), repository.feature_rules())
    return ApiResponse(message="Recommendation generated", data=result)


@router.post("/recommendations/saved")
def recommend_saved(payload: SavedRecommendationRequest, db: Session = Depends(get_db)) -> ApiResponse:
    repository = repo(db)
    saved = repository.get_project_payload(payload.project_id)
    if not saved:
        raise HTTPException(status_code=404, detail="Saved questionnaire not found")
    result = RecommendationEngine().recommend(saved, repository.technologies(), repository.rules(), repository.compatibility_rules(), repository.feature_rules())
    repository.save_outputs(payload.project_id, result)
    return ApiResponse(message="Saved recommendation regenerated", data=result)


@router.get("/recommendations/{project_id}")
def recommendation_for_project(project_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    repository = repo(db)
    saved = repository.get_project_payload(project_id)
    if not saved:
        raise HTTPException(status_code=404, detail="Saved questionnaire not found")
    result = RecommendationEngine().recommend(saved, repository.technologies(), repository.rules(), repository.compatibility_rules(), repository.feature_rules())
    return ApiResponse(message="Recommendation loaded", data=result)


@router.get("/compatibility/{project_id}")
def compatibility(project_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    recommendation = recommendation_for_project(project_id, db).data
    return ApiResponse(message="Compatibility matrix loaded", data=recommendation["compatibility_matrix"])


@router.get("/features/{project_id}")
def features(project_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    recommendation = recommendation_for_project(project_id, db).data
    return ApiResponse(message="Feature recommendations loaded", data=recommendation["feature_recommendations"])


@router.get("/costs/{project_id}")
def costs(project_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    recommendation = recommendation_for_project(project_id, db).data
    return ApiResponse(message="Cost estimate loaded", data=recommendation["cost_estimate"])


@router.get("/architecture/{project_id}")
def architecture(project_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    recommendation = recommendation_for_project(project_id, db).data
    return ApiResponse(message="Architecture recommendation loaded", data=recommendation["architecture"])


@router.get("/reports/{project_id}")
def report(project_id: int, db: Session = Depends(get_db)) -> Response:
    recommendation = recommendation_for_project(project_id, db).data
    return Response(content=recommendation["report_html"], media_type="text/html")


@router.get("/technologies")
def technologies(search: str = "", category: str = "", db: Session = Depends(get_db)) -> ApiResponse:
    repository = repo(db)
    rows = []
    for tech in repository.technologies():
        if search and search.lower() not in tech.name.lower():
            continue
        if category and category.lower() != tech.category.name.lower():
            continue
        rows.append(TechnologyRead(
            id=tech.id,
            name=tech.name,
            category=tech.category.name,
            language=tech.language,
            supports_ai=tech.supports_ai,
            supports_realtime=tech.supports_realtime,
            learning_curve=tech.learning_curve,
            community=tech.community,
            performance=tech.performance,
            cost=tech.cost,
            official_url=tech.official_url,
            pros=tech.pros,
            cons=tech.cons,
            use_cases=tech.use_cases,
        ))
    return ApiResponse(message="Technologies loaded", data=rows)
