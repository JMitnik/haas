/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';
import QuestionFragment from './QuestionFragment';

export const getTopicBuilderQuery = gql`
  query getTopicBuilder ($topicId: ID!) {
    dialogue(where: { id: $topicId }) {
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

  ${QuestionFragment}
`;

export default getTopicBuilderQuery;
