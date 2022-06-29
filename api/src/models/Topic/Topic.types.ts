import { NexusGenInputs } from '../../generated/nexus';

export type TopicFilterInput = NexusGenInputs['TopicFilterInput'];

/**
 * TopicCount contains meta-statistics about a topic.
 */
export interface TopicStatistics {
  /** Topic string */
  topic: string;
  /** Score of the topic */
  score: number;
  /** Frequency of topic */
  count: number;
  relatedTopics: string[];
  /** Dialogue is referring to this topic  */
  dialogueIds: string[];
  /** Dates that the topic occurred. */
  dates: Date[];
}

/**
 * Maps topic string to the topic-count.
 */
export type TopicByStatistics = Record<string, TopicStatistics>;
