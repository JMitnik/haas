import { gql } from '@apollo/client';

const deleteCTA = gql`
  mutation deleteCTA($input: DeleteNodeInputType) {
    deleteCTA(input: $input) {
      id
    }
}
`;

export default deleteCTA;
