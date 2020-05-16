import gql from 'graphql-tag';
import { CustomerFragment } from './CustomerFragment';
import { QuestionFragment } from './QuestionFragment';

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
        customer {
        ...CustomerFragment
        }
    }
    }
    ${CustomerFragment}
    ${QuestionFragment}
`;

export default getDialogueQuery;
