import { gql } from '@apollo/client';

const getTriggerQuery = gql`
  query getTrigger($id: String!) {
    trigger(triggerId: $id) {
      id
      name
      medium
      type
      relatedDialogue {
        slug
        title
      }
      conditions {
          id
          type
          minValue
          maxValue
          textValue
          question {
            title
            id
          }
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

export default getTriggerQuery;
