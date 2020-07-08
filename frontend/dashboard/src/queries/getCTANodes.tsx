import gql from 'graphql-tag';

const getCTANodesOfDialogue = gql`
  query getCTANodesOfDialogue($customerSlug: String!, $dialogueSlug: String!) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        slug
        title
        leafs {
          id
          title
          type
        }
      }
    }
  }
`;

export default getCTANodesOfDialogue;
