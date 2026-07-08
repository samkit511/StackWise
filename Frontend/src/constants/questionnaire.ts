import type { QuestionnaireInput } from '../types/api';

export const defaultQuestionnaire: QuestionnaireInput = {
  name: 'FounderOps',
  description: 'A SaaS dashboard for founders to manage workflows and analytics.',
  status: 'New',
  project_type: 'saas',
  budget: 45000,
  expected_users: 25000,
  timeline: 'normal',
  team_size: 4,
  team_frontend: 'react',
  team_backend: 'python',
  features: ['authentication', 'payments', 'analytics'],
  need_ai: true,
  need_realtime: true,
  need_seo: false,
  requires_reporting: true,
  compliance: false,
  admin_heavy: false,
  backend_control: true,
  data_complexity: 'relational',
  deployment: 'docker',
  current_stack: [],
  pain_points: []
};
