import { gql } from '@apollo/client';

const deleteTriggerMutation = gql`
  mutation deleTrigger($id: String!) {
    deleteTrigger( id: $id ) {
      id
    }
}
`;

export default deleteTriggerMutation;
