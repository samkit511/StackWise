from pydantic import BaseModel, ConfigDict, Field


class ApiResponse(BaseModel):
    success: bool = True
    message: str
    data: object | None = None


class QuestionnaireInput(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    description: str = Field(min_length=10)
    status: str
    project_type: str
    budget: int = Field(ge=1000)
    expected_users: int = Field(ge=1)
    timeline: str
    team_size: int = Field(ge=1)
    team_frontend: str
    team_backend: str
    features: list[str] = Field(default_factory=list)
    need_ai: bool = False
    need_realtime: bool = False
    need_seo: bool = False
    requires_reporting: bool = True
    compliance: bool = False
    admin_heavy: bool = False
    backend_control: bool = True
    data_complexity: str = "relational"
    deployment: str = "docker"
    current_stack: list[str] = Field(default_factory=list)
    pain_points: list[str] = Field(default_factory=list)


class ProjectRead(BaseModel):
    id: int
    name: str
    description: str
    status: str
    budget: int
    expected_users: int
    timeline: str
    team_size: int

    model_config = ConfigDict(from_attributes=True)


class TechnologyRead(BaseModel):
    id: int
    name: str
    category: str
    language: str
    supports_ai: bool
    supports_realtime: bool
    learning_curve: str
    community: str
    performance: str
    cost: str
    official_url: str
    pros: list[str]
    cons: list[str]
    use_cases: list[str]


class RecommendationRequest(BaseModel):
    questionnaire: QuestionnaireInput


class SavedRecommendationRequest(BaseModel):
    project_id: int
