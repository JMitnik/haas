import { gql } from '@apollo/client';

const cloneQuestionMutation = gql`
  mutation cloneQuestion($questionId: String) {
    cloneQuestion(questionId: $questionId) {
        id
    }
  }
`;

export default cloneQuestionMutation;
