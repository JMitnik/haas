import { gql } from '@apollo/client';

const createCTAMutation = gql`
  mutation createCTA($input: CreateCTAInputType) {
    createCTA(input: $input) {
        id
    }
  }
`;

export default createCTAMutation;