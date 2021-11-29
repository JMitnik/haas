import { graphql } from 'msw';
import { name } from 'faker';
import { range } from 'lodash';
import { expectWorkspaceLoaded, fireEvent, userEvent, render, screen, server, waitFor } from 'test';
import React from 'react';

import { DeleteUserMutation, DeleteUserMutationVariables, GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables, UserCustomer } from 'types/generated-types';
import UsersOverview from '../UsersOverview';
import { useLocation } from 'react-router-dom';

const generateUserCustomer: (index: number) => UserCustomer = (index: number) => ({
  __typename: 'UserCustomer',
  isActive: true,
  customer: {
    id: '',
    campaigns: [],
    name: '',
    slug: '',
  },
  createdAt: new Date().toISOString(),
  role: {
    id: '1',
    name: 'Admin',
    allPermissions: [],
    __typename: 'RoleType',
  },
  user: {
    id: `${index}`,
    firstName: name.firstName(),
    lastName: name.lastName(),
    email: `${name.firstName()}@example.com`,
    __typename: 'UserType',
    customers: [],
    lastLoggedIn: new Date().toISOString(),
    userCustomers: [],
  },
});

describe('UsersOverview (happy path)', () => {
  it('renders a single row', async () => {
    server.use(graphql.query<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(
      'getPaginatedUsers', (req, res, ctx) => res(ctx.data({
        __typename: 'Query',
        customer: {
          id: '1',
          __typename: 'Customer',
          usersConnection: {
            __typename: 'UserConnection',
            totalPages: 1,
            pageInfo: {
              hasNextPage: true,
              hasPrevPage: false,
              nextPageOffset: 5,
              pageIndex: 0,
              prevPageOffset: 0,
            },
            userCustomers: [
              {
                __typename: 'UserCustomer',
                createdAt: new Date().toISOString(),
                isActive: true,
                role: {
                  id: '1',
                  name: 'Manager',
                  __typename: 'RoleType',
                },
                user: {
                  id: 'A',
                  lastLoggedIn: new Date().toISOString(),
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'johndoe@gmail.com',
                  __typename: 'UserType',
                },
              },
              ...range(2).map((i) => generateUserCustomer(i)),
            ],
          },
        },
      })),
    ));

    render(<UsersOverview />);
    expect(await screen.findByText('johndoe@gmail.com')).toBeInTheDocument();

    // Ensure we see no pagination
    expect(screen.queryByText('out of')).not.toBeInTheDocument();
  });

  it('renders multiple pages', async () => {
    server.use(graphql.query<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(
      'getPaginatedUsers', (req, res, ctx) => res(ctx.data({
        __typename: 'Query',
        customer: {
          id: '1',
          __typename: 'Customer',
          usersConnection: {
            __typename: 'UserConnection',
            totalPages: 10,
            pageInfo: {
              hasNextPage: true,
              hasPrevPage: false,
              nextPageOffset: 5,
              pageIndex: 0,
              prevPageOffset: 0,
            },
            userCustomers: [
              {
                __typename: 'UserCustomer',
                isActive: true,
                createdAt: new Date().toISOString(),
                role: {
                  id: '1',
                  name: 'Manager',
                  __typename: 'RoleType',
                },
                user: {
                  id: 'A',
                  firstName: 'John',
                  lastLoggedIn: new Date().toISOString(),
                  lastName: 'Doe',
                  email: 'johndoe@gmail.com',
                  __typename: 'UserType',
                },
              },
              ...range(10).map((i) => generateUserCustomer(i)),
            ],
          },
        },
      })),
    ));

    render(<UsersOverview />);
    expect(await screen.findByText('johndoe@gmail.com')).toBeInTheDocument();

    // Ensure we pagination
    expect(await screen.findByText(/.*out of.*/i)).toBeInTheDocument();
  });

  it('user can be edited', async () => {
    server.use(graphql.query<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(
      'getPaginatedUsers', (req, res, ctx) => res(ctx.data({
        __typename: 'Query',
        customer: {
          id: '1',
          __typename: 'Customer',
          usersConnection: {
            __typename: 'UserConnection',
            totalPages: 10,
            pageInfo: {
              hasNextPage: true,
              hasPrevPage: false,
              nextPageOffset: 5,
              pageIndex: 0,
              prevPageOffset: 0,
            },
            userCustomers: [
              {
                __typename: 'UserCustomer',
                isActive: true,
                createdAt: new Date().toISOString(),
                role: {
                  id: '1',
                  name: 'Manager',
                  __typename: 'RoleType',
                },
                user: {
                  id: 'JOHN_ID_1',
                  firstName: 'John',
                  lastLoggedIn: new Date().toISOString(),
                  lastName: 'Doe',
                  email: 'johndoe@gmail.com',
                  __typename: 'UserType',
                },
              },
              ...range(10).map((i) => generateUserCustomer(i)),
            ],
          },
        },
      })),
    ));

    const { history } = render(<UsersOverview />);
    expect(await screen.findByText('johndoe@gmail.com')).toBeInTheDocument();
    await expectWorkspaceLoaded();

    fireEvent.contextMenu(await screen.findByText('johndoe@gmail.com'));
    const editDropDown = await screen.findByText('Edit user');
    expect(editDropDown).not.toBeDisabled();
    userEvent.click(editDropDown);

    // Check that the page is reached
    expect(history.location.pathname).toContain('/u/JOHN_ID_1/edit');
  });

  it('user can be removed', async () => {
    server.use(graphql.query<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(
      'getPaginatedUsers', (req, res, ctx) => res(ctx.data({
        __typename: 'Query',
        customer: {
          id: '1',
          __typename: 'Customer',
          usersConnection: {
            __typename: 'UserConnection',
            totalPages: 10,
            pageInfo: {
              hasNextPage: true,
              hasPrevPage: false,
              nextPageOffset: 5,
              pageIndex: 0,
              prevPageOffset: 0,
            },
            userCustomers: [
              {
                __typename: 'UserCustomer',
                isActive: true,
                createdAt: new Date().toISOString(),
                role: {
                  id: '1',
                  name: 'Manager',
                  __typename: 'RoleType',
                },
                user: {
                  id: 'JOHN_ID_1',
                  firstName: 'John',
                  lastLoggedIn: new Date().toISOString(),
                  lastName: 'Doe',
                  email: 'johndoe@gmail.com',
                  __typename: 'UserType',
                },
              },
              ...range(10).map((i) => generateUserCustomer(i)),
            ],
          },
        },
      })),
    ));

    render(<UsersOverview />);
    expect(await screen.findByText('johndoe@gmail.com')).toBeInTheDocument();

    server.use(graphql.query<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(
      'getPaginatedUsers', (req, res, ctx) => res(ctx.data({
        __typename: 'Query',
        customer: {
          id: '1',
          __typename: 'Customer',
          usersConnection: {
            __typename: 'UserConnection',
            totalPages: 10,
            pageInfo: {
              hasNextPage: true,
              hasPrevPage: false,
              nextPageOffset: 5,
              pageIndex: 0,
              prevPageOffset: 0,
            },
            userCustomers: [
              ...range(10).map((i) => generateUserCustomer(i)),
            ],
          },
        },
      })),
    ));

    await expectWorkspaceLoaded();

    fireEvent.contextMenu(await screen.findByText('johndoe@gmail.com'));
    const removeDropdown = await screen.findByText('Remove user');
    expect(removeDropdown).not.toBeDisabled();
    userEvent.click(removeDropdown);

    await waitFor(() => {
      expect(screen.queryByText('johndoe@gmail.com')).not.toBeInTheDocument();
    });
  });

  // TODO: Add test for toggling user active status
});

