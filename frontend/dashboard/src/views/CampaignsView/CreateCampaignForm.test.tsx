import '@testing-library/jest-dom/extend-expect';
import 'mutationobserver-shim';
import { render } from '@testing-library/react';
import React from 'react';

import ThemeProvider from 'providers/ThemeProvider';
import theme from 'config/theme';

import CreateCampaignForm from './CreateCampaignForm';

// global.MutationObserver = window.MutationObserver;

const Wrapper = ({ children }: { children?: React.ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

describe('Creates campaign', () => {
  test('it renders the form', () => {
    const { debug } = render(
      <CreateCampaignForm />,
      { wrapper: Wrapper },
    );

    debug();
  });
});
