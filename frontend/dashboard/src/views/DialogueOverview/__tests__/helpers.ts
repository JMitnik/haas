import { graphql } from 'msw';
import { server } from 'test';

import {
  DialogueConnectionQuery,
  DialogueConnectionQueryVariables,
  GetCustomerOfUserQuery,
  GetCustomerOfUserQueryVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
  MeQuery,
  MeQueryVariables,
} from 'types/generated-types';

/**
 * Mock: DialogueConnectionQuery
 *
 * Origin: Generated
 */
// eslint-disable-next-line
export const DialogueConnectionResponse: DialogueConnectionQuery = JSON.parse('{"customer":{"id":"cl33hcozt1145hh3qqwiki7ga","slug":"club-hades","dialogueConnection":{"totalPages":3,"pageInfo":{"hasPrevPage":false,"hasNextPage":true,"prevPageOffset":0,"nextPageOffset":9,"pageIndex":0,"__typename":"PaginationPageInfo"},"dialogues":[{"id":"cl33hcw1z11759hh3q8wvtkxns","title":"Female - U18 - Team3","isPrivate":false,"language":"ENGLISH","slug":"Female-U18-Team3","publicTitle":null,"creationDate":"1652388346439","updatedAt":"1652388346723","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":74.4,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcvr611301hh3qsq28ptt3","title":"Female - U18 - Team2","isPrivate":false,"language":"ENGLISH","slug":"Female-U18-Team2","publicTitle":null,"creationDate":"1652388346050","updatedAt":"1652388346339","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":76.8,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcvgn10840hh3qkpvm17sx","title":"Female - U18 - Team1","isPrivate":false,"language":"ENGLISH","slug":"Female-U18-Team1","publicTitle":null,"creationDate":"1652388345671","updatedAt":"1652388345949","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":76.4,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcv5x10384hh3qvswjl4av","title":"Female - U16 - Team3","isPrivate":false,"language":"ENGLISH","slug":"Female-U16-Team3","publicTitle":null,"creationDate":"1652388345285","updatedAt":"1652388345576","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":74.2,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcuvj9926hh3qwubvkns2","title":"Female - U16 - Team2","isPrivate":false,"language":"ENGLISH","slug":"Female-U16-Team2","publicTitle":null,"creationDate":"1652388344911","updatedAt":"1652388345185","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":73.6,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcukx9466hh3q7nveh65g","title":"Female - U16 - Team1","isPrivate":false,"language":"ENGLISH","slug":"Female-U16-Team1","publicTitle":null,"creationDate":"1652388344529","updatedAt":"1652388344805","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":74,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcua59007hh3qapw3nkfr","title":"Female - U12 - Team3","isPrivate":false,"language":"ENGLISH","slug":"Female-U12-Team3","publicTitle":null,"creationDate":"1652388344141","updatedAt":"1652388344420","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":75.4,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hctzs8546hh3qsadmrrjx","title":"Female - U12 - Team2","isPrivate":false,"language":"ENGLISH","slug":"Female-U12-Team2","publicTitle":null,"creationDate":"1652388343768","updatedAt":"1652388344047","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":76,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hctpr8086hh3q953twf0z","title":"Female - U12 - Team1","isPrivate":false,"language":"ENGLISH","slug":"Female-U12-Team1","publicTitle":null,"creationDate":"1652388343407","updatedAt":"1652388343670","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":75.6,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"}],"__typename":"DialogueConnection"},"__typename":"Customer"}}')

export const mockQueryDialogueConnection = (
  createResponse: (res: DialogueConnectionQuery) => DialogueConnectionQuery,
) => (
  server.use(
    graphql.query<DialogueConnectionQuery, DialogueConnectionQueryVariables>(
      'dialogueConnection',
      (req, res, ctx) => res(ctx.data(createResponse(DialogueConnectionResponse))),
    ),
  )
);

