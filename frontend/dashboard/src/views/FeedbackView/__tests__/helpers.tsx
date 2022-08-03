import { graphql } from 'msw';
import { server } from 'test';

import {
  DialogueConnectionQuery,
  DialogueConnectionQueryVariables,
  GetCustomerOfUserQuery,
  GetCustomerOfUserQueryVariables,
  GetInteractionQuery,
  GetInteractionQueryVariables,
  GetWorkspaceDialogueStatisticsQuery,
  GetWorkspaceDialogueStatisticsQueryVariables,
  GetWorkspaceLayoutDetailsQuery,
  GetWorkspaceLayoutDetailsQueryVariables,
  GetWorkspaceSessionsQuery,
  GetWorkspaceSessionsQueryVariables,
  SystemPermission,
} from 'types/generated-types';

export const getCustomerOfUserResponse: GetCustomerOfUserQuery = {
  UserOfCustomer: {
    customer: {
      id: 'cl1vs0dd10002xczgbx999ehj',
      isDemo: false,
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
export const DialogueConnectionResponse: DialogueConnectionQuery = JSON.parse('{"customer":{"id":"cl33hcozt1145hh3qqwiki7ga","slug":"club-hades","dialogueConnection":{"totalPages":3,"pageInfo":{"hasPrevPage":false,"hasNextPage":true,"prevPageOffset":0,"nextPageOffset":9,"pageIndex":0,"__typename":"PaginationPageInfo"},"dialogues":[{"id":"cl33hcw1z11759hh3q8wvtkxns","title":"Female - U18 - Team3","isPrivate":false,"language":"ENGLISH","slug":"Female-U18-Team3","publicTitle":null,"creationDate":"1652388346439","updatedAt":"1652388346723","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":74.4,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcvr611301hh3qsq28ptt3","title":"Female - U18 - Team2","isPrivate":false,"language":"ENGLISH","slug":"Female-U18-Team2","publicTitle":null,"creationDate":"1652388346050","updatedAt":"1652388346339","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":76.8,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcvgn10840hh3qkpvm17sx","title":"Female - U18 - Team1","isPrivate":false,"language":"ENGLISH","slug":"Female-U18-Team1","publicTitle":null,"creationDate":"1652388345671","updatedAt":"1652388345949","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":76.4,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcv5x10384hh3qvswjl4av","title":"Female - U16 - Team3","isPrivate":false,"language":"ENGLISH","slug":"Female-U16-Team3","publicTitle":null,"creationDate":"1652388345285","updatedAt":"1652388345576","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":74.2,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcuvj9926hh3qwubvkns2","title":"Female - U16 - Team2","isPrivate":false,"language":"ENGLISH","slug":"Female-U16-Team2","publicTitle":null,"creationDate":"1652388344911","updatedAt":"1652388345185","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":73.6,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcukx9466hh3q7nveh65g","title":"Female - U16 - Team1","isPrivate":false,"language":"ENGLISH","slug":"Female-U16-Team1","publicTitle":null,"creationDate":"1652388344529","updatedAt":"1652388344805","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":74,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hcua59007hh3qapw3nkfr","title":"Female - U12 - Team3","isPrivate":false,"language":"ENGLISH","slug":"Female-U12-Team3","publicTitle":null,"creationDate":"1652388344141","updatedAt":"1652388344420","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":75.4,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hctzs8546hh3qsadmrrjx","title":"Female - U12 - Team2","isPrivate":false,"language":"ENGLISH","slug":"Female-U12-Team2","publicTitle":null,"creationDate":"1652388343768","updatedAt":"1652388344047","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":76,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"},{"id":"cl33hctpr8086hh3q953twf0z","title":"Female - U12 - Team1","isPrivate":false,"language":"ENGLISH","slug":"Female-U12-Team1","publicTitle":null,"creationDate":"1652388343407","updatedAt":"1652388343670","customerId":"cl33hcozt1145hh3qqwiki7ga","averageScore":75.6,"customer":{"slug":"club-hades","__typename":"Customer"},"tags":[],"__typename":"Dialogue"}],"__typename":"DialogueConnection"},"__typename":"Customer"}}')

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

// eslint-disable-next-line @typescript-eslint/quotes
export const getWorkspaceSessionsResponse: GetWorkspaceSessionsQuery = JSON.parse(`{"customer":{"id":"cl6c5wuic0011ceoikhazc11k","sessionConnection":{"sessions":[{"id":"cl6c5x1rb20137ceoi4userakb","createdAt":1659443674137,"score":79,"originUrl":"","totalTimeInSec":42,"device":null,"dialogueId":"cl6c5x1gn19352ceoigbgcu6ed","nodeEntries":[{"id":"cl6c5x1rb20138ceoimzdw3py4","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":79,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5x1rb20139ceoi344rjwrj","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Physical & Mental","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5x1gn19352ceoigbgcu6ed","title":"Female - U18 - Team3","slug":"Female-U18-Team3","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5x1g119301ceoi3je44n76","createdAt":1659443673724,"score":75,"originUrl":"","totalTimeInSec":18,"device":null,"dialogueId":"cl6c5x15n18509ceoib482289w","nodeEntries":[{"id":"cl6c5x1g119302ceoi85o7gacu","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":75,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5x1g219303ceoij92v9o6i","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"School","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5x15n18509ceoib482289w","title":"Female - U18 - Team2","slug":"Female-U18-Team2","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5x15418459ceoivao4arif","createdAt":1659443673331,"score":76,"originUrl":"","totalTimeInSec":24,"device":null,"dialogueId":"cl6c5x0ug17672ceoins29hw4c","nodeEntries":[{"id":"cl6c5x15418460ceoin1q2oa5q","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":76,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5x15418461ceoix473i2kt","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Team Members","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5x0ug17672ceoins29hw4c","title":"Female - U18 - Team1","slug":"Female-U18-Team1","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5x0ty17621ceoik59w58g4","createdAt":1659443672930,"score":80,"originUrl":"","totalTimeInSec":13,"device":null,"dialogueId":"cl6c5x0jn16835ceoiooclcz9b","nodeEntries":[{"id":"cl6c5x0ty17622ceoip4zlkp27","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":80,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5x0ty17623ceoi2x1v7yiq","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Team Members","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5x0jn16835ceoiooclcz9b","title":"Female - U16 - Team3","slug":"Female-U16-Team3","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5x0j516784ceoia0n8b7f4","createdAt":1659443672545,"score":76,"originUrl":"","totalTimeInSec":42,"device":null,"dialogueId":"cl6c5x08t15998ceoie1go392g","nodeEntries":[{"id":"cl6c5x0j516785ceoih7brs5nm","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":76,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5x0j516786ceoietqgmv0g","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Home","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5x08t15998ceoie1go392g","title":"Female - U16 - Team2","slug":"Female-U16-Team2","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5x07v15948ceoix09ofpa7","createdAt":1659443672134,"score":70,"originUrl":"","totalTimeInSec":40,"device":null,"dialogueId":"cl6c5wzw815159ceoim3sbmak9","nodeEntries":[{"id":"cl6c5x07v15949ceoicl6zvdi7","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":70,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5x07v15950ceoia9kh05ll","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Coaching","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5wzw815159ceoim3sbmak9","title":"Female - U16 - Team1","slug":"Female-U16-Team1","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5wzvo15109ceoif8ivygg1","createdAt":1659443671695,"score":73,"originUrl":"","totalTimeInSec":35,"device":null,"dialogueId":"cl6c5wzjd14321ceoicm5j0dtz","nodeEntries":[{"id":"cl6c5wzvo15110ceoimqmx9pup","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":73,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5wzvo15111ceoit2c98lej","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Physical & Mental","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5wzjd14321ceoicm5j0dtz","title":"Female - U12 - Team3","slug":"Female-U12-Team3","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5wzis14270ceoiwdpz8mik","createdAt":1659443671233,"score":72,"originUrl":"","totalTimeInSec":4,"device":null,"dialogueId":"cl6c5wz7213484ceoiitmj2k24","nodeEntries":[{"id":"cl6c5wzis14271ceoi39yjc073","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":72,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5wzis14272ceoisb5v3n6y","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Physical & Mental","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5wz7213484ceoiitmj2k24","title":"Female - U12 - Team2","slug":"Female-U12-Team2","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5wz6i13432ceoib4t0zqez","createdAt":1659443670791,"score":80,"originUrl":"","totalTimeInSec":28,"device":null,"dialogueId":"cl6c5wyvx12644ceoioeq956zi","nodeEntries":[{"id":"cl6c5wz6i13433ceoig6tue789","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":80,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5wz6i13434ceoi0kl51z0p","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Team Members","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5wyvx12644ceoioeq956zi","title":"Female - U12 - Team1","slug":"Female-U12-Team1","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"},{"id":"cl6c5wyv612593ceoi6ffasbcf","createdAt":1659443670384,"score":74,"originUrl":"","totalTimeInSec":10,"device":null,"dialogueId":"cl6c5wyls11807ceoi0tyama81","nodeEntries":[{"id":"cl6c5wyv612594ceoi0poygd33","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":74,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5wyv612595ceoiok1yqa5n","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"Coaching","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5wyls11807ceoi0tyama81","title":"Female - U8 - Team3","slug":"Female-U8-Team3","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"}],"totalPages":5,"pageInfo":{"hasPrevPage":false,"hasNextPage":true,"nextPageOffset":10,"prevPageOffset":0,"pageIndex":0,"__typename":"PaginationPageInfo"},"__typename":"SessionConnection"},"__typename":"Customer"}}`);

export const mockGetWorkspaceSessionsResponse = (
  createResponse: (res: GetWorkspaceSessionsQuery) => GetWorkspaceSessionsQuery,
) => (
  server.use(
    graphql.query<GetWorkspaceSessionsQuery, GetWorkspaceSessionsQueryVariables>(
      'GetWorkspaceSessions',
      (req, res, ctx) => res(ctx.data(createResponse(getWorkspaceSessionsResponse))),
    ),
  )
);

// eslint-disable-next-line @typescript-eslint/quotes, max-len
export const getWorkspaceLayoutDetailsResponse: GetWorkspaceLayoutDetailsQuery = JSON.parse('{"customer":{"id":"cl6c5wuic0011ceoikhazc11k","statistics":{"id":"cl6c5wuic0011ceoikhazc11k","health":{"nrVotes":48,"negativeResponseCount":0,"score":100,"__typename":"HealthScore"},"__typename":"WorkspaceStatistics"},"__typename":"Customer"}}');

export const mockGetWorkspaceLayoutDetailsResponse = (
  createResponse: (res: GetWorkspaceLayoutDetailsQuery) => GetWorkspaceLayoutDetailsQuery,
) => (
  server.use(
    graphql.query<GetWorkspaceLayoutDetailsQuery, GetWorkspaceLayoutDetailsQueryVariables>(
      'GetWorkspaceLayoutDetails',
      (req, res, ctx) => res(ctx.data(createResponse(getWorkspaceLayoutDetailsResponse))),
    ),
  )
);

// eslint-disable-next-line @typescript-eslint/quotes
export const getInteractionResponse: GetInteractionQuery = JSON.parse(`{"session":{"id":"cl6c5x1g119301ceoi3je44n76","createdAt":1659443673724,"score":75,"originUrl":"","totalTimeInSec":18,"device":null,"dialogueId":"cl6c5x15n18509ceoib482289w","nodeEntries":[{"id":"cl6c5x1g119302ceoi85o7gacu","depth":0,"relatedNode":{"title":"How are you feeling?","type":"SLIDER","__typename":"QuestionNode"},"value":{"sliderNodeEntry":75,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":null,"videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"},{"id":"cl6c5x1g219303ceoij92v9o6i","depth":1,"relatedNode":{"title":"What's going well?","type":"CHOICE","__typename":"QuestionNode"},"value":{"sliderNodeEntry":null,"textboxNodeEntry":null,"registrationNodeEntry":null,"choiceNodeEntry":"School","videoNodeEntry":null,"linkNodeEntry":null,"formNodeEntry":null,"__typename":"NodeEntryValue"},"__typename":"NodeEntry"}],"delivery":null,"dialogue":{"id":"cl6c5x15n18509ceoib482289w","title":"Female - U18 - Team2","slug":"Female-U18-Team2","__typename":"Dialogue"},"followUpAction":null,"__typename":"Session"}}`);

export const mockGetInteractionResponse = (
  createResponse: (res: GetInteractionQuery) => GetInteractionQuery,
) => (
  server.use(
    graphql.query<GetInteractionQuery, GetInteractionQueryVariables>(
      'GetInteraction',
      (req, res, ctx) => res(ctx.data(createResponse(getInteractionResponse))),
    ),
  )
);
