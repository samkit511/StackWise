def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "ok"


def test_questionnaire_generates_complete_recommendation(client, questionnaire_payload):
    response = client.post("/api/questionnaire", json=questionnaire_payload)
    assert response.status_code == 200
    data = response.json()["data"]
    recommendation = data["recommendation"]
    assert data["project"]["id"] > 0
    assert recommendation["recommended_stack"]
    assert recommendation["compatibility_matrix"]
    assert recommendation["feature_recommendations"]
    assert recommendation["cost_estimate"]["monthly_total"] > 0
    assert "flowchart" in recommendation["architecture"]["mermaid"]
    assert "<html" in recommendation["report_html"]


def test_saved_project_endpoints(client, questionnaire_payload):
    created = client.post("/api/questionnaire", json=questionnaire_payload).json()["data"]
    project_id = created["project"]["id"]
    assert client.get(f"/api/recommendations/{project_id}").status_code == 200
    assert client.get(f"/api/compatibility/{project_id}").json()["data"]
    assert client.get(f"/api/features/{project_id}").json()["data"]
    assert client.get(f"/api/costs/{project_id}").json()["data"]["annual_total"] > 0
    assert client.get(f"/api/architecture/{project_id}").json()["data"]["pattern"]
    assert client.get(f"/api/reports/{project_id}").headers["content-type"].startswith("text/html")


def test_technology_search(client):
    response = client.get("/api/technologies?search=FastAPI")
    assert response.status_code == 200
    assert response.json()["data"][0]["name"] == "FastAPI"
