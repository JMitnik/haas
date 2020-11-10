import gql from 'graphql-tag';

const editTriggerMutation = gql`
  mutation editTrigger(
      $triggerId: String!, 
      $trigger: TriggerInputType,
      $recipients: RecipientsInputType,
     ) {
    editTrigger(triggerId: $triggerId, trigger: $trigger, recipients: $recipients) {
        id
        name
        medium
        type
        conditions {
            id
            minValue
            maxValue
            textValue
        }
        recipients {
            id
            firstName
            lastName
            phone
            email
        }
    }
  }
`;

export default editTriggerMutation;
