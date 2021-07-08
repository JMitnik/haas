import { gql } from '@apollo/client';

const editDialogueMutation = gql`
  mutation editDialogue($customerSlug: String, $dialogueSlug: String, $title: String, $description: String, $publicTitle: String, $tags: TagsInputObjectType, $isWithoutGenData: Boolean, $language: LanguageEnumType, $dialogueFinisherHeading: String, $dialogueFinisherSubheading: String) {
    editDialogue(
      customerSlug: $customerSlug,
      dialogueSlug: $dialogueSlug,
      title: $title, description: $description,
      publicTitle: $publicTitle,
      tags: $tags,
      isWithoutGenData: $isWithoutGenData,
      language: $language,
      dialogueFinisherHeading: $dialogueFinisherHeading,
      dialogueFinisherSubheading: $dialogueFinisherSubheading,
      ) {
        title
      }
  }
`;

export default editDialogueMutation;
