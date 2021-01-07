import { gql } from '@apollo/client';

const updateCTAMutation = gql`
  mutation updateCTA($input: UpdateCTAInputType) {
    updateCTA(input: $input) {
        id
    }
  }
`;

export default updateCTAMutation;
