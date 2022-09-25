import { render } from 'test';
import React from 'react';

import { WorkspaceGridAdapter } from '../WorkspaceGridAdapter';
import { mockGetWorkspaceDialogueStatistics, mockQueryDialogueConnection } from './helpers';

const renderComponent = () => {
  render(<WorkspaceGridAdapter backgroundColor="red" />);
};

test('render layers', async () => {
  mockGetWorkspaceDialogueStatistics((res) => ({ ...res }));
  mockQueryDialogueConnection((res) => ({ ...res }));
  renderComponent();
});
