/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

import QuestionFragment from './QuestionFragment';

export const getTopicBuilderQuery = gql`
  query getTopicBuilder ($customerSlug: String!, $dialogueSlug: String!) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        title
        publicTitle
        creationDate
        updatedAt
        leafs {
            id
            title
            type
        }
        questions {
          ...QuestionFragment
        }
      }
    }
  }

  ${QuestionFragment}
`;

export default getTopicBuilderQuery;
