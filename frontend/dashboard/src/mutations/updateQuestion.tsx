import gql from 'graphql-tag';

const updateQuestionMutation = gql`
  mutation updateQuestion($id: String!, $title: String!, $type: String!, $overrideLeafId: String!, $edgeId: String!, $optionEntries: OptionsInputType, $edgeCondition: EdgeConditionInputType) {
    updateQuestion(
      id: $id, 
      title: $title, 
      type: $type, 
      overrideLeafId: $overrideLeafId, 
      edgeId: $edgeId, 
      optionEntries: $optionEntries, 
      edgeCondition: $edgeCondition) {
        id
    }
  }
`;

export default updateQuestionMutation;
