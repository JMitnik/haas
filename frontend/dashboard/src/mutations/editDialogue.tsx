import { gql } from '@apollo/client';

const editDialogueMutation = gql`
  mutation editDialogue($customerSlug: String, $dialogueSlug: String, $title: String, $description: String, $publicTitle: String, $tags: TagsInputObjectType, $isWithoutGenData: Boolean, $language: LanguageEnumType) {
    editDialogue(customerSlug: $customerSlug, dialogueSlug: $dialogueSlug, title: $title, description: $description, publicTitle: $publicTitle, tags: $tags, isWithoutGenData: $isWithoutGenData, language: $language) {
        title
      }
  }
`;

export default editDialogueMutation;
