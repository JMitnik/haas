import gql from 'graphql-tag';

const updateCTAMutation = gql`
  mutation updateCTA($id: String!, $title: String!, $type: String!, $links: CTALinksInputType, $share: ShareNodeInputType) {
    updateCTA(id: $id, title: $title, type: $type, links: $links, share: $share) {
        id
    }
  }
`;

export default updateCTAMutation;
