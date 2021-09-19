import { gql } from '@apollo/client';

const getCTANodesOfDialogue = gql`
  query getCTANodesOfDialogue($customerSlug: String!, $dialogueSlug: String!, $searchTerm: String) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        slug
        title
        leafs(searchTerm: $searchTerm) {
          id
          title
          type
          links {
            id
            url
            title
            iconUrl
            backgroundColor
            type
            header
            subHeader
            buttonText
            imageUrl
          }
          share {
            id
            title
            url
            tooltip
          }
          form {
            id
            helperText
            fields {
              id
              label
              type
              placeholder
              isRequired
              position
            }
          }
        }
      }
    }
  }
`;

export default getCTANodesOfDialogue;
