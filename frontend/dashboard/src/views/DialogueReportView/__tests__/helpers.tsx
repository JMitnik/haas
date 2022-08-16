import { graphql } from 'msw';

import { GetWorkspaceReport, GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables } from 'types/generated-types';
import { server } from 'test';

const GetWorkspaceReportRespone = JSON.parse()

export const mockGetWorkspaceReportQuery = (
  createResponse: (res: GetWorkspaceReportQuery) => GetWorkspaceReportQuery,
) => (
  server.use(
    graphql.query<GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables>(
      'DialogueConnectionQuery',
      (req, res, ctx) => res(ctx.data(createResponse(DialogueConnectionResponse))),
    ),
  )
);
