export type QuestionnaireInput = {
  name: string;
  description: string;
  status: string;
  project_type: string;
  budget: number;
  expected_users: number;
  timeline: string;
  team_size: number;
  team_frontend: string;
  team_backend: string;
  features: string[];
  need_ai: boolean;
  need_realtime: boolean;
  need_seo: boolean;
  requires_reporting: boolean;
  compliance: boolean;
  admin_heavy: boolean;
  backend_control: boolean;
  data_complexity: string;
  deployment: string;
  current_stack: string[];
  pain_points: string[];
};

export type StackItem = {
  name: string;
  role: string;
  category: string;
  score: number;
  confidence: number;
  official_url: string;
  explanation: string;
  business_justification: string;
  technical_justification: string;
  scalability: string;
  estimated_cost: string;
  learning_resources: string[];
};

export type Recommendation = {
  summary: string;
  confidence: number;
  scores: Record<string, number>;
  recommended_stack: StackItem[];
  alternative_stack: StackItem[];
  compatibility_matrix: Array<{source: string; target: string; status: string; score: number; reason: string}>;
  feature_recommendations: Array<{feature: string; priority: string; business_impact: string; reason: string}>;
  existing_project_analysis: Record<string, string | string[]>;
  cost_estimate: {monthly_total: number; annual_total: number; development_total: number; breakdown: Record<string, number>};
  architecture: {pattern: string; reason: string; mermaid: string};
  development_timeline: Array<{phase: string; weeks: number; outcome: string}>;
  report_html: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
  budget: number;
  expected_users: number;
  timeline: string;
  team_size: number;
};
