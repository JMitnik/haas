import gql from 'graphql-tag';

const getEditDialogueQuery = gql`
  query getEditDialogue($id: ID!) {
    dialogue(where: { id: $id }) {
        id
        title
        publicTitle
        description
      }
  }
`;

export default getEditDialogueQuery;
