import gql from 'graphql-tag';

const createTriggerMutation = gql`
  mutation createTrigger(
      $customerSlug: String!,
      $trigger: TriggerInputType,
      $recipients: RecipientsInputType,
    ) {
    createTrigger(customerSlug: $customerSlug, trigger: $trigger, recipients: $recipients) {
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
