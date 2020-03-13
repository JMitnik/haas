import gql from 'graphql-tag';

const getQuestionnaireDataQuery = gql`
  query getQuestionnaireData($topicId: String) {
    getQuestionnaireData(topicId: $topicId)
  }

`;

export default getQuestionnaireDataQuery;
