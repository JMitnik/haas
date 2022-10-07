import { graphql } from 'msw';
import { server } from 'test';

import {
  DialogueConnectionQuery,
  DialogueConnectionQueryVariables,
  GetCustomerOfUserQuery,
  GetCustomerOfUserQueryVariables,
  GetWorkspaceDialogueStatisticsQuery,
  GetWorkspaceDialogueStatisticsQueryVariables,
  SystemPermission,
} from 'types/generated-types';

import { Dialogue } from '../WorkspaceGrid.types';

export const getCustomerOfUserResponse: GetCustomerOfUserQuery = {
  UserOfCustomer: {
    customer: {
      id: 'cl1vs0dd10002xczgbx999ehj',
      isDemo: false,
      name: 'Metrics',
      slug: 'cl1vs0dcr0000xczg6gmj6dfn',
      settings:
      {
        id: 2,
        logoUrl: null,
        colourSettings: { id: 2, primary: '#f47373', __typename: 'ColourSettings' },
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
};

export const mockGetCustomersOfUser = (
  createResponse: (res: GetCustomerOfUserQuery) => GetCustomerOfUserQuery,
) => (
  server.use(graphql.query<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>(
    'getCustomerOfUser', (req, res, ctx) => res(ctx.data(createResponse(getCustomerOfUserResponse))),
  ))
);

/**
 * Mock GetWorkspaceDialogueStatisticsQuery.
 *
 * Default response was based on the Sports Team seed for 'Club hades', with 5 data points.
 */
// eslint-disable-next-line
export const getWorkspaceDialogueStatisticsResponse: GetWorkspaceDialogueStatisticsQuery = JSON.parse('{"customer":{"statistics":{"workspaceStatisticsSummary":[{"id":"cl4zgy6ln6893dwoikf3edvfw","nrVotes":5,"impactScore":74.2,"updatedAt":1656506578365,"title":"Male - U8 - Team1","dialogue":{"title":"Male - U8 - Team1","id":"cl4zgy6ln6893dwoikf3edvfw","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgy76p7811dwoi6jxbjip6","nrVotes":5,"impactScore":77.6,"updatedAt":1656506578365,"title":"Male - U8 - Team2","dialogue":{"title":"Male - U8 - Team2","id":"cl4zgy76p7811dwoi6jxbjip6","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgy7ox8725dwoibmzbfvqw","nrVotes":5,"impactScore":74.4,"updatedAt":1656506578365,"title":"Male - U8 - Team3","dialogue":{"title":"Male - U8 - Team3","id":"cl4zgy7ox8725dwoibmzbfvqw","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgy8689640dwoik6aubdeh","nrVotes":5,"impactScore":73.6,"updatedAt":1656506578365,"title":"Male - U12 - Team1","dialogue":{"title":"Male - U12 - Team1","id":"cl4zgy8689640dwoik6aubdeh","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgy8no10555dwoigfwfx9s9","nrVotes":5,"impactScore":73.8,"updatedAt":1656506578365,"title":"Male - U12 - Team2","dialogue":{"title":"Male - U12 - Team2","id":"cl4zgy8no10555dwoigfwfx9s9","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgy95r11471dwoi6no68bc9","nrVotes":5,"impactScore":76,"updatedAt":1656506578365,"title":"Male - U12 - Team3","dialogue":{"title":"Male - U12 - Team3","id":"cl4zgy95r11471dwoi6no68bc9","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgy9nc12388dwoillj01wdf","nrVotes":5,"impactScore":78,"updatedAt":1656506578365,"title":"Male - U16 - Team1","dialogue":{"title":"Male - U16 - Team1","id":"cl4zgy9nc12388dwoillj01wdf","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgya4k13305dwoif9b6k5uy","nrVotes":5,"impactScore":74.8,"updatedAt":1656506578365,"title":"Male - U16 - Team2","dialogue":{"title":"Male - U16 - Team2","id":"cl4zgya4k13305dwoif9b6k5uy","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyamk14221dwoickmg8ody","nrVotes":5,"impactScore":73.8,"updatedAt":1656506578365,"title":"Male - U16 - Team3","dialogue":{"title":"Male - U16 - Team3","id":"cl4zgyamk14221dwoickmg8ody","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyb4n15138dwoildxbl07t","nrVotes":5,"impactScore":73.4,"updatedAt":1656506578365,"title":"Male - U18 - Team1","dialogue":{"title":"Male - U18 - Team1","id":"cl4zgyb4n15138dwoildxbl07t","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgybmr16051dwoiad9zr7p0","nrVotes":5,"impactScore":74.6,"updatedAt":1656506578365,"title":"Male - U18 - Team2","dialogue":{"title":"Male - U18 - Team2","id":"cl4zgybmr16051dwoiad9zr7p0","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyc5p16960dwoihdrlod3m","nrVotes":5,"impactScore":75,"updatedAt":1656506578365,"title":"Male - U18 - Team3","dialogue":{"title":"Male - U18 - Team3","id":"cl4zgyc5p16960dwoihdrlod3m","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgycnf17873dwoioigje9pi","nrVotes":5,"impactScore":76.6,"updatedAt":1656506578365,"title":"Female - U8 - Team1","dialogue":{"title":"Female - U8 - Team1","id":"cl4zgycnf17873dwoioigje9pi","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyd5h18786dwoi8zr1svyo","nrVotes":5,"impactScore":73.2,"updatedAt":1656506578365,"title":"Female - U8 - Team2","dialogue":{"title":"Female - U8 - Team2","id":"cl4zgyd5h18786dwoi8zr1svyo","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgydnt19704dwoi10f6s3jy","nrVotes":5,"impactScore":74,"updatedAt":1656506578365,"title":"Female - U8 - Team3","dialogue":{"title":"Female - U8 - Team3","id":"cl4zgydnt19704dwoi10f6s3jy","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgye5m20616dwoiyzpa65rb","nrVotes":5,"impactScore":74.6,"updatedAt":1656506578366,"title":"Female - U12 - Team1","dialogue":{"title":"Female - U12 - Team1","id":"cl4zgye5m20616dwoiyzpa65rb","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyenl21529dwoipxz9c82g","nrVotes":5,"impactScore":73.6,"updatedAt":1656506578366,"title":"Female - U12 - Team2","dialogue":{"title":"Female - U12 - Team2","id":"cl4zgyenl21529dwoipxz9c82g","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyf4x22445dwoibqdo6kq1","nrVotes":5,"impactScore":74.4,"updatedAt":1656506578366,"title":"Female - U12 - Team3","dialogue":{"title":"Female - U12 - Team3","id":"cl4zgyf4x22445dwoibqdo6kq1","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyfmu23360dwoil2bztcbi","nrVotes":5,"impactScore":74,"updatedAt":1656506578366,"title":"Female - U16 - Team1","dialogue":{"title":"Female - U16 - Team1","id":"cl4zgyfmu23360dwoil2bztcbi","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyg4m24271dwoiwir9szuj","nrVotes":5,"impactScore":75.8,"updatedAt":1656506578366,"title":"Female - U16 - Team2","dialogue":{"title":"Female - U16 - Team2","id":"cl4zgyg4m24271dwoiwir9szuj","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgygm225182dwoiqjq5k81y","nrVotes":5,"impactScore":75.6,"updatedAt":1656506578366,"title":"Female - U16 - Team3","dialogue":{"title":"Female - U16 - Team3","id":"cl4zgygm225182dwoiqjq5k81y","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyh3s26095dwoiliojinc3","nrVotes":5,"impactScore":75.6,"updatedAt":1656506578366,"title":"Female - U18 - Team1","dialogue":{"title":"Female - U18 - Team1","id":"cl4zgyh3s26095dwoiliojinc3","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyhle27010dwoih4zkmq2p","nrVotes":5,"impactScore":75.4,"updatedAt":1656506578366,"title":"Female - U18 - Team2","dialogue":{"title":"Female - U18 - Team2","id":"cl4zgyhle27010dwoih4zkmq2p","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"},{"id":"cl4zgyi2j27922dwoihtaip7rs","nrVotes":5,"impactScore":75.2,"updatedAt":1656506578366,"title":"Female - U18 - Team3","dialogue":{"title":"Female - U18 - Team3","id":"cl4zgyi2j27922dwoihtaip7rs","__typename":"Dialogue"},"__typename":"DialogueStatisticsSummaryModel"}],"__typename":"WorkspaceStatistics"},"__typename":"Customer"}}');
export const dialogues = getWorkspaceDialogueStatisticsResponse
  .customer?.statistics?.workspaceStatisticsSummary as Dialogue[];

export const mockGetWorkspaceDialogueStatistics = (
  createResponse: (res: GetWorkspaceDialogueStatisticsQuery) => GetWorkspaceDialogueStatisticsQuery,
) => (
  server.use(
    graphql.query<GetWorkspaceDialogueStatisticsQuery, GetWorkspaceDialogueStatisticsQueryVariables>(
      'GetWorkspaceDialogueStatistics',
      (req, res, ctx) => res(ctx.data(createResponse(getWorkspaceDialogueStatisticsResponse))),
    ),
  )
);

/**
 * Mock: DialogueConnectionQuery
 *
 * Origin: Generated
 */
// eslint-disable-next-line
export const DialogueConnectionResponse: DialogueConnectionQuery = JSON.parse('{"customer":{"id":"cl820sk1r0461av3qhhdvqe18","slug":"club-hades2","dialogueConnection":{"totalPages":3,"pageInfo":{"hasPrevPage":false,"hasNextPage":true,"prevPageOffset":0,"nextPageOffset":9,"pageIndex":0,"__typename":"PaginationPageInfo"},"dialogues":[{"id":"cl820sq9s9526av3q141ua3ku","title":"Female - U18 - Team3","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U18-Team3","publicTitle":null,"creationDate":"1663183977472","updatedAt":"1663183977800","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":72.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820spy79136av3q7jvz8eoe","title":"Female - U18 - Team2","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U18-Team2","publicTitle":null,"creationDate":"1663183977055","updatedAt":"1663183977416","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":72.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820spot8745av3q2wfoucld","title":"Female - U18 - Team1","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U18-Team1","publicTitle":null,"creationDate":"1663183976717","updatedAt":"1663183977004","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":77.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820spe18357av3qo2ds54qg","title":"Female - U16 - Team3","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U16-Team3","publicTitle":null,"creationDate":"1663183976329","updatedAt":"1663183976664","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":75,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820sp4h7968av3qyrm16iro","title":"Female - U16 - Team2","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U16-Team2","publicTitle":null,"creationDate":"1663183975985","updatedAt":"1663183976278","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":74.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820sot47576av3quvkzot92","title":"Female - U16 - Team1","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U16-Team1","publicTitle":null,"creationDate":"1663183975576","updatedAt":"1663183975928","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":74,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820sojc7184av3qv6yw6479","title":"Female - U12 - Team3","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U12-Team3","publicTitle":null,"creationDate":"1663183975224","updatedAt":"1663183975524","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":79.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820soa96792av3q2droalla","title":"Female - U12 - Team2","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U12-Team2","publicTitle":null,"creationDate":"1663183974897","updatedAt":"1663183975173","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":78.5,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl820so1j6400av3qe4zy1w5z","title":"Female - U12 - Team1","isPrivate":false,"template":"SPORT_ENG","language":"ENGLISH","slug":"Female-U12-Team1","publicTitle":null,"creationDate":"1663183974583","updatedAt":"1663183974848","customerId":"cl820sk1r0461av3qhhdvqe18","averageScore":74,"assignees":[],"customer":{"slug":"club-hades2","__typename":"Customer"},"tags":[],"__typename":"Dialogue"}],"__typename":"DialogueConnection"},"__typename":"Customer"}}')

export const mockQueryDialogueConnection = (
  createResponse: (res: DialogueConnectionQuery) => DialogueConnectionQuery,
) => (
  server.use(
    graphql.query<DialogueConnectionQuery, DialogueConnectionQueryVariables>(
      'DialogueConnectionQuery',
      (req, res, ctx) => res(ctx.data(createResponse(DialogueConnectionResponse))),
    ),
  )
);
