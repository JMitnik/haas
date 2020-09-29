import gql from 'graphql-tag';

const createCTAMutation = gql`
  mutation createCTA($customerSlug: String!, $dialogueSlug: String!, $title: String!, $type: String!, $links: CTALinksInputType, $share: ShareNodeInputType) {
    createCTA(customerSlug: $customerSlug, dialogueSlug: $dialogueSlug, title: $title, type: $type, links: $links, share: $share) {
        id
    }
  }
`;

export default createCTAMutation;
