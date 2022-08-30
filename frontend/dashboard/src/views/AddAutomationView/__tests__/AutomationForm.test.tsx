import { debug } from 'jest-preview';
import { render, screen, userEvent } from 'test';
import React from 'react';

import { act } from 'react-dom/test-utils';

import { AutomationForm } from '../AutomationForm';
import { mockGetUsersAndRoles } from './helpers';

const renderComponent = () => {
  act(() => {
    render(<AutomationForm />);
  });
};

test('render form and validate state of create button', async () => {
  mockGetUsersAndRoles((res) => ({ ...res }));
  renderComponent();

  // Verify initially create button is disabled
  expect(await screen.findByText('Create')).toBeDisabled();

  // Fill in value in title field
  const automationTitleInput = await screen.findByLabelText((content) => content.includes('Title'));
  userEvent.type(automationTitleInput, 'New Automation');
  expect(automationTitleInput).toHaveValue('New Automation');

  expect(screen.queryByText('Create')).toBeDisabled();

  // Click all automation action types and check
  // whether custom schedule is only available for customizable report and send dialogue link
  const customizableChoice = await screen.findByText(/Customizable report/i);
  userEvent.click(customizableChoice);

  expect(screen.queryByText(/Schedule frequency/i)).not.toBeNull();

  const weeklyChoice = await screen.findByText('Weekly report');
  userEvent.click(weeklyChoice);

  expect(screen.queryByText(/Schedule frequency/i)).toBeNull();
  expect(screen.queryByText('Create')).toBeDisabled();

  const monthlyChoice = await screen.findByText('Monthly report');
  userEvent.click(monthlyChoice);

  expect(screen.queryByText(/Schedule frequency/i)).toBeNull();
  expect(screen.queryByText('Create')).toBeDisabled();

  const yearlyChoice = await screen.findByText('Yearly report');
  userEvent.click(yearlyChoice);

  expect(screen.queryByText(/Schedule frequency/i)).toBeNull();
  expect(screen.queryByText('Create')).toBeDisabled();

  const sendDialogueLinkChoice = await screen.findByText('Send dialogue link');
  userEvent.click(sendDialogueLinkChoice);

  mockGetUsersAndRoles((res) => ({ ...res }));

  expect(screen.queryByText(/Schedule frequency/i)).not.toBeNull();
  expect(screen.queryByText('Create')).toBeDisabled();

  userEvent.click(customizableChoice);

  // Add recipient
  const addTargetButton = await screen.findByText('Add target');
  userEvent.click(addTargetButton);

  await new Promise((r) => setTimeout(r, 2000));

  debug();

  const userPickerEntry = await screen.findByText((text) => text.toLowerCase().includes('admin user'.toLowerCase()));
  userEvent.click(userPickerEntry);

  // Verify that the create button is enabled now
  expect(await screen.findByText('Create')).toBeEnabled();
});

