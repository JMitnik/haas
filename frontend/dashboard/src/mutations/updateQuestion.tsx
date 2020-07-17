import gql from 'graphql-tag';

const updateQuestionMutation = gql`
  mutation updateQuestion($id: String!, $title: String!, $type: String!, $overrideLeafId: String!, $edgeId: String!, $options: OptionsInputType, $edgeCondition: EdgeConditionInputType) {
    updateQuestion(
      id: $id, 
      title: $title, 
      type: $type, 
      overrideLeafId: $overrideLeafId, 
      edgeId: $edgeId, 
      options: $options, 
      edgeCondition: $edgeCondition) {
        id
    }
  }
`;

export default updateQuestionMutation;
