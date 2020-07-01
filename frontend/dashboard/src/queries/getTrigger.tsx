import gql from 'graphql-tag';

const getTriggerQuery = gql`
  query getTrigger($id: String!) {
    trigger(triggerId: $id) {
      id
      name
      medium
      type
      relatedNode {
        id
        title
        questionDialogueId
        questionDialogue {
          slug
        }
      }
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

export default getTriggerQuery;
