# StackWise Installation Guide

This guide explains how to run StackWise from a fresh local environment using the public GitHub repository.

## Prerequisites

Install the following tools before starting:

- Git
- Docker Desktop
- Docker Compose, included with Docker Desktop
- A modern browser such as Chrome, Edge, or Firefox

Node.js and Python are not required for the Docker setup because the frontend and backend run inside containers.

## Clone the Repository

```bash
git clone https://github.com/samkit511/StackWise.git
cd StackWise
```

## Start the Complete Application

Run this command from the project root:

```bash
docker compose up --build
```

Docker Compose starts three services:

- `frontend`: React application served on port `8080`
- `backend`: FastAPI application served on port `8000`
- `postgres`: PostgreSQL database mapped to host port `5433`

The PostgreSQL container uses port `5432` internally. The host mapping is `5433:5432` to avoid conflicts with local PostgreSQL installations.

## Open the Application

After the containers start successfully, open these URLs:

- Frontend: http://localhost:8080
- Backend API health check: http://localhost:8000/api/health
- Backend OpenAPI documentation: http://localhost:8000/docs

## Verify the Installation

1. Open http://localhost:8080.
2. Click `Start Recommendation`.
3. Complete the questionnaire or use the default sample values.
4. Submit the questionnaire.
5. Confirm the recommendation dashboard displays scores, recommended stack, compatibility matrix, feature recommendations, cost breakdown, architecture diagram, and report export.

## Stop the Application

Press `Ctrl+C` in the terminal running Docker Compose, or run:

```bash
docker compose down
```

To remove the database volume as well, run:

```bash
docker compose down -v
```

## Local Development Commands

### Backend

```bash
cd Backend
pip install -e ".[test]"
alembic upgrade head
python -m app.knowledge_base.seed
uvicorn app.main:app --reload
pytest
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
npm test
npm run build
```

## Troubleshooting

### Docker Desktop is not running

Start Docker Desktop and rerun:

```bash
docker compose up --build
```

### Port 8080 or 8000 is already in use

Stop the process using that port, then restart Docker Compose.

### PostgreSQL port 5432 is already in use

This project maps PostgreSQL to host port `5433`, so a local PostgreSQL service on `5432` should not block StackWise.

### Frontend loads but API calls fail

Confirm the backend is running:

```bash
curl http://localhost:8000/api/health
```

If the backend is not healthy, inspect logs:

```bash
docker compose logs backend
```

## Submission Notes

The repository contains all source code, documentation, seed data, Dockerfiles, Docker Compose configuration, tests, and instructions required to build and run the project.