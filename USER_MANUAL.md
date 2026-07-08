# StackWise User Manual

StackWise is a Development Stack Recommendation System. It helps a founder or product team choose a suitable software architecture, technology stack, features, infrastructure, cloud option, DevOps tools, security components, cost estimate, and migration direction based on project requirements.

## Opening the Application

1. Start the application with Docker Compose by following `INSTALLATION_GUIDE.md`.
2. Open the frontend in a browser:

```text
http://localhost:8080
```

## Home Dashboard

The home screen introduces StackWise and provides a `Start Recommendation` button. Use this button to begin the recommendation workflow.

## Multi-step Questionnaire

The questionnaire collects the project details used by the recommendation engine.

### Step 1: Business Information

Enter or review:

- Project name
- Project description
- Project status, either new or existing
- Project type
- Budget

### Step 2: Team and Scale

Enter or review:

- Expected users
- Delivery timeline
- Team size
- Frontend team skill
- Backend team skill
- Data complexity

### Step 3: Business Requirements

Select the features and requirements that apply to the project, such as:

- Authentication
- Payments
- Analytics
- Realtime behavior
- AI-related requirements
- SEO requirements
- Reporting requirements
- Compliance needs
- Admin-heavy workflows
- Backend ownership preference

### Step 4: Existing Project Details

For existing projects, enter:

- Current stack
- Pain points
- Deployment preference

For new projects, the default values are enough to generate a recommendation.

## Saving Progress

The questionnaire saves progress locally in the browser. If the page is refreshed, the current questionnaire data can be restored from local browser storage.

## Generating Recommendations

Click `Generate Recommendation` on the final questionnaire step. StackWise sends the form data to the backend API and generates a recommendation dashboard.

## Recommendation Dashboard

The dashboard includes:

- Overall recommendation confidence
- Architecture score
- Scalability score
- Security score
- Cost score
- Maintainability score
- Recommended technology stack
- Alternative technologies
- Compatibility matrix
- Feature recommendations
- Existing project migration report
- Cost breakdown chart
- Architecture diagram
- Report export link

## Recommended Stack

Each recommended technology includes:

- Role in the stack
- Confidence percentage
- Explanation
- Business justification
- Technical justification
- Cost and scalability context
- Official documentation link where available

## Compatibility Matrix

The compatibility matrix shows how recommended technologies work together. It identifies compatible relationships, warnings, and incompatible combinations based on the StackWise compatibility rules.

## Feature Recommendations

The feature engine suggests supporting features that users may not initially select. For example:

- If payments are selected, StackWise recommends invoices, refunds, tax calculation, and transaction history.
- If authentication is selected, StackWise recommends password reset, email verification, two-factor authentication, session management, and RBAC.

## Existing Project Migration Report

For existing projects, StackWise analyzes current stack information and returns:

- Keep
- Replace
- Remove
- Add
- Migration difficulty
- Migration cost
- Migration time
- Migration risk

## Cost Estimator

The cost section estimates:

- Monthly infrastructure cost
- Annual infrastructure cost
- Development cost
- Hosting
- Monitoring
- Authentication
- Storage
- CDN
- Cache
- Queue
- Email
- SMS
- Maintenance

## Architecture Diagram

StackWise generates a Mermaid architecture diagram based on the recommended stack. The diagram shows the relationship between frontend, backend, database, rules, cost engine, report engine, and architecture engine.

## Report Export

Click `Export Report` from the recommendation dashboard to open a printable HTML report. The report includes the recommendation summary, architecture pattern, diagram source, recommended stack, feature recommendations, and cost breakdown.

## Projects Page

The projects page lists saved project recommendations. Select a project to reopen its recommendation dashboard.

## Technology Knowledge Base

The technologies page allows users to search and filter the structured technology knowledge base. Each technology includes category, language, performance, cost, and official documentation information.

## Expected User Flow

1. Open StackWise.
2. Start the questionnaire.
3. Enter business, team, scale, feature, and project status information.
4. Generate a recommendation.
5. Review the recommended stack and alternatives.
6. Check the compatibility matrix and feature recommendations.
7. Review cost and timeline estimates.
8. Export the report for sharing or printing.

## Notes for Reviewers

StackWise is a rule-based recommendation system. It does not generate random results and does not use AI inference. Recommendations are produced from structured technology data, recommendation rules, compatibility rules, feature rules, and questionnaire responses.