/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const createDialogue = gql`
  mutation createDialogue($input: CreateDialogueInputType) {
    createDialogue(input: $input) {
      id
      title
    }
  }
`;
