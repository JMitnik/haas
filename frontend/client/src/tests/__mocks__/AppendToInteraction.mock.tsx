/**
 * Mock: AppendToInteractionMutation
 *
 * Origin: Description of how the mock was created
 */
import { mockMutation } from 'tests/setup/setupGraphQL';

import { AppendToInteractionMutation } from 'types/generated-types';

// eslint-disable-next-line
export const AppendToInteractionResponse: AppendToInteractionMutation = JSON.parse('{"appendToInteraction":{"id":"TEST_SESSION_1","__typename":"Session"}}');

export const mockMutationAppendToInteraction = (
  createResponse: (res: AppendToInteractionMutation) => AppendToInteractionMutation,
) => (
  mockMutation('appendToInteraction', createResponse(AppendToInteractionResponse))
);
