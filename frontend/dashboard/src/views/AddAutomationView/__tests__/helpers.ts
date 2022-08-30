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
export const getUsersAndRolesResponse: GetUsersAndRolesQuery = JSON.parse('{"customer":{"id":"cl6akfp22001193oi830aesja","users":[{"id":"cl6akfp2v006793oimx7c7q5s","firstName":"ADMIN","lastName":"User","email":"sport_eng-1z09ifd-admin","phone":null,"role":{"id":"cl6akfp23001893oijzd166mx","name":"Admin","__typename":"RoleType"},"__typename":"UserType"},{"id":"cl6akfp3e008693oigf2qfg46","firstName":"MANAGER","lastName":"User","email":"sport_eng-1z09ifd-manager","phone":null,"role":{"id":"cl6akfp23001993oio4z1vzj9","name":"Manager","__typename":"RoleType"},"__typename":"UserType"},{"id":"cl6akfp3q010593oi46w7ogts","firstName":"USER","lastName":"User","email":"sport_eng-1z09ifd-user","phone":null,"role":{"id":"cl6akfp23002093oijy80jrk8","name":"User","__typename":"RoleType"},"__typename":"UserType"},{"id":"IDEETJE","firstName":"Daan","lastName":"Helsloot","email":"daan@haas.live","phone":"0681401217","role":{"id":"cl6akfp23001893oijzd166mx","name":"Admin","__typename":"RoleType"},"__typename":"UserType"},{"id":"cl6akfp4a013493oi07i3x6s3","firstName":"bot","lastName":"sport_eng-1z09ifd","email":"sport_eng-1z09ifd@haas.live","phone":null,"role":{"id":"cl6akfp23002193oi0nysv4zq","name":"Bot","__typename":"RoleType"},"__typename":"UserType"}],"roles":[{"id":"cl6akfp23002093oijy80jrk8","name":"User","__typename":"RoleType"},{"id":"cl6akfp23001993oio4z1vzj9","name":"Manager","__typename":"RoleType"},{"id":"cl6akfp23001893oijzd166mx","name":"Admin","__typename":"RoleType"},{"id":"cl6akfp23002193oi0nysv4zq","name":"Bot","__typename":"RoleType"}],"__typename":"Customer"}}');

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
