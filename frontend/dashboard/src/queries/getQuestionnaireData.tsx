import gql from 'graphql-tag';

const getQuestionnaireDataQuery = gql`
  query getQuestionnaireData($dialogueId: String, $filter: Int) {
    getQuestionnaireData(dialogueId: $dialogueId, filter: $filter) {
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
      topPositivePath {
        answer
        quantity
      }
      topNegativePath {
        answer
        quantity
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
