/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const updateTopicBuilder = gql`
  mutation updateTopicBuilder($id: String!, $topicData: TopicDataEntry) {
    updateTopicBuilder(id: $id, topicData: $topicData) 
  }
`;

export default updateTopicBuilder;
