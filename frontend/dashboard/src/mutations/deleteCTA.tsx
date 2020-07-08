import gql from 'graphql-tag';

const deleteCTA = gql`
  mutation deleteCTA($id: String!) {
    deleteCTA( id: $id ) {
      id
    }
}
`;

export default deleteCTA;
