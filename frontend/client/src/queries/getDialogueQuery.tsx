import { CustomerFragment } from './CustomerFragment';
import { EdgeFragment } from './EdgeFragment';
import { QuestionFragment } from './QuestionFragment';
import gql from 'graphql-tag';

const getDialogueQuery = gql`
    query getDialogue($id: ID!) {
    dialogue(where: { id: $id }) {
        id
        title
        publicTitle
        creationDate
        updatedAt
        leafs {
        id
        title
        type
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

    ${EdgeFragment}
    ${CustomerFragment}
    ${QuestionFragment}
`;

export default getDialogueQuery;
