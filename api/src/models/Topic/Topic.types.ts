import { SessionActionType } from '../session/SessionTypes';
import { NexusGenInputs } from '../../generated/nexus';
import { Nullable } from 'types/generic';

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
  /** Other topics related to this topic */
  relatedTopics: string[];
  /** Dialogue is referring to this topic  */
  dialogueIds: string[];
  /** Dates that the topic occurred. */
  dates: Date[];
  /** Follow up action */
  followUpActions: Nullable<SessionActionType>[];
}

export type TopicStatisticsByDialogueId = Record<string, TopicStatistics>;

/**
 * Maps topic string to dialogue-ids, which in turn have a map of topic statistics.
 *
 * Example:
 * {
 *  "clarity": {
 *     "HowFeelAboutHades": {
 *         "score": 'X',
 *      }
 *   }
 * }
 */
export type TopicByString = Record<string, TopicStatisticsByDialogueId>;
