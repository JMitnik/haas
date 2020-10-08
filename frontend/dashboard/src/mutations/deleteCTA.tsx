import gql from 'graphql-tag';

const deleteCTA = gql`
  mutation deleteCTA($input: DeleteNodeInputType) {
    deleteCTA(input: $input) {
      id
    }
}
`;

export default deleteCTA;
