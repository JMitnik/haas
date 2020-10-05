import gql from 'graphql-tag';

const createCTAMutation = gql`
  mutation createCTA($input: CreateCTAInputType) {
    createCTA(input: $input) {
        id
    }
  }
`;

export default createCTAMutation;
