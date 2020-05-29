import gql from 'graphql-tag';

const schema = gql`
    extend type InteractionEntries {
        node: QuestionNode
    }
`;

export default schema;
