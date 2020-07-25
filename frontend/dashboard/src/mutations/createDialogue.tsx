/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const createDialogue = gql`
  mutation createDialogue(
    $customerSlug: String, 
    $dialogueSlug: String, 
    $title: String, 
    $description: String, 
    $publicTitle: String, 
    $contentType: String,
    $templateDialogueId: String,
    $tags: TagsInputObjectType
  ) {
    createDialogue(data: {
      customerSlug: $customerSlug, 
      dialogueSlug: $dialogueSlug, 
      title: $title, 
      description: $description, 
      publicTitle: $publicTitle, 
      contentType: $contentType,
      templateDialogueId: $templateDialogueId,
      tags: $tags
    }) {
        id
        title
      }
  }
`;
