import { graphql } from 'msw';
import { server } from 'test';

import {
  DialogueConnectionQuery,
  DialogueConnectionQueryVariables,
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
