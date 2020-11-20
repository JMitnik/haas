import gql from 'graphql-tag';

const createTriggerMutation = gql`
  mutation createTrigger(
      $input: CreateTriggerInputType,
    ) {
    createTrigger(input: $input) {
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
