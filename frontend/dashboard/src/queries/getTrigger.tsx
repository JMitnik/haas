import gql from 'graphql-tag';

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
          questionId
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

export default getTriggerQuery;
