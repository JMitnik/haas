import gql from 'graphql-tag';

const updateTopicBuilder = gql`
  mutation updateTopicBuilder($dialogueSlug: String!, $customerSlug: String!, $topicData: TopicDataEntry) {
    updateTopicBuilder(dialogueSlug: $dialogueSlug, customerSlug: $customerSlug, topicData: $topicData) 
  }
`;

export default updateTopicBuilder;
