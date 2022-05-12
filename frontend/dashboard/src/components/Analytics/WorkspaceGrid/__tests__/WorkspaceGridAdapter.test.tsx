import React from 'react';

import { render, screen } from 'test';

import { WorkspaceGridAdapter } from '../WorkspaceGridAdapter';
import { mockGetWorkspaceDialogueStatistics, mockQueryDialogueConnection } from './helpers';

const renderComponent = () => {
  render(<WorkspaceGridAdapter backgroundColor="red" height={100} width={100} />);
};

test('render layers', async () => {
  mockGetWorkspaceDialogueStatistics((res) => ({ ...res }));
  mockQueryDialogueConnection((res) => ({ ...res }));
  renderComponent();

  expect(await screen.findByText('Layers')).toBeInTheDocument();
});