// eslint-disable-next-line
export const UserOfCustomerResponse: GetCustomerOfUserQuery = JSON.parse('{"UserOfCustomer":{"customer":{"id":"cl6lv12mz0011ppoilkt27l8w","isDemo":false,"name":"SPORT_ENG Workspace","slug":"sport_eng-mw0pipz","settings":{"id":"1","logoUrl":"","colourSettings":{"id":"1","primary":"#667EEA","__typename":"ColourSettings"},"__typename":"CustomerSettings"},"campaigns":[],"__typename":"Customer"},"role":{"name":"Admin","permissions":["CAN_VIEW_USERS","CAN_ADD_USERS","CAN_BUILD_DIALOGUE","CAN_CREATE_TRIGGERS","CAN_DELETE_DIALOGUE","CAN_DELETE_TRIGGERS","CAN_EDIT_DIALOGUE","CAN_EDIT_USERS","CAN_DELETE_USERS","CAN_DELETE_WORKSPACE","CAN_EDIT_WORKSPACE","CAN_VIEW_DIALOGUE","CAN_VIEW_DIALOGUE_ANALYTICS","CAN_RESET_WORKSPACE_DATA","CAN_ASSIGN_USERS_TO_DIALOGUE","CAN_GENERATE_WORKSPACE_FROM_CSV"],"__typename":"RoleType"},"user":{"id":"cl6luytmn00008qoiqtzdp4g0","assignedDialogues":{"privateWorkspaceDialogues":[],"assignedDialogues":[],"__typename":"AssignedDialogues"},"__typename":"UserType"},"__typename":"UserCustomer"}}');

export const mockCustomerOfUser = (
  createResponse: (res: GetCustomerOfUserQuery) => GetCustomerOfUserQuery,
) => (
  server.use(
    graphql.query<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>(
      'getCustomerOfUser',
      (req, res, ctx) => res(ctx.data(createResponse(UserOfCustomerResponse))),
    ),
  )
);

// eslint-disable-next-line
export const GetUsersReponse: GetUsersQuery = JSON.parse('{"customer":{"id":"cl6lv12mz0011ppoilkt27l8w","users":[{"id":"cl6luytmn00008qoiqtzdp4g0","firstName":"Daan","lastName":"Helsloot","role":{"id":"cl6lv12mz0018ppoivrfrj49o","name":"Admin","__typename":"RoleType"},"__typename":"UserType"}],"__typename":"Customer"}}')

export const mockGetUsers = (
  createResponse: (res: GetUsersQuery) => GetUsersQuery,
) => (
  server.use(
    graphql.query<GetUsersQuery, GetUsersQueryVariables>(
      'getUsers',
      (req, res, ctx) => res(ctx.data(createResponse(GetUsersReponse))),
    ),
  )
);

// eslint-disable-next-line
export const GetMeResponse: MeQuery = JSON.parse('{"me":{"id":"cl6luytmn00008qoiqtzdp4g0","email":"daan@haas.live","firstName":"Daan","lastName":"Helsloot","phone":null,"globalPermissions":[],"userCustomers":[{"isActive":true,"customer":{"id":"cl6lv12mz0011ppoilkt27l8w","name":"SPORT_ENG Workspace","slug":"sport_eng-mw0pipz","__typename":"Customer"},"role":{"name":"Admin","permissions":["CAN_VIEW_USERS","CAN_ADD_USERS","CAN_BUILD_DIALOGUE","CAN_CREATE_TRIGGERS","CAN_DELETE_DIALOGUE","CAN_DELETE_TRIGGERS","CAN_EDIT_DIALOGUE","CAN_EDIT_USERS","CAN_DELETE_USERS","CAN_DELETE_WORKSPACE","CAN_EDIT_WORKSPACE","CAN_VIEW_DIALOGUE","CAN_VIEW_DIALOGUE_ANALYTICS","CAN_RESET_WORKSPACE_DATA","CAN_ASSIGN_USERS_TO_DIALOGUE","CAN_GENERATE_WORKSPACE_FROM_CSV"],"__typename":"RoleType"},"__typename":"UserCustomer"}],"__typename":"UserType"}}')

export const mockMe = (
  createResponse: (res: MeQuery) => MeQuery,
) => (
  server.use(
    graphql.query<MeQuery, MeQueryVariables>(
      'me',
      (req, res, ctx) => res(ctx.data(createResponse(GetMeResponse))),
    ),
  )
);

