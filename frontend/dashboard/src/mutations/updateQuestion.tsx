import gql from 'graphql-tag';

const updateQuestionMutation = gql`
  mutation updateQuestion($input: UpdateQuestionNodeInputType) {
    updateQuestion(input: $input) {
        id
    }
  }
`;

export default updateQuestionMutation;
