import { createMemoryHistory } from 'history';
import { debug } from 'jest-preview';
import { fireEvent, render, waitFor } from 'test';
import { parse } from 'query-string';
import { screen, within } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import { Dialogue, SystemPermission } from 'types/generated-types';
import {
  mockAssignUserToDialogue,
  mockCustomerOfUser,
  mockDeleteDialogue,
  mockGetUsers,
  mockQueryDialogueConnection,
  mockSetDialoguePrivacy,
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

    await new Promise((r) => setTimeout(r, 3000));

    const addTeamButton = await screen.findAllByText((text) => text.toLowerCase().includes('public'));
    fireEvent.contextMenu(addTeamButton[0]);
    fireEvent.click(await screen.findByText('Edit'));
    expect(history.location.pathname).toMatch(/\/edit/i);
  });

  test('Can assign user to dialogue', async () => {
    mockCustomerOfUser((res) => ({ ...res }));
    mockQueryDialogueConnection((res) => ({ ...res }));
    mockGetUsers((res) => ({ ...res }));
    mockAssignUserToDialogue((res) => ({ ...res }));

    renderComponent();

    const addTeamButton = await screen.findAllByText((text) => text.toLowerCase().includes('public'));
    fireEvent.contextMenu(addTeamButton[0]);
    mockQueryDialogueConnection((res) => {
      const adjustedDialogue = {
        ...res.customer?.dialogueConnection?.dialogues?.[0] as Dialogue,
        title: 'Goon boys',
        assignees: [
          {
            id: 'cl6lz9jha0067gxoi5kk40mbd',
            firstName: 'Manager',
            lastName: 'Boy',
            __typename: 'UserType'
          }
        ]
      };

      res.customer?.dialogueConnection?.dialogues?.splice(0, 1, adjustedDialogue as any);
      return ({
        ...res,
        customer: {
          ...res.customer,
          dialogueConnection: {
            ...res.customer?.dialogueConnection,
            dialogues: res.customer?.dialogueConnection?.dialogues,
          }
        }
      });
    });

    fireEvent.click(await screen.findByText((text) => text.toLowerCase().includes('assign to')));
    fireEvent.click(await screen.findByText((text) => text.toLowerCase().includes('manager')));

    await new Promise((r) => setTimeout(r, 2000));

    const assigneeAvatar = screen.getByTestId('assignee-avatar');
    expect(assigneeAvatar).toBeInTheDocument();
  });

  test('Can make dialogue only accessible for assignees', async () => {
    mockCustomerOfUser((res) => ({ ...res }));
    mockQueryDialogueConnection((res) => ({ ...res }));
    mockGetUsers((res) => ({ ...res }));
    mockAssignUserToDialogue((res) => ({ ...res }));
    mockSetDialoguePrivacy((res) => ({ ...res }));

    renderComponent();

    mockQueryDialogueConnection((res) => {
      const adjustedDialogue = {
        ...res.customer?.dialogueConnection?.dialogues?.[0] as Dialogue,
        title: 'Priviet',
        isPrivate: true,
        assignees: [
          {
            id: 'cl6lz9jha0067gxoi5kk40mbd',
            firstName: 'Manager',
            lastName: 'Boy',
            __typename: 'UserType'
          }
        ]
      };

      res.customer?.dialogueConnection?.dialogues?.splice(0, 1, adjustedDialogue as any);
      return ({
        ...res,
        customer: {
          ...res.customer,
          dialogueConnection: {
            ...res.customer?.dialogueConnection,
            dialogues: res.customer?.dialogueConnection?.dialogues,
          }
        }
      });
    });

    const addTeamButton = await screen.findAllByText((text) => text.toLowerCase().includes('public'));
    fireEvent.contextMenu(addTeamButton[0]);

    fireEvent.click(await screen.findByText((text) => text.toLowerCase().includes('only assignees')));

    await new Promise((r) => setTimeout(r, 2000));

    const privateBadge = screen.getByText((text) => text.toLowerCase().includes('private'));
    expect(privateBadge).toBeInTheDocument();
  });

  test('Can make dialogue only accessible for assignees', async () => {
    mockCustomerOfUser((res) => ({ ...res }));
    mockQueryDialogueConnection((res) => {
      const adjustedDialogue = {
        ...res.customer?.dialogueConnection?.dialogues?.[0] as Dialogue,
        title: 'Available',
        isPrivate: true,
        assignees: [
          {
            id: 'cl6lz9jha0067gxoi5kk40mbd',
            firstName: 'Manager',
            lastName: 'Boy',
            __typename: 'UserType'
          }
        ]
      };

      res.customer?.dialogueConnection?.dialogues?.splice(0, 1, adjustedDialogue as any);
      return ({
        ...res,
        customer: {
          ...res.customer,
          dialogueConnection: {
            ...res.customer?.dialogueConnection,
            dialogues: res.customer?.dialogueConnection?.dialogues,
          }
        }
      });
    });

    mockGetUsers((res) => ({ ...res }));
    mockAssignUserToDialogue((res) => ({ ...res }));
    mockSetDialoguePrivacy((res) => ({ ...res }));
    mockDeleteDialogue((res) => ({ ...res }));

    renderComponent();

    mockQueryDialogueConnection((res) => ({
      ...res,
      customer: {
        ...res.customer,
        dialogueConnection: {
          ...res.customer?.dialogueConnection,
          dialogues: res.customer?.dialogueConnection?.dialogues?.filter((dialogue) => dialogue?.title !== 'Available'),
        }
      }
    }) as any);

    const publicBadges = await screen.findAllByText((text) => text.toLowerCase().includes('public'));
    await new Promise((r) => setTimeout(r, 2000));

    fireEvent.contextMenu(publicBadges[0]);
    fireEvent.click(await screen.findByText((text) => text.toLowerCase().includes('delete')));

    await new Promise((r) => setTimeout(r, 2000));

    expect(screen.queryByText(/Available/i)).not.toBeInTheDocument();
  });
});
