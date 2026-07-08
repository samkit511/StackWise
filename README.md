# StackWise

StackWise is a Development Stack Recommendation System that helps founders choose the right software architecture before writing the first line of code.

## Problem Statement

Early product teams often choose technologies without connecting business requirements, scale, cost, team skills, and migration risk. StackWise turns questionnaire inputs into explainable recommendations for architecture, technology stack, features, infrastructure, cloud provider, DevOps tools, security components, cost, and migration strategy.

## Features

- Multi-step questionnaire with local progress saving.
- Rule-based recommendation engine with weighted scoring.
- Structured technology knowledge base (32+ technologies).
- Compatibility matrix with color-coded status indicators.
- Feature recommendation engine with business impact analysis.
- Existing project analysis and structured migration report.
- Architecture pattern recommendation with justification.
- Dynamic Mermaid architecture diagram generation.
- Development and infrastructure cost estimator.
- Searchable and filterable technology knowledge base with pros/cons.
- Printable HTML report export.
- Light and dark mode.
- Dockerized frontend, backend, and PostgreSQL database.

## Submission Documents

- [Installation Guide](INSTALLATION_GUIDE.md)
- [User Manual](USER_MANUAL.md)
- [Architecture Documentation](ARCHITECTURE.md)
- [Software Test Document](SOFTWARE_TEST_DOCUMENT.md)

## Architecture

- `Frontend`: React, TypeScript, Vite, TailwindCSS, React Router, React Hook Form, Zod, TanStack Query, Axios, Recharts, Mermaid.js.
- `Backend`: Python, FastAPI, SQLAlchemy, Alembic, Pydantic.
- `Database`: PostgreSQL plus seed JSON for knowledge and rules.

## Folder Structure

```text
Backend/app/api
Backend/app/models
Backend/app/recommendation_engine
Backend/app/compatibility_engine
Backend/app/feature_engine
Backend/app/cost_engine
Backend/app/architecture_engine
Frontend/src/pages
Frontend/src/components
Frontend/src/services
Database/seeds
```

## Database Schema

The database includes users, projects, questionnaire responses, technology categories, technologies, technology knowledge base, recommendation rules, compatibility rules, feature rules, recommendations, recommendation items, cost estimates, and architecture reports.

## Recommendation Engine Design

Recommendation rules are stored separately from technology data. The engine evaluates questionnaire responses, loads all rules, scores technologies, removes incompatible technologies, ranks the best stack, recommends alternatives, generates explanations, and computes confidence scores.

## Compatibility Engine Design

Compatibility rules identify compatible, warning, and incompatible technology pairs. The matrix is displayed in the dashboard and incompatible stack choices are removed before final recommendations.

## Installation

```bash
# Clone or navigate to the project root, then:
cd StackWise
docker compose up --build
```

Frontend: http://localhost:8080

Backend API: http://localhost:8000/api/health

OpenAPI documentation: http://localhost:8000/docs

## Local Backend

```bash
cd Backend
pip install -e ".[test]"
alembic upgrade head
python -m app.knowledge_base.seed
uvicorn app.main:app --reload
pytest
```

## Local Frontend

```bash
cd Frontend
npm install
npm run dev
npm test
npm run build
```

## API Documentation

- `GET /api/health`
- `POST /api/questionnaire`
- `GET /api/projects`
- `GET /api/projects/{project_id}`
- `POST /api/recommendations`
- `GET /api/recommendations/{project_id}`
- `GET /api/compatibility/{project_id}`
- `GET /api/features/{project_id}`
- `GET /api/costs/{project_id}`
- `GET /api/architecture/{project_id}`
- `GET /api/reports/{project_id}`
- `GET /api/technologies`

## Testing

```bash
# Backend
cd Backend
pytest -v

# Frontend
cd Frontend
npm test
```

## Future Improvements

- Additional report formats (PDF export).
- More technology categories and entries.
- Advanced comparison filters between technologies.
- Optional GitHub import for existing project analysis.
