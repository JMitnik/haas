import gql from 'graphql-tag';

const createTriggerMutation = gql`
  mutation createTrigger(
      $customerId: String!,
      $questionId: String,
      $trigger: TriggerInputType,
      $recipients: RecipientsInputType,
    ) {
    createTrigger(customerId: $customerId, questionId: $questionId, trigger: $trigger, recipients: $recipients) {
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

export default createTriggerMutation;
