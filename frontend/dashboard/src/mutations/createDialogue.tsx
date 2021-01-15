/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const createDialogue = gql`
  mutation createDialogue($input: CreateDialogueInputType) {
    createDialogue(input: $input) {
      id
      title
    }
  }
`;
