import '@testing-library/jest-dom/extend-expect';
import 'mutationobserver-shim';
import { RenderResult, act, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import user from '@testing-library/user-event';

import ThemeProvider from 'providers/ThemeProvider';

import { I18nextProvider } from 'react-i18next';
import lang from 'config/i18n-config';

import CreateCampaignForm from '../CreateCampaignForm';

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <I18nextProvider i18n={lang}>
    <ThemeProvider>{children}</ThemeProvider>
  </I18nextProvider>
);

test('it ensures toggleAble variants', async () => {
  const { getByText, getByLabelText } = await waitFor(async () => render(<CreateCampaignForm />, { wrapper: Wrapper }));

  const submitButton = getByText(/save/i);
  expect(submitButton).toBeDisabled();

  const campaignLabelInput = getByLabelText(/campaign label/i) as HTMLInputElement;

  await act(async () => {
    user.type(campaignLabelInput, 'My first campaign');
  });

  expect(campaignLabelInput).toHaveValue('My first campaign');

  expect(submitButton).not.toBeDisabled();
});
