import { graphql } from 'msw';

import { GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables } from 'types/generated-types';

import { defaultAdminRole } from './MockDefaultRole';

/**
 * Mocks a workspace.
 *
 * - User is assigned to one workspace.
 * - User with workspace has generally all permissions a customer is expected to have (with role Admin).
 */
export const defaultMockGetCustomerOfUserHandler = graphql.query
  <GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>(
    'getCustomerOfUser', (req, res, ctx) => res(ctx.data({
      UserOfCustomer: {
        user: {
          id: 'ID_1',
          assignedDialogues: {
            assignedDialogues: [],
            privateWorkspaceDialogues: [],
          },
          privateDialogues: {
            assignedDialogues: [],
            privateWorkspaceDialogues: [],
            __typename: 'AssignedDialogues',
          },
          __typename: 'UserType',
        },
        role: defaultAdminRole,
        customer: {
          id: 'WORKSPACE_1',
          isDemo: false,
          name: 'Workspace 1',
          slug: 'workspace_1',
          campaigns: [],
          settings: {
            id: 'SETTINGS_1',
            colourSettings: {
              id: 'COLOUR_SETTINGS_1',
              primary: '#013643',
              __typename: 'ColourSettings',
            },
            logoUrl: '',
            __typename: 'CustomerSettings',
          },
          __typename: 'Customer',
        },
        __typename: 'UserCustomer',
      },
      __typename: 'Query',
    })),
  );
