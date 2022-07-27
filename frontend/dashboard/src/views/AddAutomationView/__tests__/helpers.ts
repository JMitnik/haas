import { graphql } from 'msw';
import { server } from 'test';

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
export const getUsersAndRolesResponse: GetUsersAndRolesQuery = JSON.parse('{"customer":{"id":"cl5wm8upv0057mioitn5vtq6m","users":[{"id":"IDEETJE","firstName":"Daan","lastName":"Helsloot","email":"daan@haas.live","phone":null,"role":{"id":"cl5wm8upw0064mioigamidcio","name":"Admin","__typename":"RoleType"},"__typename":"UserType"},{"id":"cl62aigmd0037usoi7vfb6g36","firstName":"Haas","lastName":"Bot","email":"bassy@haas.live","phone":"","role":{"id":"cl5wm8upw0067mioiyyr8gk71","name":"Bot","__typename":"RoleType"},"__typename":"UserType"}],"roles":[{"id":"cl5wm8upw0066mioihlw2n8bh","name":"User","__typename":"RoleType"},{"id":"cl5wm8upw0064mioigamidcio","name":"Admin","__typename":"RoleType"},{"id":"cl5wm8upw0065miois7c5cgq5","name":"Manager","__typename":"RoleType"},{"id":"cl5wm8upw0067mioiyyr8gk71","name":"Bot","__typename":"RoleType"}],"__typename":"Customer"}}');

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
