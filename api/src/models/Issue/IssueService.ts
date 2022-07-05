import { PrismaClient } from '@prisma/client';
import { orderBy } from 'lodash';

import { SessionActionType } from 'models/session/Session.types';
import { isPresent } from 'ts-is-present';
import { Nullable } from 'types/generic';

import { convertDatesToHistogramItems } from '../Common/Analytics/Analytics.helpers';
import { TopicByString, TopicStatistics } from '../Topic/Topic.types';
import { TopicService } from '../Topic/TopicService';
import { Issue, IssueFilterInput } from './Issue.types';

export class IssueService {
  private prisma: PrismaClient;
  private topicService: TopicService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.topicService = new TopicService(prisma);
  }

  /**
   * Retrieves all workspace issues. This can be filtered, based on the required filter (startDate, endDate).
   * @param workspaceId Workspace ID
   */
  public async getWorkspaceIssues(workspaceId: string, filter: IssueFilterInput): Promise<Issue[]> {
    const topics = await this.topicService.countWorkspaceTopics(workspaceId, filter.startDate, filter.endDate, filter);
    const issues = orderBy(this.extractIssues(topics), (topic) => topic.rankScore, 'desc');

    // Filter out topics that are candidate issues.
    return issues;
  }

  /**
   * Calculate the issue score based on the underlying topics statistics.
   *
   * We follow a certain heuristic:
   * - A single negative ranking is a simple inverse addition. A "1" (or 10) gets us 10 points, 3 gets us 3,3 points. Therefore,
   * we calculate the
   * - A "contact" me adds a single extra 100 points.
   */
  public calculateScore(relatedTopicStatistics: TopicStatistics): number {
    // We weigh the score by the count; not clean heuristic
    const scoreRanking = (1 / ((relatedTopicStatistics.score + 0.01) / 100)) * relatedTopicStatistics.count;

    // We also calculate the score based on the available actions
    const actionRanking = this.scoreFromActions(relatedTopicStatistics.followUpActions);

    return actionRanking + scoreRanking;
  }

  /**
   * Calculate part of the issue score from actions.
   *
   * We follow a certain heuristic:
   * - Contact is worth "50" points.
   * @param actions
   */
  private scoreFromActions(actions: Nullable<SessionActionType>[]) {
    const score = actions.reduce((acc, action) => {
      if (action && action === 'CONTACT') {
        acc += 100;
      }

      return acc;
    }, 0);

    return score;
  }

  /**
   * Extracts all issues from a topic-by-string map.
   *
   * Warning: Potentially costly due to the `convertDatesToHistogramItems` call.
   */
  private extractIssues(topics: TopicByString): Issue[] {
    let issues: Issue[] = [];

    // Split each topic based on the dialogues.
    Object.entries(topics).forEach(([topicName, dialogueTopics]) => {
      Object.entries(dialogueTopics).forEach(([dialogueId, topicStats]) => {
        if (topicStats.score > 50) return false;

        const rankScore = this.calculateScore(topicStats);

        issues.push({
          id: `${topicName}-${dialogueId}`,
          topic: topicName,
          basicStats: {
            average: topicStats.score,
            responseCount: topicStats.count,
          },
          dialogue: null,
          dialogueId,
          createdAt: topicStats.dates[0],
          updatedAt: topicStats.dates[topicStats.dates.length - 1],
          status: 'OPEN',
          history: {
            id: `${topicName}-${dialogueId}-hist`,
            items: convertDatesToHistogramItems(topicStats.dates),
          },
          rankScore,
          followUpAction: topicStats.followUpActions.find(isPresent) || null,
        })
      });
    });

    return issues;
  }
}
