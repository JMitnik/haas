import gql from 'graphql-tag';

import { EdgeFragment } from './EdgeFragment';
import { QuestionFragment } from './QuestionFragment';

const getDialogueFromSlug = gql`
  query getDialogue($customerSlug: String!, $dialogueSlug: String!) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        title
        slug
        publicTitle
        language
        creationDate
        updatedAt
        postLeafNode {
          header
          subtext
        }
        leafs {
          id
          title
          type
          links {
            url
            type
            title
            iconUrl
            backgroundColor
            buttonText
            header
            subHeader
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
        customerId
        rootQuestion {
            ...QuestionFragment
        }
        questions {
          ...QuestionFragment
        }
        edges {
          ...EdgeFragment
        }
      }
    }
  }

  ${EdgeFragment}
  ${QuestionFragment}
`;

export default getDialogueFromSlug;
