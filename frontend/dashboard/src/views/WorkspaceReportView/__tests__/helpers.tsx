/* eslint-disable max-len */

import { GetProblemsPerDialogueQuery, GetProblemsPerDialogueQueryVariables, GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables } from 'types/generated-types';
import { graphql, server } from 'test';

/**
 * Mock created by generating a workspace (Club Hades) based on Sports EN template.
 *
 * * TODO: No issues exist, we should add this to generated data seed.
 */
const GetWorkspaceReportRespone = JSON.parse('{"customer":{"id":"cl6v0w1ig02615w3qr5xzcoga","issueTopics":[],"statistics":{"basicStats":{"responseCount":24,"average":75.5,"__typename":"BasicStatistics"},"responseHistogram":{"id":"cl6v0w1ig02615w3qr5xzcoga-histogram","items":[{"id":"response-hist-2022-7-15","frequency":24,"date":1660584087690,"__typename":"DateHistogramItem"}],"__typename":"DateHistogram"},"issueHistogram":{"id":"cl6v0w1ig02615w3qr5xzcoga-issue-histogram","items":[],"__typename":"DateHistogram"},"__typename":"WorkspaceStatistics"},"__typename":"Customer"}}');

export const mockGetWorkspaceReportQuery = (
  createResponse: (res: GetWorkspaceReportQuery) => GetWorkspaceReportQuery,
) => (
  server.use(
    graphql.query<GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables>(
      'GetWorkspaceReport',
      (req, res, ctx) => res(ctx.data(createResponse(GetWorkspaceReportRespone))),
    ),
  )
);

/**
 * Mock created by generating a workspace (Club Hades) based on Sports EN template.
 *
 * TODO: No issues exist, we should add this to generated data seed.
 */
const GetIssuesResponse = JSON.parse('{"customer":{"id":"cl6v0w1ig02615w3qr5xzcoga","issues":[],"__typename":"Customer"}}');

export const mockGetProblemsPerDialogueQuery = (
  createResponse: (res: GetProblemsPerDialogueQuery) => GetProblemsPerDialogueQuery,
) => (
  server.use(
    graphql.query<GetProblemsPerDialogueQuery, GetProblemsPerDialogueQueryVariables>(
      'GetProblemsPerDialogue',
      (req, res, ctx) => res(ctx.data(createResponse(GetIssuesResponse))),
    ),
  )
);
