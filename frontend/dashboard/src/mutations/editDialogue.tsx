import gql from 'graphql-tag';

const editDialogueMutation = gql`
  mutation editDialogue($dialogueId: String, $title: String, $description: String, $publicTitle: String) {
    editDialogue(dialogueId: $dialogueId, title: $title, description: $description, publicTitle: $publicTitle) {
        title
      }
  }
`;

export default editDialogueMutation;
