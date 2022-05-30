import { expectWorkspaceLoaded, fireEvent, render, screen, server, userEvent, waitFor } from 'test';
import { graphql } from 'msw';
import { name } from 'faker';
import { range } from 'lodash';
import React from 'react';

import {
  GetCustomerOfUserQuery,
  GetCustomerOfUserQueryVariables,
  GetPaginatedUsersQuery,
  GetPaginatedUsersQueryVariables,
  SystemPermission,
  UserCustomer,
} from 'types/generated-types';

import UsersOverview from '../UsersOverview';

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
    server.use(graphql.query<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>(
      'getCustomerOfUser', (req, res, ctx) => res(ctx.data({
        UserOfCustomer: {
          customer: {
            id: 'cl1vs0dd10002xczgbx999ehj',
            name: 'Metrics',
            slug: 'cl1vs0dcr0000xczg6gmj6dfn',
            settings:
            {
              id: '2',
              logoUrl: null,
              colourSettings: { id: '2', primary: '#f47373', __typename: 'ColourSettings' },
              __typename: 'CustomerSettings',
            },
            campaigns: [],
            __typename: 'Customer',
          },
          role: {
            name: 'Admin',
            permissions: [
              SystemPermission.CanViewUsers,
              SystemPermission.CanAddUsers,
              SystemPermission.CanEditUsers,
              SystemPermission.CanDeleteUsers,
            ],
            __typename: 'RoleType',
          },
          user: {
            id: 'IDEETJE',
            assignedDialogues: {
              privateWorkspaceDialogues: [],
              assignedDialogues:
                [
                  { slug: 'Female-U18-MA1', id: 'cl296bdxg0209kmoircogwhew', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA3', id: 'cl296bfc92497kmoiatuig34o', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA1', id: 'cl296cl423851kmoi45n5egs5', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA3', id: 'cl296cmhg6132kmoikduvcn9z', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA1', id: 'cl296kuns0066n6oizs6w4xcr', __typename: 'Dialogue' },
                ],
              __typename: 'AssignedDialogues',
            },
            __typename: 'UserType',
          },
          __typename: 'UserCustomer',
        },
      })),
    ));

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
    server.use(graphql.query<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>(
      'getCustomerOfUser', (req, res, ctx) => res(ctx.data({
        UserOfCustomer: {
          customer: {
            id: 'cl1vs0dd10002xczgbx999ehj',
            name: 'Metrics',
            slug: 'cl1vs0dcr0000xczg6gmj6dfn',
            settings:
            {
              id: '2',
              logoUrl: null,
              colourSettings: { id: '2', primary: '#f47373', __typename: 'ColourSettings' },
              __typename: 'CustomerSettings',
            },
            campaigns: [],
            __typename: 'Customer',
          },
          role: {
            name: 'Admin',
            permissions: [
              SystemPermission.CanViewUsers,
              SystemPermission.CanAddUsers,
              SystemPermission.CanEditUsers,
              SystemPermission.CanDeleteUsers,
            ],
            __typename: 'RoleType',
          },
          user: {
            id: 'IDEETJE',
            assignedDialogues: {
              privateWorkspaceDialogues: [],
              assignedDialogues:
                [
                  { slug: 'Female-U18-MA1', id: 'cl296bdxg0209kmoircogwhew', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA3', id: 'cl296bfc92497kmoiatuig34o', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA1', id: 'cl296cl423851kmoi45n5egs5', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA3', id: 'cl296cmhg6132kmoikduvcn9z', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA1', id: 'cl296kuns0066n6oizs6w4xcr', __typename: 'Dialogue' },
                ],
              __typename: 'AssignedDialogues',
            },
            __typename: 'UserType',
          },
          __typename: 'UserCustomer',
        },
      })),
    ));

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
    server.use(graphql.query<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>(
      'getCustomerOfUser', (req, res, ctx) => res(ctx.data({
        UserOfCustomer: {
          customer: {
            id: 'cl1vs0dd10002xczgbx999ehj',
            name: 'Metrics',
            slug: 'cl1vs0dcr0000xczg6gmj6dfn',
            settings:
            {
              id: '2',
              logoUrl: null,
              colourSettings: { id: '2', primary: '#f47373', __typename: 'ColourSettings' },
              __typename: 'CustomerSettings',
            },
            campaigns: [],
            __typename: 'Customer',
          },
          role: {
            name: 'Admin',
            permissions: [
              SystemPermission.CanViewUsers,
              SystemPermission.CanAddUsers,
              SystemPermission.CanEditUsers,
              SystemPermission.CanDeleteUsers,
            ],
            __typename: 'RoleType',
          },
          user: {
            id: 'IDEETJE',
            assignedDialogues: {
              privateWorkspaceDialogues: [],
              assignedDialogues:
                [
                  { slug: 'Female-U18-MA1', id: 'cl296bdxg0209kmoircogwhew', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA3', id: 'cl296bfc92497kmoiatuig34o', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA1', id: 'cl296cl423851kmoi45n5egs5', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA3', id: 'cl296cmhg6132kmoikduvcn9z', __typename: 'Dialogue' },
                  { slug: 'Female-U18-MA1', id: 'cl296kuns0066n6oizs6w4xcr', __typename: 'Dialogue' },
                ],
              __typename: 'AssignedDialogues',
            },
            __typename: 'UserType',
          },
          __typename: 'UserCustomer',
        },
      })),
    ));

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

