/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const deleteDialogueMutation = gql`
mutation deleteDialogue($input: DeleteDialogueInputType) {
  deleteDialogue(input: $input) {
    id
  }
}
`;
