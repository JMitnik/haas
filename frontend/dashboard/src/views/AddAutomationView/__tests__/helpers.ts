import { graphql, server } from 'test';

import {
  GetUsersAndRolesQuery,
  GetUsersAndRolesQueryVariables,
} from 'types/generated-types';

/**
 * Mock GetWorkspaceDialogueStatisticsQuery.
 *
 * Default response was based on the Sports Team seed for 'Club hades', with 5 data points.
 */
// eslint-disable-next-line
export const getUsersAndRolesResponse: GetUsersAndRolesQuery = JSON.parse('{"customer":{"id":"cl7g2dfnr0011gcoi03lwau6i","users":[{"id":"cl7g2d74t0000ncoicjj78gb5","firstName":"Daan","lastName":"Helsloot","email":"daan@haas.live","phone":null,"role":{"id":"cl7g2dfnr0018gcoi2bgwyjre","name":"Admin","__typename":"RoleType"},"__typename":"UserType"},{"id":"cl7g2dfoj0067gcoi4hzus4vm","firstName":"Manager","lastName":"Boy","email":"manager@sport_eng-no0giwh.com","phone":null,"role":{"id":"cl7g2dfnr0018gcoi2bgwyjre","name":"Admin","__typename":"RoleType"},"__typename":"UserType"},{"id":"cl7g2t4lf2198ltoi5i1i9423","firstName":null,"lastName":null,"email":"Noge@esdf.com","phone":null,"role":{"id":"cl7g2dfnr0019gcoi2jgxfa0w","name":"Manager","__typename":"RoleType"},"__typename":"UserType"},{"id":"cl7g2tbvj2391ltoi74o8bb2r","firstName":null,"lastName":null,"email":"ja@dsaf.b","phone":null,"role":{"id":"cl7g2dfnr0019gcoi2jgxfa0w","name":"Manager","__typename":"RoleType"},"__typename":"UserType"}],"roles":[{"id":"cl7g2dfns0021gcoic5hmqd8r","name":"Bot","__typename":"RoleType"},{"id":"cl7g2dfnr0019gcoi2jgxfa0w","name":"Manager","__typename":"RoleType"},{"id":"cl7g2dfnr0018gcoi2bgwyjre","name":"Admin","__typename":"RoleType"},{"id":"cl7g2dfns0020gcois62avlp1","name":"User","__typename":"RoleType"}],"__typename":"Customer"}}');

export const mockGetUsersAndRoles = (
  createResponse: (res: GetUsersAndRolesQuery) => GetUsersAndRolesQuery,
) => (
  server.use(
    graphql.query<GetUsersAndRolesQuery, GetUsersAndRolesQueryVariables>(
      'getUsersAndRoles',
      (req, res, ctx) => res(ctx.data(createResponse(getUsersAndRolesResponse))),
    ),
  )
);
