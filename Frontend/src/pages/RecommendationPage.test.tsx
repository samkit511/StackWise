import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RecommendationPage } from './RecommendationPage';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(async () => ({ svg: '<svg role="img"><text>Architecture</text></svg>' }))
  }
}));
vi.mock('../services/api', () => ({
  getRecommendation: async () => ({
    summary: 'Recommended stack summary',
    confidence: 92,
    scores: { overall_architecture: 90, scalability: 91, security: 89, cost: 88, maintainability: 93 },
    recommended_stack: [{ name: 'React', role: 'Frontend', category: 'Frontend', score: 92, confidence: 92, official_url: '', explanation: 'Good fit', business_justification: '', technical_justification: '', scalability: 'High', estimated_cost: 'Low', learning_resources: [] }],
    alternative_stack: [],
    compatibility_matrix: [{ source: 'React', target: 'FastAPI', status: 'compatible', score: 94, reason: 'Works well' }],
    feature_recommendations: [{ feature: 'Password Reset', priority: 'High', business_impact: 'Support', reason: 'Needed for auth' }],
    existing_project_analysis: { keep: [], replace: [], add: ['React'], remove: [], summary: 'New project' },
    cost_estimate: { monthly_total: 100, annual_total: 1200, development_total: 9000, breakdown: { hosting: 60, database: 40 } },
    architecture: { pattern: 'Modular Monolith', reason: 'Good MVP fit', mermaid: 'flowchart LR\nA-->B' },
    development_timeline: [],
    report_html: '<html></html>'
  }),
  reportUrl: () => 'http://localhost/report'
}));

describe('RecommendationPage', () => {
  it('renders dashboard data', async () => {
    render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={['/recommendations/1']}><Routes><Route path="/recommendations/:projectId" element={<RecommendationPage />} /></Routes></MemoryRouter></QueryClientProvider>);
    expect(await screen.findByText('Recommendation Dashboard')).toBeInTheDocument();
    expect(await screen.findByText(/Recommended stack summary/)).toBeInTheDocument();
  });
});
