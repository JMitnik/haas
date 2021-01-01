import '@testing-library/jest-dom/extend-expect';
import 'mutationobserver-shim';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import user from '@testing-library/user-event';

import ThemeProvider from 'providers/ThemeProvider';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import lang from 'config/i18n-config';

import CreateCampaignForm from '../CreateCampaignForm';

// TODO: Write a good mock
const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <MemoryRouter>
    <MockedProvider
      addTypename={false}
      mocks={[{
        request: {
          query: getDialoguesOfCustomer,
          variables: {
            customerSlug: 'test',
          },
        },
        result: {
          data: {
            customer: {
              id: 'test123',
              dialogues: [{
                customerId: 'test123',
                title: 'Test dialogue',
                slug: 'test',
                publicTitle: 'test',
                creationDate: null,
                updatedAt: null,
                averageScore: 5,
                id: 'test456',
                tags: [],
                customer: null,
              }],
            },
          },
        },
      }]}
    >
      <I18nextProvider i18n={lang}>
        <ThemeProvider>{children}</ThemeProvider>
      </I18nextProvider>
    </MockedProvider>
  </MemoryRouter>
);

// TODO: Put this in a prep
// @ts-ignore
document.createRange = function () {
  return {
    setEnd() {},
    setStart() {},
    getBoundingClientRect() {
      return { right: 0 };
    },
    getClientRects() {
      return {
        item: () => null,
        length: 0,
        [Symbol.iterator]: jest.fn(),
      };
    },
  };
};

// TODO: Make this DRY'er
test('it ensures toggleAble variants', async () => {
  const { getByText, getByLabelText, debug, container } = await waitFor(async () => render(<CreateCampaignForm />, { wrapper: Wrapper }));

  const submitButton = getByText(/save/i);
  expect(submitButton).toBeDisabled();

  const campaignLabelInput = getByLabelText(/campaign label/i) as HTMLInputElement;

  await act(async () => {
    user.type(campaignLabelInput, 'My first campaign');
  });

  expect(campaignLabelInput).toHaveValue('My first campaign');

  // We are still not done
  expect(submitButton).toBeDisabled();

  // Activate variant A
  const variantAButton = getByText(/variant a/i);
  const variantBButton = getByText(/variant b/i);
  user.click(variantAButton);

  const variantLabel = getByLabelText(/variant label/i);

  // Type in the input
  await act(async () => {
    user.type(variantLabel, 'Variant A Label');
  });

  expect(variantLabel).toHaveValue('Variant A Label');

  // CLick the select
  const variantDropdown = getByText(/select a dialogue/i).closest('.select') as Element;
  fireEvent.keyDown(variantDropdown, { key: 'ArrowDown' });

  const testEvent = getByText(/test dialogue/i);
  user.click(testEvent);

  const valueContainer = container.querySelector('.select__single-value');
  expect(valueContainer).toHaveTextContent(/test dialogue/i);

  expect(submitButton).toBeDisabled();

  user.click(variantBButton);
  const variantLabelB = getByLabelText(/variant label/i);

  // Type in the input
  await act(async () => {
    user.type(variantLabelB, 'Variant B Label');
  });

  expect(variantLabelB).toHaveValue('Variant B Label');

  // CLick the select
  const variantDropdownB = getByText(/select a dialogue/i).closest('.select') as Element;
  fireEvent.keyDown(variantDropdownB, { key: 'ArrowDown' });

  const testEventB = getByText(/test dialogue/i);
  user.click(testEventB);

  const valueContainerB = container.querySelector('.select__single-value');
  expect(valueContainerB).toHaveTextContent(/test dialogue/i);

  expect(submitButton).not.toBeDisabled();
});
