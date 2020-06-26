/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const createDialogue = gql`
  mutation createDialogue(
    $customerSlug: String, 
    $dialogueSlug: String, 
    $title: String, 
    $description: String, 
    $publicTitle: String, 
    $isSeed: Boolean,
    $tags: TagsInputObjectType
  ) {
    createDialogue(data: {
      customerSlug: $customerSlug, 
      dialogueSlug: $dialogueSlug, 
      title: $title, 
      description: $description, 
      publicTitle: $publicTitle, 
      isSeed: $isSeed,
      tags: $tags
    }) {
        id
        title
      }
  }
`;
