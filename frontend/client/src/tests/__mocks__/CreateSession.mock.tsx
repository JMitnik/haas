/**
 * Mock: CreateSessionMockMutation
 *
 * Origin: Create any session.
 */

import { CreateSessionMutation } from 'types/generated-types';
import { mockMutation } from 'tests/setup/setupGraphQL';

// eslint-disable-next-line
export const CreateSessionMockResponse: CreateSessionMutation = JSON.parse('{"createSession":{"id":"TEST_SESSION_1","__typename":"Session"}}');

export const mockMutationCreateSessionMock = (
  createResponse: (res: CreateSessionMutation) => CreateSessionMutation,
) => (
  mockMutation('createSession', createResponse(CreateSessionMockResponse))
);
