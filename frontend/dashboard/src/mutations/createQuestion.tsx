import gql from 'graphql-tag';

const createQuestionMutation = gql`
  mutation createQuestion($customerSlug: String!, $dialogueSlug: String!, $title: String!, $type: String!, $overrideLeafId: String!, $parentQuestionId: String!, $optionEntries: OptionsInputType, $edgeCondition: EdgeConditionInputType) {
    createQuestion(
      customerSlug: $customerSlug,
      dialogueSlug: $dialogueSlug,
      title: $title, 
      type: $type, 
      overrideLeafId: $overrideLeafId, 
      parentQuestionId: $parentQuestionId, 
      optionEntries: $optionEntries, 
      edgeCondition: $edgeCondition) {
        id
    }
  }
`;

export default createQuestionMutation;
