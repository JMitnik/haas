import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';
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
        creationDate
        updatedAt
        leafs {
          id
          title
          type
          links {
            url
            title
            icon
            backgroundColor
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
        customer {
          ...CustomerFragment
        }
      }
    }
  }

  ${EdgeFragment}
  ${CustomerFragment}
  ${QuestionFragment}
`;

export default getDialogueFromSlug;
