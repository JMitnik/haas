import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import { cleanup, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { fireEvent, waitFor } from 'test';
import { isPresent } from 'ts-is-present';
import { parse } from 'query-string';
import React from 'react';
import preview from 'jest-preview';
import userEvent from '@testing-library/user-event';

import CustomerProvider from 'providers/CustomerProvider';
import ThemeProvider from 'providers/ThemeProvider';
import UserProvider from 'providers/UserProvider';
import WorkspaceLayout from 'layouts/WorkspaceLayout/WorkspaceLayout';
import client from 'config/server/apollo';
import lang from 'config/i18n-config';

import { FeedbackOverview } from '../FeedbackOverview';
import {
  mockGetInteractionResponse,
  mockGetWorkspaceLayoutDetailsResponse,
  mockGetWorkspaceSessionsResponse,
} from './helpers';

const renderComponent = () => {
  render(<FeedbackOverview />);
};

test('render layers', async () => {
  mockGetWorkspaceSessionsResponse((res) => ({ ...res }));
  mockGetWorkspaceLayoutDetailsResponse((res) => ({ ...res }));
  mockGetInteractionResponse((res) => ({ ...res }));

  // renderComponent();

  const history = createMemoryHistory({ initialEntries: [{ search: '?minScore=0&maxScore=100' }] });

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

  await waitFor(() => {
    expect(screen.queryByText(/Add filter/i)).toBeVisible();
  });

  const row = await screen.findByText('School');

  act(() => {
    userEvent.click(row);
  });

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
          pageInfo: 223,
          totalPages: res.customer?.sessionConnection?.totalPages,
          sessions: newSessions,
        },
      },
    };
  });

  userEvent.type(searchBar, 'School');

  // await new Promise((r) => setTimeout(r, 5000));

  await waitFor(async () => {
    expect(parse(history.location.search)).toMatchObject({ search: 'School' });
  });

  console.log(history.location.search);

  preview.debug();

  // expect(await screen.findByText('Schoolss')).toBeInTheDocument();

  // act(() => {
  //   userEvent.type(searchBar, 'School');
  // });

  // await new Promise((r) => setTimeout(r, 2000));

  // fireEvent.contextMenu(row);
  // userEvent.click(screen.getByText('Team'));
  // await new Promise((r) => setTimeout(r, 2000));

  // act(() => {
  //   userEvent.click(screen.getByText('Show all from this team'));
  // });

  // await new Promise((r) => setTimeout(r, 2000));
  // preview.debug();

  // const button = screen.getByText('Add filter');
  // userEvent.click(button);

  // await new Promise((r) => setTimeout(r, 2000));
  // preview.debug();

  // const dateLabel = screen.getByText('Date');
  // expect(dateLabel).not.toBeNull();
  // await new Promise((r) => setTimeout(r, 2000));
});
