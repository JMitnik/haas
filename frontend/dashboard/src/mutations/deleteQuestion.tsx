import gql from 'graphql-tag';

const deleteQuestionMutation = gql`
  mutation deleteQuestion($id: String!, $customerSlug: String!, $dialogueSlug: String!) {
    deleteQuestion(
      id: $id,
      customerSlug: $customerSlug,
      dialogueSlug: $dialogueSlug) {
        id
    }
  }
`;

export default deleteQuestionMutation;
