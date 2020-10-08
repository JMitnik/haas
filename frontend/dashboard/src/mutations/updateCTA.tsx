import gql from 'graphql-tag';

const updateCTAMutation = gql`
  mutation updateCTA($input: UpdateCTAInputType) {
    updateCTA(input: $input) {
        id
    }
  }
`;

export default updateCTAMutation;
