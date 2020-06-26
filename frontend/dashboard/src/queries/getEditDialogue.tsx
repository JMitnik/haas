import gql from 'graphql-tag';

const getEditDialogueQuery = gql`
  query getEditDialogue($slug: String!) {
    dialogue(where: { slug: $slug }) {
      id
      title
      slug
      publicTitle
      description
      
      tags {
        id
        name
        type
      }
    }
  }
`;

export default getEditDialogueQuery;
