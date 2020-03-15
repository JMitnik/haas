import gql from 'graphql-tag';

const getQuestionnaireDataQuery = gql`
  query getQuestionnaireData($topicId: String) {
    getQuestionnaireData(topicId: $topicId) {
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
