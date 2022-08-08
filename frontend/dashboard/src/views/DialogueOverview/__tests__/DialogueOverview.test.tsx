import { createMemoryHistory } from 'history';
import { fireEvent, render, waitFor } from 'test';
import { parse } from 'query-string';
import { screen, within } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import {
  mockQueryDialogueConnection,
} from './helpers';
import DialogueOverview from '../DialogueOverview';

const renderComponent = () => {
  render(<DialogueOverview />);
};

describe('DialogueOverview', () => {
  test('Can navigate to edit dialogue page', async () => {
    mockQueryDialogueConnection((res) => ({ ...res }));
    renderComponent();
  });
});
