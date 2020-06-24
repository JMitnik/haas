import gql from 'graphql-tag';

const editDialogueMutation = gql`
  mutation editDialogue($dialogueId: String, $title: String, $description: String, $publicTitle: String, $tags: TagsInputObjectType) {
    editDialogue(dialogueId: $dialogueId, title: $title, description: $description, publicTitle: $publicTitle, tags: $tags) {
        title
      }
  }
`;

export default editDialogueMutation;
