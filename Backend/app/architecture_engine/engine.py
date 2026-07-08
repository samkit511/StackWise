class ArchitectureEngine:
    def recommend(self, payload: dict, stack: list[dict]) -> dict:
        users = int(payload["expected_users"])
        status = payload["status"].lower()
        if users > 100000 and payload.get("need_realtime"):
            pattern = "Event-Driven Modular Monolith"
            reason = "The product needs high scale and realtime behavior, but the MVP should avoid operationally heavy microservices."
        elif status == "existing":
            pattern = "Clean Architecture"
            reason = "The existing system benefits from clear boundaries while allowing incremental migration."
        else:
            pattern = "Modular Monolith"
            reason = "A modular monolith is fast to build, easy to deploy, and keeps clean boundaries for future scaling."
        names = {item["role"]: item["name"] for item in stack}
        mermaid = f'''flowchart LR
    User[User Browser] --> UI[{names.get("Frontend", "React")} Frontend]
    UI --> API[{names.get("Backend", "FastAPI")} REST API]
    API --> DB[( {names.get("Database", "PostgreSQL")} )]
    API --> Rules[Recommendation Rules]
    API --> Reports[HTML Reports]
    API --> Cost[Cost Engine]
    API --> Arch[Architecture Engine]'''
        return {"pattern": pattern, "reason": reason, "mermaid": mermaid}

    def analyze_existing_project(self, payload: dict, stack: list[dict]) -> dict:
        if payload["status"].lower() != "existing":
            return {
                "keep": [item["name"] for item in stack if item["role"] in {"Frontend", "Backend", "Database"}],
                "replace": [],
                "remove": [],
                "add": [item["name"] for item in stack if item["role"] not in {"Frontend", "Backend", "Database"}],
                "migration_difficulty": "Low",
                "migration_cost": "Low",
                "migration_time": "1-3 weeks",
                "migration_risk": "Low",
                "summary": "New projects can adopt the recommended architecture directly.",
            }
        current = set(payload.get("current_stack", []))
        recommended = {item["name"] for item in stack}
        return {
            "keep": sorted(current & recommended),
            "replace": sorted(current - recommended),
            "remove": sorted([point for point in payload.get("pain_points", []) if point.lower() in {"slow", "expensive", "unmaintainable"}]),
            "add": sorted(recommended - current),
            "migration_difficulty": "Medium" if current else "Low",
            "migration_cost": "Medium" if current else "Low",
            "migration_time": "4-8 weeks" if current else "2-4 weeks",
            "migration_risk": "Medium" if len(current - recommended) > 1 else "Low",
            "summary": "Migrate incrementally by keeping compatible parts and replacing the highest-friction components first.",
        }
