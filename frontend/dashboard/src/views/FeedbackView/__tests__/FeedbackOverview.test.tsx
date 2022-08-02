import { render, screen } from 'test';
import React from 'react';
import preview from 'jest-preview';

import { FeedbackOverview } from '../FeedbackOverview';
import { mockGetCustomersOfUser, mockGetWorkspaceSessionsResponse } from './helpers';

const renderComponent = () => {
  render(<FeedbackOverview />);
};

test('render layers', async () => {
  mockGetCustomersOfUser((res) => ({ ...res }));
  mockGetWorkspaceSessionsResponse((res) => ({ ...res }));
  renderComponent();
  expect(await screen.findByText(/Interactions/i)).toBeVisible();
  preview.debug();
});
