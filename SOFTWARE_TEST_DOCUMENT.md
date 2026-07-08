# StackWise Software Test Document

| Test Case ID | Feature | Objective | Preconditions | Test Steps | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SW-TC-001 | Questionnaire | Validate multi-step form accepts business input | Frontend running | Open questionnaire, edit fields, move through steps | Steps advance and data is saved locally |  |  |
| SW-TC-002 | Recommendation Engine | Generate ranked stack | Backend seeded | Submit valid questionnaire | Recommended and alternative stacks return with confidence |  |  |
| SW-TC-003 | Compatibility Engine | Build compatibility matrix | Recommendation generated | Request project recommendation | Matrix contains pair scores and reasons |  |  |
| SW-TC-004 | Feature Recommendation | Infer missing features | Select authentication and payments | Submit questionnaire | Password reset, invoices, refunds and related features appear |  |  |
| SW-TC-005 | Existing Project Analysis | Produce migration report | Status set to Existing | Submit current stack and pain points | Keep, replace, remove, add and risk fields return |  |  |
| SW-TC-006 | Cost Estimator | Estimate costs | Recommendation generated | View dashboard cost card | Monthly, annual and development totals render |  |  |
| SW-TC-007 | Dashboard | Display recommendation output | API available | Open recommendation page | Scores, stack, matrix, features and charts render |  |  |
| SW-TC-008 | Architecture Generator | Generate Mermaid diagram | Recommendation generated | View dashboard diagram | Mermaid flowchart renders |  |  |
| SW-TC-009 | Export Functionality | Export printable report | Project exists | Open report export | HTML report opens with stack and costs |  |  |
| SW-TC-010 | API Endpoints | Verify public API groups | Backend running | Call health, projects, recommendation, costs, reports, technologies | Endpoints return valid responses |  |  |
