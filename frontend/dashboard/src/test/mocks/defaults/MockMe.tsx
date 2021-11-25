import { graphql } from "msw";
import { MeQuery, MeQueryVariables } from "types/generated-types";
import { defaultAdminRole } from "./MockDefaultRole";

/**
 * Mocks a user.
 *
 * - User is assigned to one workspace.
 * - User with workspace has generally all permissions a customer is expected to have (with role Admin).
 */
export const defaultMockMeHandler = graphql.query<MeQuery, MeQueryVariables>(
  'me', (req, res, ctx) => {
    return res(ctx.data({
      me: {
        id: 'ID_1',
        email: 'JaneHaas@live.com',
        firstName: 'Jane',
        lastName: 'Haas',
        globalPermissions: [],
        phone: '+3161234567',
        __typename: 'UserType',
        userCustomers: [{
          isActive: true,
          role: defaultAdminRole,
          customer: {
            id: 'WORKSPACE_1',
            name: 'Workspace 1',
            slug: 'workspace_1',
            __typename: 'Customer',
          }
        }]
      },
      __typename: 'Query',
    }));
  }
);
