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
          }
          share {
            id
            title
            url
            tooltip
          }
          form {
            id
            fields {
              id
              label
              type
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
