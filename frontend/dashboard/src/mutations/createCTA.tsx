import gql from 'graphql-tag';

const createCTAMutation = gql`
  mutation createCTA($customerSlug: String!, $dialogueSlug: String!, $title: String!, $type: String!) {
    createCTA(customerSlug: $customerSlug, dialogueSlug: $dialogueSlug, title: $title, type: $type) {
        id
    }
  }
`;

export default createCTAMutation;
