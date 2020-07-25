import gql from 'graphql-tag';

const createCTAMutation = gql`
  mutation createCTA($customerSlug: String!, $dialogueSlug: String!, $title: String!, $type: String!, $links: CTALinksInputType) {
    createCTA(customerSlug: $customerSlug, dialogueSlug: $dialogueSlug, title: $title, type: $type, links: $links) {
        id
    }
  }
`;

export default createCTAMutation;
