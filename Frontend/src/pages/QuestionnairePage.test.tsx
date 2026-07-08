import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { QuestionnairePage } from './QuestionnairePage';

function renderPage() {
  return render(<QueryClientProvider client={new QueryClient()}><MemoryRouter><QuestionnairePage /></MemoryRouter></QueryClientProvider>);
}

describe('QuestionnairePage', () => {
  it('moves through steps and saves progress locally', async () => {
    renderPage();
    expect(screen.getByText(/Step 1 of 4/)).toBeInTheDocument();
    await userEvent.click(screen.getByText('Next'));
    expect(screen.getByText(/Step 2 of 4/)).toBeInTheDocument();
    await userEvent.click(screen.getByText('Save'));
    expect(localStorage.getItem('stackwise-questionnaire')).toContain('FounderOps');
  });
});
