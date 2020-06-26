import gql from 'graphql-tag';

const deleteTriggerMutation = gql`
  mutation deleTrigger($id: String!) {
    deleteTrigger( id: $id ) {
      id
    }
}
`;

export default deleteTriggerMutation;
