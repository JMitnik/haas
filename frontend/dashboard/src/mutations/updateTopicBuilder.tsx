import gql from 'graphql-tag';

const updateTopicBuilder = gql`
  mutation updateTopicBuilder($id: String!, $topicData: TopicDataEntry) {
    updateTopicBuilder(id: $id, topicData: $topicData) 
  }
`;

export default updateTopicBuilder;
