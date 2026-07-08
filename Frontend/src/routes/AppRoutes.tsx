import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../pages/HomePage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { QuestionnairePage } from '../pages/QuestionnairePage';
import { RecommendationPage } from '../pages/RecommendationPage';
import { ReportPage } from '../pages/ReportPage';
import { TechnologiesPage } from '../pages/TechnologiesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'questionnaire', element: <QuestionnairePage /> },
      { path: 'recommendations/:projectId', element: <RecommendationPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'reports/:projectId', element: <ReportPage /> },
      { path: 'technologies', element: <TechnologiesPage /> }
    ]
  }
]);
