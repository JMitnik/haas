import { graphql } from 'msw';
import { render, screen } from 'test';
import React from 'react';

import { MockProviders } from 'mocks/MockProviders';
import UsersOverview from '../UsersOverview';

it('renders', async () => {
  render(<UsersOverview />);

  console.log('test');
});
