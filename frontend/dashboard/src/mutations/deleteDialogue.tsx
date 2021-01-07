/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const deleteDialogueMutation = gql`
mutation deleteDialogue($input: DeleteDialogueInputType) {
  deleteDialogue(input: $input) {
    id
  }
}
`;
