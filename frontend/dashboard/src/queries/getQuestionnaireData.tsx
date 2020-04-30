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
      lineChartData {
        x
        y
      }
      timelineEntries {
        sessionId
        value
        createdAt
      }
    }
  }

`;

export default getQuestionnaireDataQuery;
