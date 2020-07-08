import gql from 'graphql-tag';

const updateCTAMutation = gql`
  mutation updateCTA($id: String!, $title: String!, $type: String!) {
    updateCTA(id: $id, title: $title, type: $type) {
        id
    }
  }
`;

export default updateCTAMutation;
