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
export const getWorkspaceDialogueStatisticsResponse: GetWorkspaceDialogueStatisticsQuery = JSON.parse('{"customer":{"dialogues":[{"id":"cl33hcp1p1211hh3qjjjqrtgm","title":"Male - U8 - Team1","dialogueStatisticsSummary":{"id":"cl33hczsy12452hh3qdehti30s","dialogueId":"cl33hcp1p1211hh3qjjjqrtgm","impactScore":75.6,"nrVotes":5,"updatedAt":1652388351298,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcpgt1672hh3qz3f3vd8r","title":"Male - U8 - Team2","dialogueStatisticsSummary":{"id":"cl33hcztk12472hh3qk1grh1d8","dialogueId":"cl33hcpgt1672hh3qz3f3vd8r","impactScore":74.4,"nrVotes":5,"updatedAt":1652388351320,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcps52131hh3q32vg7i3g","title":"Male - U8 - Team3","dialogueStatisticsSummary":{"id":"cl33hczu312483hh3qapv6fd20","dialogueId":"cl33hcps52131hh3q32vg7i3g","impactScore":76.2,"nrVotes":5,"updatedAt":1652388351339,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcq342587hh3qvm214cdj","title":"Male - U12 - Team1","dialogueStatisticsSummary":{"id":"cl33hczu312491hh3q4a1szh10","dialogueId":"cl33hcq342587hh3qvm214cdj","impactScore":76.2,"nrVotes":5,"updatedAt":1652388351340,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcqe23046hh3q73dy294i","title":"Male - U12 - Team2","dialogueStatisticsSummary":{"id":"cl33hczun12516hh3qp4mq067m","dialogueId":"cl33hcqe23046hh3q73dy294i","impactScore":74.8,"nrVotes":5,"updatedAt":1652388351360,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcqop3503hh3q9vfel1g2","title":"Male - U12 - Team3","dialogueStatisticsSummary":{"id":"cl33hcztd12458hh3q3d947w6q","dialogueId":"cl33hcqop3503hh3q9vfel1g2","impactScore":74.4,"nrVotes":5,"updatedAt":1652388351313,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcqzr3960hh3qng0f5x20","title":"Male - U16 - Team1","dialogueStatisticsSummary":{"id":"cl33hczsu12448hh3qf2wa6ocd","dialogueId":"cl33hcqzr3960hh3qng0f5x20","impactScore":75.6,"nrVotes":5,"updatedAt":1652388351295,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcrax4416hh3qw5mt7ljn","title":"Male - U16 - Team2","dialogueStatisticsSummary":{"id":"cl33hczu412493hh3q7yemgxi7","dialogueId":"cl33hcrax4416hh3qw5mt7ljn","impactScore":74.2,"nrVotes":5,"updatedAt":1652388351341,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcrm54874hh3qxvxmmwsb","title":"Male - U16 - Team3","dialogueStatisticsSummary":{"id":"cl33hcztk12473hh3qdnpuflbt","dialogueId":"cl33hcrm54874hh3qxvxmmwsb","impactScore":75.8,"nrVotes":5,"updatedAt":1652388351321,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcrwr5333hh3qzx2vyp65","title":"Male - U18 - Team1","dialogueStatisticsSummary":{"id":"cl33hczsg12444hh3qwoivib9d","dialogueId":"cl33hcrwr5333hh3qzx2vyp65","impactScore":74,"nrVotes":5,"updatedAt":1652388351281,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcs715793hh3qe6oahwfu","title":"Male - U18 - Team2","dialogueStatisticsSummary":{"id":"cl33hcztj12471hh3qd7c7u8wl","dialogueId":"cl33hcs715793hh3qe6oahwfu","impactScore":76.2,"nrVotes":5,"updatedAt":1652388351320,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcshn6253hh3qmaol5wuf","title":"Male - U18 - Team3","dialogueStatisticsSummary":{"id":"cl33hcztf12463hh3qx4b9vq4d","dialogueId":"cl33hcshn6253hh3qmaol5wuf","impactScore":76.4,"nrVotes":5,"updatedAt":1652388351315,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcssw6713hh3qr2685t52","title":"Female - U8 - Team1","dialogueStatisticsSummary":{"id":"cl33hcztd12460hh3q7txv3hcc","dialogueId":"cl33hcssw6713hh3qr2685t52","impactScore":72.8,"nrVotes":5,"updatedAt":1652388351314,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hct3z7170hh3qu4ss3x9u","title":"Female - U8 - Team2","dialogueStatisticsSummary":{"id":"cl33hczwl12681hh3q4twow0gu","dialogueId":"cl33hct3z7170hh3qu4ss3x9u","impactScore":74.4,"nrVotes":5,"updatedAt":1652388351430,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcten7628hh3qcas0ux88","title":"Female - U8 - Team3","dialogueStatisticsSummary":{"id":"cl33hczvw12637hh3quhryqwuf","dialogueId":"cl33hcten7628hh3qcas0ux88","impactScore":76.4,"nrVotes":5,"updatedAt":1652388351405,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hctpr8086hh3q953twf0z","title":"Female - U12 - Team1","dialogueStatisticsSummary":{"id":"cl33hczwi12676hh3q61bhic7d","dialogueId":"cl33hctpr8086hh3q953twf0z","impactScore":75.6,"nrVotes":5,"updatedAt":1652388351427,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hctzs8546hh3qsadmrrjx","title":"Female - U12 - Team2","dialogueStatisticsSummary":{"id":"cl33hczv912570hh3q66e68utr","dialogueId":"cl33hctzs8546hh3qsadmrrjx","impactScore":76,"nrVotes":5,"updatedAt":1652388351382,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcua59007hh3qapw3nkfr","title":"Female - U12 - Team3","dialogueStatisticsSummary":{"id":"cl33hczvz12643hh3qh1vpx93v","dialogueId":"cl33hcua59007hh3qapw3nkfr","impactScore":75.4,"nrVotes":5,"updatedAt":1652388351408,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcukx9466hh3q7nveh65g","title":"Female - U16 - Team1","dialogueStatisticsSummary":{"id":"cl33hczv512552hh3qsfb0kf5q","dialogueId":"cl33hcukx9466hh3q7nveh65g","impactScore":74,"nrVotes":5,"updatedAt":1652388351378,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcuvj9926hh3qwubvkns2","title":"Female - U16 - Team2","dialogueStatisticsSummary":{"id":"cl33hczug12502hh3qnv2hzc5b","dialogueId":"cl33hcuvj9926hh3qwubvkns2","impactScore":73.6,"nrVotes":5,"updatedAt":1652388351353,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcv5x10384hh3qvswjl4av","title":"Female - U16 - Team3","dialogueStatisticsSummary":{"id":"cl33hczw112653hh3q4hfezewd","dialogueId":"cl33hcv5x10384hh3qvswjl4av","impactScore":74.2,"nrVotes":5,"updatedAt":1652388351410,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcvgn10840hh3qkpvm17sx","title":"Female - U18 - Team1","dialogueStatisticsSummary":{"id":"cl33hczvx12639hh3qzqxkh027","dialogueId":"cl33hcvgn10840hh3qkpvm17sx","impactScore":76.4,"nrVotes":5,"updatedAt":1652388351406,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcvr611301hh3qsq28ptt3","title":"Female - U18 - Team2","dialogueStatisticsSummary":{"id":"cl33hczu112479hh3qrreltyaj","dialogueId":"cl33hcvr611301hh3qsq28ptt3","impactScore":76.8,"nrVotes":5,"updatedAt":1652388351338,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"},{"id":"cl33hcw1z11759hh3q8wvtkxns","title":"Female - U18 - Team3","dialogueStatisticsSummary":{"id":"cl33hczu512495hh3qrfbbmtu0","dialogueId":"cl33hcw1z11759hh3q8wvtkxns","impactScore":74.4,"nrVotes":5,"updatedAt":1652388351342,"__typename":"DialogueStatisticsSummaryModel"},"__typename":"Dialogue"}],"__typename":"Customer"}}')
export const dialogues = getWorkspaceDialogueStatisticsResponse.customer?.dialogues as Dialogue[];

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
