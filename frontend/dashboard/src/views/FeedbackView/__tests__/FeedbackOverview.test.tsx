import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { fireEvent, waitFor } from 'test';
import { isPresent } from 'ts-is-present';
import { parse } from 'query-string';
import { render, within } from '@testing-library/react';
import React from 'react';
import cuid from 'cuid';
import userEvent from '@testing-library/user-event';

import CustomerProvider from 'providers/CustomerProvider';
import ThemeProvider from 'providers/ThemeProvider';
import UserProvider from 'providers/UserProvider';
import WorkspaceLayout from 'layouts/WorkspaceLayout/WorkspaceLayout';
import client from 'config/server/apollo';
import lang from 'config/i18n-config';

import { DialogueProvider } from 'providers/DialogueProvider';
import { FeedbackOverview } from '../FeedbackOverview';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import {
  mockGetInteractionResponse,
  mockGetWorkspaceLayoutDetailsResponse,
  mockGetWorkspaceSessionsResponse,
} from './helpers';

const customRenderComponent = (history: any) => {
  const screen = render(
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <ApolloProvider client={client}>
          <UserProvider>
            <CustomerProvider workspaceOverrideSlug="workspace_1" __test__>
              <I18nextProvider i18n={lang}>
                <ThemeProvider>
                  <WorkspaceLayout>
                    <FeedbackOverview />
                  </WorkspaceLayout>
                </ThemeProvider>
              </I18nextProvider>
            </CustomerProvider>
          </UserProvider>
        </ApolloProvider>
      </QueryParamProvider>
    </Router>,
  );

  return screen;
};

const customRenderComponentWithDialogueProvider = (history: any) => {
  const screen = render(
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <ApolloProvider client={client}>
          <UserProvider>
            <CustomerProvider workspaceOverrideSlug="workspace_1" __test__>
              <DialogueProvider dialogueOverride={{
                id: 'OVERRIDE_DIALOGUE_ID',
                slug: 'override_dialogue_slug',
                title: 'Override Test Dialogue',
                description: 'Desc',
              }}
              >
                <I18nextProvider i18n={lang}>
                  <ThemeProvider>
                    <WorkspaceLayout>
                      <FeedbackOverview />
                    </WorkspaceLayout>
                  </ThemeProvider>
                </I18nextProvider>
              </DialogueProvider>
            </CustomerProvider>
          </UserProvider>
        </ApolloProvider>
      </QueryParamProvider>
    </Router>,
  );

  return screen;
};

