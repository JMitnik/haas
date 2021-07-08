import { gql } from '@apollo/client';

const getQuestionNodeQuery = gql`
  query getQuestionNode($id: String!) {
    questionNode(where: { id: $id }) {
      id
      title
      type
      sliderNode {
        id
        happyText
        unhappyText
        markers {
          id
          label
          subLabel
          range {
            id
            start
            end
          }
        }
      }
    }
  }
`;

export default getQuestionNodeQuery;
