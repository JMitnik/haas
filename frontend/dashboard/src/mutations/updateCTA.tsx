import gql from 'graphql-tag';

const updateCTAMutation = gql`
  mutation updateCTA($id: String!, $title: String!, $type: String!, $links: CTALinksInputType) {
    updateCTA(id: $id, title: $title, type: $type, links: $links) {
        id
    }
  }
`;

export default updateCTAMutation;
