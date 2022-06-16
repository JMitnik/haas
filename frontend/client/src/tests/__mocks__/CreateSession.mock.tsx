/**
 * Mock: CreateSessionMockMutation
 *
 * Origin: Create any session.
 */
import { graphql } from 'msw';

import { CreateSessionMutation, CreateSessionMutationVariables } from 'types/generated-types';
import { server } from 'tests/setup/server';

// eslint-disable-next-line
export const CreateSessionMockResponse: CreateSessionMutation = JSON.parse('{"createSession":{"id":"TEST_SESSION_1","__typename":"Session"}}');

export const mockMutationCreateSessionMock = (
  createResponse: (res: CreateSessionMutation) => CreateSessionMutation,
) => (
  server.use(
    graphql.mutation<CreateSessionMutation, CreateSessionMutationVariables>(
      'createSession',
      (req, res, ctx) => res(ctx.data(createResponse(CreateSessionMockResponse))),
    ),
  )
);
