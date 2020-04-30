/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const deleteQuestionnaireMutation = gql`
mutation deleteDialogue($id: ID!) {
  deleteDialogue(where: {
    id: $id
  }) {
    id
  }
}
`;
