/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const deleteQuestionnaireMutation = gql`
mutation deleteQuestionnaire($id: ID!) {
  deleteQuestionnaire(where: {
    id: $id
  }) {
    id
  }
}
`;
