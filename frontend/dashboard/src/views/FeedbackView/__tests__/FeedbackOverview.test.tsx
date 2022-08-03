import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
import { cleanup } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { fireEvent, render, screen, waitFor } from 'test';
import { isPresent } from 'ts-is-present';
import { parse } from 'query-string';
import React from 'react';
import preview from 'jest-preview';
import userEvent from '@testing-library/user-event';

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

  console.log(window.location);

  // renderComponent();

  const history = createMemoryHistory({ initialEntries: [{ search: '?minScore=0&maxScore=100&search=Hoi' }] });

  render(
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <FeedbackOverview />
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
          sessions: [],
        },
      },
    };
  });

  userEvent.type(searchBar, 'School');

  console.log(history.location.search);
  expect(parse(history.location.search)).toEqual({ search: 'School' });

  // preview.debug();
  await new Promise((r) => setTimeout(r, 5000));
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
