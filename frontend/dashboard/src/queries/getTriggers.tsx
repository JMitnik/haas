import gql from 'graphql-tag';

const getTriggersQuery = gql`
  query getTriggers($customerId: String, $userId: String, $filter: FilterInput) {
    triggers(customerId: $customerId, userId: $userId, , filter: $filter) {
        id
        name
        medium
        type
        conditions {
            id
            type
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

export default getTriggersQuery;
