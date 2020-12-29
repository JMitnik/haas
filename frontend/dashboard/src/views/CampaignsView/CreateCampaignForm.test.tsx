import '@testing-library/jest-dom/extend-expect';
import 'mutationobserver-shim';
import { render } from '@testing-library/react';
import React from 'react';

import ThemeProvider from 'providers/ThemeProvider';

import { I18nextProvider } from 'react-i18next';
import lang from 'config/i18n-config';

import CreateCampaignForm from './CreateCampaignForm';

const Wrapper = ({ children }: { children?: React.ReactNode }) => <I18nextProvider i18n={lang}><ThemeProvider>{children}</ThemeProvider></I18nextProvider>;

describe('Creates campaign', () => {
  test('it renders the form', () => {
    render(
      <CreateCampaignForm />,
      { wrapper: Wrapper },
    );
  });
});
