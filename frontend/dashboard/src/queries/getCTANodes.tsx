import gql from 'graphql-tag';

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
            url
            title
            icon
            backgroundColor
            type
          }
        }
      }
    }
  }
`;

export default getCTANodesOfDialogue;
