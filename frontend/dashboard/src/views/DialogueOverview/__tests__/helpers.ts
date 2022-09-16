import { graphql } from 'msw';
import { server } from 'test';

import {
  AssignUserToDialogueMutation,
  AssignUserToDialogueMutationVariables,
  DeleteDialogueMutation,
  DeleteDialogueMutationVariables,
  DialogueConnectionQuery,
  DialogueConnectionQueryVariables,
  GetCustomerOfUserQuery,
  GetCustomerOfUserQueryVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
  MeQuery,
  MeQueryVariables,
  SetDialoguePrivacyMutation,
  SetDialoguePrivacyMutationVariables,
} from 'types/generated-types';

/**
 * Mock: DialogueConnectionQuery
 *
 * Origin: Generated
 */
// eslint-disable-next-line
export const DialogueConnectionResponse: DialogueConnectionQuery = JSON.parse('{"customer":{"id":"cl820sk1r0461av3qhhdvqe18","slug":"club-hades2","dialogueConnection":{"totalPages":3,"pageInfo":{"hasPrevPage":false,"hasNextPage":true,"prevPageOffset":0,"nextPageOffset":9,"pageIndex":0,"__typename":"PaginationPageInfo"},"dialogues":[{"id":"cl820sq9s9526av3q141ua3ku","title":"Female - U18 - Team3","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U18-Team3","publicTitle":null,"creationDate":"1663183977472","updatedAt":"1663183977800","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":72.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820spy79136av3q7jvz8eoe","title":"Female - U18 - Team2","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U18-Team2","publicTitle":null,"creationDate":"1663183977055","updatedAt":"1663183977416","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":72.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820spot8745av3q2wfoucld","title":"Female - U18 - Team1","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U18-Team1","publicTitle":null,"creationDate":"1663183976717","updatedAt":"1663183977004","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":77.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820spe18357av3qo2ds54qg","title":"Female - U16 - Team3","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U16-Team3","publicTitle":null,"creationDate":"1663183976329","updatedAt":"1663183976664","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":75,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820sp4h7968av3qyrm16iro","title":"Female - U16 - Team2","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U16-Team2","publicTitle":null,"creationDate":"1663183975985","updatedAt":"1663183976278","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":74.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820sot47576av3quvkzot92","title":"Female - U16 - Team1","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U16-Team1","publicTitle":null,"creationDate":"1663183975576","updatedAt":"1663183975928","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":74,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820sojc7184av3qv6yw6479","title":"Female - U12 - Team3","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U12-Team3","publicTitle":null,"creationDate":"1663183975224","updatedAt":"1663183975524","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":79.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820soa96792av3q2droalla","title":"Female - U12 - Team2","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U12-Team2","publicTitle":null,"creationDate":"1663183974897","updatedAt":"1663183975173","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":78.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820so1j6400av3qe4zy1w5z","title":"Female - U12 - Team1","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U12-Team1","publicTitle":null,"creationDate":"1663183974583","updatedAt":"1663183974848","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":74,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"}],"__typename":"DialogueConnection"},"__typename":"Customer"}}')
export const dialogues = DialogueConnectionResponse.customer?.dialogueConnection?.dialogues;
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
export const GetUsersReponse: GetUsersQuery = JSON.parse('{"customer":{"id":"cl6lz9jev0011gxoix8hb2nvd","users":[{"id":"cl6luytmn00008qoiqtzdp4g0","firstName":"Daan","lastName":"Helsloot","role":{"id":"cl6lz9jew0018gxoi1oyvs26y","name":"Admin","__typename":"RoleType"},"__typename":"UserType"},{"id":"cl6lz9jha0067gxoi5kk40mbd","firstName":"Manager","lastName":"Boy","role":{"id":"cl6lz9jew0018gxoi1oyvs26y","name":"Admin","__typename":"RoleType"},"__typename":"UserType"}],"__typename":"Customer"}}')

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

// eslint-disable-next-line
export const AssignUserToDialogueResponse: AssignUserToDialogueMutation = JSON.parse('{"assignUserToDialogue":{"email":"manager@sport_eng-er0ginx.com","__typename":"UserType"}}')

export const mockAssignUserToDialogue = (
  createResponse: (res: AssignUserToDialogueMutation) => AssignUserToDialogueMutation,
) => (
  server.use(
    graphql.mutation<AssignUserToDialogueMutation, AssignUserToDialogueMutationVariables>(
      'assignUserToDialogue',
      (req, res, ctx) => res(ctx.data(createResponse(AssignUserToDialogueResponse))),
    ),
  )
);

// eslint-disable-next-line
export const SetDialoguePrivacyResponse: SetDialoguePrivacyMutation = JSON.parse('{"setDialoguePrivacy":{"slug":"Female-U18-Team3","title":"Female - U18 - Team3","isPrivate":true,"__typename":"Dialogue"}}')

export const mockSetDialoguePrivacy = (
  createResponse: (res: SetDialoguePrivacyMutation) => SetDialoguePrivacyMutation,
) => (
  server.use(
    graphql.mutation<SetDialoguePrivacyMutation, SetDialoguePrivacyMutationVariables>(
      'setDialoguePrivacy',
      (req, res, ctx) => res(ctx.data(createResponse(SetDialoguePrivacyResponse))),
    ),
  )
);
// eslint-disable-next-line
export const DeleteDialogueResponse: DeleteDialogueMutation = JSON.parse('{"deleteDialogue":{"slug":"Female-U18-Team3"}}')

export const mockDeleteDialogue = (
  createResponse: (res: DeleteDialogueMutation) => DeleteDialogueMutation,
) => (
  server.use(
    graphql.mutation<DeleteDialogueMutation, DeleteDialogueMutationVariables>(
      'deleteDialogue',
      (req, res, ctx) => res(ctx.data(createResponse(SetDialoguePrivacyResponse))),
    ),
  )
);

