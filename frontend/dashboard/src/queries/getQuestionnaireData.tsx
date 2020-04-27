import gql from 'graphql-tag';

const getQuestionnaireDataQuery = gql`
  query getQuestionnaireData($dialogueId: String) {
    getQuestionnaireData(dialogueId: $dialogueId) {
      customerName
      title
      description
      creationDate
      updatedAt
      average
      totalNodeEntries
      timelineEntries {
        sessionId
        value
        createdAt
      }
    }
  }

`;

export default getQuestionnaireDataQuery;
