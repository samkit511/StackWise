FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY Backend/pyproject.toml ./
RUN pip install --no-cache-dir ".[test]"
COPY Backend/ .
COPY Database/ ./Database/
CMD ["sh", "-c", "alembic upgrade head && python -m app.knowledge_base.seed && uvicorn app.main:app --host 0.0.0.0 --port 8000"]