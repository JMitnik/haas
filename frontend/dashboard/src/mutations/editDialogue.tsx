import gql from 'graphql-tag';

const editDialogueMutation = gql`
  mutation editDialogue($customerSlug: String, $dialogueSlug: String, $title: String, $description: String, $publicTitle: String, $tags: TagsInputObjectType) {
    editDialogue(customerSlug: $customerSlug, dialogueSlug: $dialogueSlug, title: $title, description: $description, publicTitle: $publicTitle, tags: $tags) {
        title
      }
  }
`;

export default editDialogueMutation;
