import gql from 'graphql-tag';

const updateCTAMutation = gql`
  mutation updateCTA($input: UpdateCTAInpuType) {
    updateCTA(input: $input) {
        id
    }
  }
`;

export default updateCTAMutation;
