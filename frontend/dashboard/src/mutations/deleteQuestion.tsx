import gql from 'graphql-tag';

const deleteQuestionMutation = gql`
  mutation deleteQuestion($input: DeleteNodeInputType) {
    deleteQuestion(input: $input) {
        id
    }
  }
`;

export default deleteQuestionMutation;
