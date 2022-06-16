/**
 * Mock: AppendToInteractionMutation
 *
 * Origin: Description of how the mock was created
 */
import { graphql } from 'msw';
import { server } from 'tests/setup/server';

import { AppendToInteractionMutation, AppendToInteractionMutationVariables } from 'types/generated-types';

// eslint-disable-next-line
export const AppendToInteractionResponse: AppendToInteractionMutation = JSON.parse('{"appendToInteraction":{"id":"TEST_SESSION_1","__typename":"Session"}}');

export const mockMutationAppendToInteraction = (
  createResponse: (res: AppendToInteractionMutation) => AppendToInteractionMutation,
) => (
  server.use(
    graphql.mutation<AppendToInteractionMutation, AppendToInteractionMutationVariables>(
      'appendToInteraction',
      (req, res, ctx) => res(ctx.data(createResponse(AppendToInteractionResponse))),
    ),
  )
);
