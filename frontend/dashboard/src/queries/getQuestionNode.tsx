import gql from 'graphql-tag';

const getQuestionNodeQuery = gql`
  query getQuestionNode($id: String!) {
    questionNode(where: { id: $id }) {
      id
      title
      type
    }
  }
`;

export default getQuestionNodeQuery;
