import { graphql } from "msw";
import { DeleteUserMutation, DeleteUserMutationVariables } from "types/generated-types";
import { defaultAdminRole } from "./MockDefaultRole";

/**
 * Mocks the response after deleting a user.
 *
 * - User is assigned to one workspace.
 * - User with workspace has generally all permissions a customer is expected to have (with role Admin).
 */

export const defaultMockDeleteUser = graphql.mutation<DeleteUserMutation, DeleteUserMutationVariables>(
  'deleteUser', (req, res, ctx) => res(ctx.data({
    deleteUser: {
      deletedUser: true,
      __typename: 'DeleteUserOutput',
    },
    __typename: 'Mutation'
  })),
);
