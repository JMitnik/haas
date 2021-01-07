import { gql } from '@apollo/client';

const updateQuestionMutation = gql`
  mutation updateQuestion($input: UpdateQuestionNodeInputType) {
    updateQuestion(input: $input) {
        id
    }
  }
`;

export default updateQuestionMutation;
