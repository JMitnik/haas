import { gql } from '@apollo/client';

const deleteQuestionMutation = gql`
  mutation deleteQuestion($input: DeleteNodeInputType) {
    deleteQuestion(input: $input) {
        id
    }
  }
`;

export default deleteQuestionMutation;
