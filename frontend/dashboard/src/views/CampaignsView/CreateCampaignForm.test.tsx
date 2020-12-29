import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import CreateCampaignForm from './CreateCampaignForm';
import React from 'react';
import theme from 'config/theme';

const Wrapper = ({ children }: { children: React.ReactNode }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

describe('Creates campaign', () => {
  test('it renders the form', () => {
    render(
      <CreateCampaignForm />,
      { wrapper: Wrapper },
    );
  });
});
