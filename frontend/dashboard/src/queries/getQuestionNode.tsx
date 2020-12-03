import gql from 'graphql-tag';

const getQuestionNodeQuery = gql`
  query getQuestionNode($id: String!) {
    questionNode(where: { id: $id }) {
      id
      title
      type
      sliderNode {
        id
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
