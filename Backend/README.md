# StackWise Backend

FastAPI backend for the StackWise development stack recommendation system.

## Commands

```bash
pip install -e ".[test]"
alembic upgrade head
python -m app.knowledge_base.seed
uvicorn app.main:app --reload
pytest
```
