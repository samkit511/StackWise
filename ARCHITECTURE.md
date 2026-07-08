# StackWise Architecture

StackWise is a modular recommendation system with a React TypeScript frontend, FastAPI backend, PostgreSQL database, and Docker Compose runtime.

## Backend

Route handlers validate input and delegate business behavior to dedicated engines. Recommendation logic is data-driven through technology, recommendation, compatibility, and feature rules stored as seed JSON and persisted to PostgreSQL.

## Engines

- Recommendation Engine scores technologies, removes incompatible choices, ranks the stack, and explains recommendations.
- Compatibility Engine builds the matrix and filters incompatible technologies.
- Feature Engine infers supporting product features.
- Cost Engine estimates development, monthly, and annual costs.
- Architecture Engine recommends the architecture pattern and generates Mermaid diagrams.
- Report Service exports printable HTML.

## Database

The schema separates projects, questionnaire responses, technology knowledge, rule data, recommendations, cost estimates, and reports. JSON columns are used for flexible rule conditions and report payloads while core entities remain relational.
