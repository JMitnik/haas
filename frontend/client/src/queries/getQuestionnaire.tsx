import gql from 'graphql-tag';
import { CustomerFragment } from './CustomerFragment';

export const getQuestionnaireQuery = gql`
  query getQuestionnaire ($id: ID) {
    questionnaire(where: { id: $id }) {
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
      customer {
          ...CustomerFragment
      }
      questions {
        id
        title
        overrideLeaf {
          id
        }
        questionType
        edgeChildren {
          id
          conditions {
            conditionType
            matchValue
            renderMin
            renderMax
          }
          parentNode {
            id
            title
          }
          childNode {
            id
            title
          }
        }
        options {
            value
            publicValue
        }
      }
    }
  }
  ${CustomerFragment}
`;
