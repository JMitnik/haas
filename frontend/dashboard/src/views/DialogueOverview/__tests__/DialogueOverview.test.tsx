import { createMemoryHistory } from 'history';
import { debug } from 'jest-preview';
import { fireEvent, render, waitFor } from 'test';
import { parse } from 'query-string';
import { screen, within } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import { SystemPermission } from 'types/generated-types';
import {
  mockCustomerOfUser,
  mockGetUsers,
  mockMe,
  mockQueryDialogueConnection,
} from './helpers';
import DialogueOverview from '../DialogueOverview';

const renderComponent = () => render(<DialogueOverview />);

describe('DialogueOverview', () => {
  test('Add dialogue button not available when permission not available', async () => {
    mockCustomerOfUser((res) => {
      const permissions = res.UserOfCustomer?.role?.permissions?.filter(
        (permission) => permission !== SystemPermission.CanDeleteDialogue
      ) as SystemPermission[];
      return ({
        ...res,
        UserOfCustomer: {
          ...res.UserOfCustomer,
          role: {
            ...res.UserOfCustomer?.role,
            permissions
          }
        }
      });
    });
    mockQueryDialogueConnection((res) => ({ ...res }));
    mockGetUsers((res) => ({ ...res }));

    renderComponent();

    const addTeamButton = screen.queryByText((text) => text.toLowerCase().includes('add'));
    expect(addTeamButton).toBeNull();

    const shareTeamLinksButton = screen.queryByText((text) => text.toLowerCase().includes('share team'));
    expect(shareTeamLinksButton).toBeNull();
  });

  test('Can open share team link popup', async () => {
    mockCustomerOfUser((res) => ({ ...res }));
    mockQueryDialogueConnection((res) => ({ ...res }));
    mockGetUsers((res) => ({ ...res }));

    renderComponent();

    const shareTeamLinksButton = await screen.findByText((text) => text.toLowerCase().includes('share team'));
    fireEvent.click(shareTeamLinksButton);

    expect(screen.getByDisplayValue((text) => text.toLowerCase().includes('link-fetch'))).toBeInTheDocument();
    expect(screen.queryByDisplayValue(
      (text) => text.toLowerCase().includes('link-fetch?workspaceId=undefined')
    )).not.toBeInTheDocument();
  });

  test('Can filter dialogues based on search', async () => {
    mockCustomerOfUser((res) => ({ ...res }));
    mockQueryDialogueConnection((res) => ({ ...res }));
    mockGetUsers((res) => ({ ...res }));

    const { history } = renderComponent();

    const searchBar = screen.getByPlaceholderText('Search');
    userEvent.type(searchBar, 'female');

    await waitFor(async () => {
      expect(parse(history.location.search)).toMatchObject({ search: 'female' });
    });
  });

  test('Can navigate to add dialogue page', async () => {
    mockCustomerOfUser((res) => ({ ...res }));
    mockQueryDialogueConnection((res) => ({ ...res }));
    mockGetUsers((res) => ({ ...res }));

    const { history } = renderComponent();

    const addTeamButton = await screen.findByText((text) => text.toLowerCase().includes('add'));
    fireEvent.click(addTeamButton);
    expect(history.location.pathname).toMatch(/\/dialogue\/add/i);
  });

  test('Can navigate to edit dialogue page', async () => {
    mockCustomerOfUser((res) => ({ ...res }));
    mockQueryDialogueConnection((res) => ({ ...res }));
    mockGetUsers((res) => ({ ...res }));

    const { history } = renderComponent();

    const addTeamButton = await screen.findAllByText((text) => text.toLowerCase().includes('public'));
    fireEvent.contextMenu(addTeamButton[0]);
    fireEvent.click(await screen.findByText('Edit'));
    expect(history.location.pathname).toMatch(/\/edit/i);
  });
});