describe('FeedbackOverview', () => {
  test('FeedbackOverview: Can filter by urgent issues', async () => {
    mockGetInteractionResponse((res) => ({
      ...res,
      session: {
        id: 'cl6eq1mx62809865oi1y0xau0m',
        createdAt: 1659598412874,
        score: 13,
        originUrl: 'http://localhost:3000',
        totalTimeInSec: 8,
        device: 'MacIntel',
        dialogueId: 'cl6c5x1gn19352ceoigbgcu6ed',
        nodeEntries: [
          {
            id: 'cl6eq1mx62809965oidqriq25z',
            depth: 0,
            relatedNode: {
              title: 'How are you feeling?',
              type: 'SLIDER',
              __typename: 'QuestionNode',
            },
            value: {
              sliderNodeEntry: 13,
              textboxNodeEntry: null,
              registrationNodeEntry: null,
              choiceNodeEntry: null,
              videoNodeEntry: null,
              linkNodeEntry: null,
              formNodeEntry: null,
              __typename: 'NodeEntryValue',
            },
            __typename: 'NodeEntry',
          },
          {
            id: 'cl6eq1mx62810065oi47mvs776',
            depth: 1,
            relatedNode: {
              title: 'What went wrong?',
              type: 'CHOICE',
              __typename: 'QuestionNode',
            },
            value: {
              sliderNodeEntry: null,
              textboxNodeEntry: null,
              registrationNodeEntry: null,
              choiceNodeEntry: 'Physical & Mental',
              videoNodeEntry: null,
              linkNodeEntry: null,
              formNodeEntry: null,
              __typename: 'NodeEntryValue',
            },
            __typename: 'NodeEntry',
          },
          {
            id: 'cl6eq1mx72810165oiv77r8ltu',
            depth: 2,
            relatedNode: {
              title: 'Would you like to discuss this with someone?',
              type: 'CHOICE',
              __typename: 'QuestionNode',
            },
            value: {
              sliderNodeEntry: null,
              textboxNodeEntry: null,
              registrationNodeEntry: null,
              choiceNodeEntry: 'Yes',
              videoNodeEntry: null,
              linkNodeEntry: null,
              formNodeEntry: null,
              __typename: 'NodeEntryValue',
            },
            __typename: 'NodeEntry',
          },
          {
            id: 'cl6eq1qgj2814865oiyrsorcq3',
            depth: 0,
            relatedNode: {
              title: 'Your feedback will always remain anonymous, unless you want to talk to someone.',
              type: 'FORM',
              __typename: 'QuestionNode',
            },
            value: {
              sliderNodeEntry: null,
              textboxNodeEntry: null,
              registrationNodeEntry: null,
              choiceNodeEntry: null,
              videoNodeEntry: null,
              linkNodeEntry: null,
              formNodeEntry: {
                id: 2,
                values: [
                  {
                    relatedField: {
                      id: 'cl6c5x1h219395ceoibm0paa53',
                      type: 'email',
                      __typename: 'FormNodeField',
                    },
                    email: 'daan@haas.live',
                    phoneNumber: null,
                    url: null,
                    shortText: null,
                    longText: null,
                    number: null,
                    __typename: 'FormNodeEntryValueType',
                  },
                ],
                __typename: 'FormNodeEntryType',
              },
              __typename: 'NodeEntryValue',
            },
            __typename: 'NodeEntry',
          },
        ],
        delivery: null,
        dialogue: {
          id: 'cl6c5x1gn19352ceoigbgcu6ed',
          title: 'Female - U18 - Team3',
          slug: 'Female-U18-Team3',
          __typename: 'Dialogue',
        },
        followUpAction: {
          values: [
            {
              shortText: null,
              email: 'daan@haas.live',
              __typename: 'FormNodeEntryValueType',
            },
          ],
          __typename: 'FormNodeEntryType',
        },
        __typename: 'Session',
      },
    }) as any);

    mockGetWorkspaceSessionsResponse((res) => ({
      customer: {
        id: res.customer?.id,
        sessionConnection: {
          pageInfo: {
            hasNextPage: false,
            hasPrevPage: false,
            pageIndex: 0,
          },
          totalPages: 1,
          sessions: [
            {
              id: cuid(),
              score: 13,
              createdAt: new Date(),
              totalTimeInSec: 42,
              actionRequestId: 'actionId',
              dialogue: {
                id: cuid(),
                slug: 'urgent-dialogue-slug',
                title: 'Female - U13 - Team1',
              },
              dialogueId: cuid(),
              nodeEntries: [
                {
                  id: 'cl6c5x1rb20138ceoimzdw3py4',
                  depth: 0,
                  relatedNode: {
                    title: 'How are you feeling?',
                    type: QuestionNodeTypeEnum.Slider,
                    __typename: 'QuestionNode',
                  },
                  value: {
                    sliderNodeEntry: 79,
                    textboxNodeEntry: null,
                    registrationNodeEntry: null,
                    choiceNodeEntry: null,
                    videoNodeEntry: null,
                    linkNodeEntry: null,
                    formNodeEntry: null,
                    __typename: 'NodeEntryValue',
                  },
                  __typename: 'NodeEntry',
                },
                {
                  id: 'cl6c5x1rb20139ceoi344rjwrj',
                  depth: 1,
                  relatedNode: {
                    title: "What's going well?",
                    type: QuestionNodeTypeEnum.Choice,
                    __typename: 'QuestionNode',
                  },
                  value: {
                    sliderNodeEntry: null,
                    textboxNodeEntry: null,
                    registrationNodeEntry: null,
                    choiceNodeEntry: 'Physical & Mental',
                    videoNodeEntry: null,
                    linkNodeEntry: null,
                    formNodeEntry: null,
                    __typename: 'NodeEntryValue',
                  },
                  __typename: 'NodeEntry',
                },
              ],
              followUpAction: {
                values: [
                  {
                    shortText: null,
                    email: 'any@haas.live',
                    __typename: 'FormNodeEntryValueType',
                  },
                ],
                __typename: 'FormNodeEntryType',
              },
            },
          ],
        },
      },
    }));

    const history = createMemoryHistory({ initialEntries: [{ search: '?minScore=0&maxScore=100' }] });

    const screen = customRenderComponent(history);

    await waitFor(() => {
      expect(screen.queryByText(/Action requested/i)).toBeVisible();
    });

    const row = await screen.findByText(/Action requested/i);
    userEvent.click(row);

    await waitFor(async () => {
      expect(await screen.findByText('Dialogue entries')).not.toBeNull();
    });

    expect(await screen.findByText((text) => text.toLowerCase().includes('requires'))).toBeVisible();

    userEvent.click(document.body);

    await new Promise((r) => setTimeout(r, 1000));

    // Clicking 'show only urgent issues' should set filter for withFollowUpAction to true/1
    fireEvent.contextMenu(row);
    userEvent.click(screen.getByText('Session'));
    userEvent.click(screen.getByText('Show only urgent feedback'));

    await waitFor(async () => {
      const queryParams = parse(history.location.search);
      console.log(history.location.search);
      expect(queryParams?.withFollowUpAction).toEqual('1');
    });

    // Clicking close button for urgent only should reset filter
    const showUrgentButtonText = screen.getByText((text) => text.toLowerCase().includes('show: urgent only'));
    // FilterButton for team should be shown
    expect(showUrgentButtonText).toBeVisible();
    expect(showUrgentButtonText).not.toBeNull();
    expect(showUrgentButtonText).toBeDefined();
    mockGetWorkspaceSessionsResponse((res) => ({ ...res }));

    const closeButton = within(showUrgentButtonText.parentElement!).getByRole('button');
    expect(closeButton).toBeVisible();

    fireEvent.click(closeButton);

    await waitFor(async () => {
      const queryParams = parse(history.location.search);
      console.log(history.location.search);
      expect(queryParams?.withFollowUpAction).toEqual('0');
    });

    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.queryByText(/Action requested/i)).toBeNull();

    // Non-urgent row should not have ability to show only by urgent feedback
    const schoolRow = await screen.findByText('School');
    fireEvent.contextMenu(schoolRow);
    userEvent.click(screen.getByText('Session'));

    expect(screen.getByText('Show only urgent feedback')).toHaveAttribute('aria-disabled', 'true');
  });

  test('FeedbackOverview: Can filter using search bar', async () => {
    mockGetWorkspaceSessionsResponse((res) => ({ ...res }));
    mockGetWorkspaceLayoutDetailsResponse((res) => ({ ...res }));
    mockGetInteractionResponse((res) => ({ ...res }));

    const history = createMemoryHistory({ initialEntries: [{ search: '?minScore=0&maxScore=100' }] });

    const screen = customRenderComponent(history);

    const row = await screen.findByText('School');

    userEvent.click(row);

    await waitFor(async () => {
      expect(await screen.findByText('Interaction')).not.toBeNull();
      expect(await screen.findByText('Dialogue entries')).not.toBeNull();
    });

    userEvent.click(document.body);

    const searchBar = screen.getByPlaceholderText('Search');

    mockGetWorkspaceSessionsResponse((res) => {
      const newSessions = res.customer?.sessionConnection?.sessions.filter(
        (session) => (!!session.nodeEntries?.find((nodeEntry) => nodeEntry.value?.choiceNodeEntry === 'School')),
      ).filter(isPresent) as any;
      return {
        ...res,
        customer: {
          ...res.customer,
          id: res.customer?.id,
          sessionConnection: {
            ...res.customer?.sessionConnection,
            pageInfo: {
              hasNextPage: false,
              hasPrevPage: false,
              pageIndex: 0,
            },
            totalPages: 1,
            sessions: newSessions,
          },
        },
      };
    });

    userEvent.type(searchBar, 'School');

    await waitFor(async () => {
      expect(parse(history.location.search)).toMatchObject({ search: 'School' });
    });
  });

  test('FeedbackOverview: Can filter using topic in context menu', async () => {
    mockGetWorkspaceSessionsResponse((res) => ({ ...res }));
    mockGetWorkspaceLayoutDetailsResponse((res) => ({ ...res }));
    mockGetInteractionResponse((res) => ({ ...res }));

    const history = createMemoryHistory({ initialEntries: [{ search: '?minScore=0&maxScore=100' }] });

    const screen = customRenderComponent(history);

    mockGetWorkspaceSessionsResponse((res) => {
      const newSessions = res.customer?.sessionConnection?.sessions.filter(
        (session) => (!!session.nodeEntries?.find((nodeEntry) => nodeEntry.value?.choiceNodeEntry === 'School')),
      ).filter(isPresent) as any;
      return {
        ...res,
        customer: {
          ...res.customer,
          id: res.customer?.id,
          sessionConnection: {
            ...res.customer?.sessionConnection,
            pageInfo: {
              hasNextPage: false,
              hasPrevPage: false,
              pageIndex: 0,
            },
            totalPages: 1,
            sessions: newSessions,
          },
        },
      };
    });

    const row = await screen.findByText('School');
    fireEvent.contextMenu(row);
    userEvent.click(screen.getByText('Session'));
    userEvent.click(screen.getByText((text) => text.toLowerCase().includes('show feedback with answer')));

    await waitFor(async () => {
      expect(parse(history.location.search)).toMatchObject({ search: 'School' });
    });
  });

  test('FeedbackOverview: Can filter by team', async () => {
    mockGetWorkspaceSessionsResponse((res) => ({ ...res }));
    mockGetWorkspaceLayoutDetailsResponse((res) => ({ ...res }));
    mockGetInteractionResponse((res) => ({ ...res }));

    const history = createMemoryHistory({ initialEntries: [{ search: '?minScore=0&maxScore=100' }] });

    const screen = customRenderComponent(history);

    await waitFor(() => {
      expect(screen.queryByText(/Add filter/i)).toBeVisible();
    });

    const row = await screen.findByText('School');

    fireEvent.contextMenu(row);
    userEvent.click(screen.getByText('Team'));
    // await new Promise((r) => setTimeout(r, 2000));
    userEvent.click(screen.getByText('Show all from this team'));

    await waitFor(async () => {
      const queryParams = parse(history.location.search);
      expect(queryParams?.dialogueIds).not.toBeUndefined();
    });

    // FilterButton for team should be shown
    const teamButtonText = await screen.findByText((text) => text.toLowerCase().includes('team:'));
    expect(teamButtonText).toBeVisible();

    // TODO: Set back to dialogueIds=undefined by clicking the close button
    const closeButton = within(teamButtonText.parentElement!).getByRole('button');
    expect(closeButton).toBeVisible();
    fireEvent.click(closeButton);

    await waitFor(async () => {
      const queryParams = parse(history.location.search);
      expect(queryParams?.dialogueIds).toBeUndefined();
    });
  });

  test('FeedbackOverview: Can filter by score', async () => {
    mockGetWorkspaceSessionsResponse((res) => ({ ...res }));
    mockGetWorkspaceLayoutDetailsResponse((res) => ({ ...res }));
    mockGetInteractionResponse((res) => ({ ...res }));

    const history = createMemoryHistory({ initialEntries: [{ search: '?minScore=0&maxScore=99' }] });

    const screen = customRenderComponent(history);

    await new Promise((r) => setTimeout(r, 2000));

    // Clicking close button for score should reset filter
    const showDateButtonText = screen.getByText((text) => text.toLowerCase().includes('score: '));

    // FilterButton for score should be shown
    expect(showDateButtonText).toBeVisible();

    const closeButton = within(showDateButtonText.parentElement!).getByRole('button');
    expect(closeButton).toBeVisible();

    fireEvent.click(closeButton);

    await waitFor(async () => {
      const queryParams = parse(history.location.search);
      expect(queryParams?.maxScore).toEqual('100');
    });
  });

  test('FeedbackOverview: Dialogue scope', async () => {
    mockGetWorkspaceSessionsResponse((res) => ({ ...res }));
    mockGetWorkspaceLayoutDetailsResponse((res) => ({ ...res }));
    mockGetInteractionResponse((res) => ({ ...res }));

    const history = createMemoryHistory({ initialEntries: [{ search: '?dialogueIds=OVERRIDE_DIALOGUE_ID' }] });

    const screen = customRenderComponentWithDialogueProvider(history);

    await new Promise((r) => setTimeout(r, 2000));

    await waitFor(async () => {
      const queryParams = parse(history.location.search);
      expect(queryParams?.dialogueIds).toEqual('OVERRIDE_DIALOGUE_ID');
    });

    // FilterButton for team should be shown
    const teamButtonText = await screen.findByText((text) => text.toLowerCase().includes('team:'));
    expect(teamButtonText).toBeVisible();

    // TODO: Set back to dialogueIds=undefined by clicking the close button
    const closeButton = within(teamButtonText.parentElement!).getByRole('button');
    expect(closeButton).toBeVisible();
    expect(closeButton).toBeDisabled();
  });
});

