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
            steps {
              id
              header
              helper
              subHelper
              position
              type
              fields {
                id
                label
                type
                placeholder
                isRequired
                position
                contacts {
                  id
                  email
                  firstName
                  lastName
                }
              }
            }
            fields {
              id
              label
              type
              placeholder
              isRequired
              position
              contacts {
                id
                email
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  }
`;

export default getCTANodesOfDialogue;
