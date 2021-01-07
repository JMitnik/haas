import { gql } from '@apollo/client';

const createQuestionMutation = gql`
  mutation createQuestion($input: CreateQuestionNodeInputType!) {
    createQuestion(input: $input) {
        id
    }
  }
`;

export default createQuestionMutation;
