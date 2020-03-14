/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const createNewQuestionnaire = gql`
  mutation createNewCustomer($customerId: String, $title: String, $description: String, $publicTitle: String, $isSeed: Boolean) {
    createNewQuestionnaire(customerId: $customerId, title: $title, description: $description, publicTitle: $publicTitle, isSeed: $isSeed) {
        title
      }
  }
`;
