import os

os.environ["DATABASE_URL"] = "sqlite:///./test_stackwise.db"

import pytest
from fastapi.testclient import TestClient

from app.database.base import Base
from app.database.session import engine
from app.knowledge_base.seed import seed
from app.main import app


@pytest.fixture()
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed()
    return TestClient(app)


@pytest.fixture()
def questionnaire_payload():
    return {
        "name": "FounderOps",
        "description": "A SaaS dashboard for founders to manage workflows and analytics.",
        "status": "New",
        "project_type": "saas",
        "budget": 45000,
        "expected_users": 25000,
        "timeline": "normal",
        "team_size": 4,
        "team_frontend": "react",
        "team_backend": "python",
        "features": ["authentication", "payments", "analytics"],
        "need_ai": True,
        "need_realtime": True,
        "need_seo": False,
        "requires_reporting": True,
        "compliance": False,
        "admin_heavy": False,
        "backend_control": True,
        "data_complexity": "relational",
        "deployment": "docker",
        "current_stack": [],
        "pain_points": [],
    }
