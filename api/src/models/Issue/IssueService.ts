import { PrismaClient } from 'prisma/prisma-client';
import { orderBy } from 'lodash';
import { isPresent } from 'ts-is-present';

import { Nullable } from '../../types/generic';
import { convertDatesToHistogramItems } from '../Common/Analytics/Analytics.helpers';
import { TopicByString, TopicFilterInput, TopicStatistics, TopicStatisticsByDialogueId } from '../Topic/Topic.types';
import { TopicService } from '../Topic/TopicService';
import { GetIssueResolverInput, Issue, IssueConnectionFilterInput, IssueFilterInput } from './Issue.types';
import { SessionActionType, SessionWithEntries } from '../../models/session/Session.types';
import SessionService from '../../models/session/SessionService';
import CustomerService from '../../models/customer/CustomerService';
import IssuePrismaAdapter from './IssuePrismaAdapter';
import { offsetPaginate } from '../general/PaginationHelpers';

export class IssueService {
  private prisma: PrismaClient;
  private topicService: TopicService;
  private workspaceService: CustomerService;
  private sessionService: SessionService;
  private issuePrismaAdapter: IssuePrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.topicService = new TopicService(prisma);
    this.workspaceService = new CustomerService(prisma);
    this.sessionService = new SessionService(prisma);
    this.issuePrismaAdapter = new IssuePrismaAdapter(prisma);
  }

  /**
   * Paginate through all issues of a workspace
   * @param workpsaceId the ID of the workspace
   * @param filter a filter object used to paginate through issues of a workspace
   * @returns a list of paginated issues
   */
  public paginatedIssues = async (
    workspaceId: string,
    filter: IssueConnectionFilterInput,
  ) => {
    const offset = filter.offset;
    const perPage = filter.perPage;

    const issues = await this.issuePrismaAdapter.findPaginatedIssues(workspaceId, filter);
    const totalIssues = await this.issuePrismaAdapter.countIssues(workspaceId, filter);
    const { totalPages, ...pageInfo } = offsetPaginate(totalIssues, offset, perPage);

    return {
      issues: issues,
      totalPages,
      pageInfo,
    };
  };

  /**
  * Finds all issues by a workspace ID
  */
  public async findIssuesByWorkspaceId(workspaceId: string, filter: IssueFilterInput) {
    return this.issuePrismaAdapter.findIssuesByWorkspaceId(workspaceId, filter);
  }

  /**
  * Finds an issue be either the issue or topic ID
  */
  public async findIssueById(input: GetIssueResolverInput) {
    if (input.issueId) {
      return this.issuePrismaAdapter.findIssueById(input.issueId);
    }

    if (input.topicId) {
      return this.issuePrismaAdapter.findIssueByTopicId(input.topicId);
    }

    return null;
  }

  public async createIssueIfNotExists(workspaceId: string, topicId: string) {
    return this.issuePrismaAdapter.upsertIssueByTopicId(workspaceId, topicId);
  }

  /**
   * Finds all issues of a dialogue based on filter input
   * @param dialogueId
   * @param filter
   * @returns
   */
  public async getProblemsByDialogue(dialogueId: string, userId: string, filter: IssueFilterInput) {
    const dialogueStatistics = await this.countNegativeDialogueInteractions(
      dialogueId,
      filter.startDate,
      filter.endDate,
      userId,
      filter
    );
    const issues = this.calculateDialogueIssueScore(dialogueStatistics);
    return issues[0];
  }

  /**
   * Retrieves all workspace issues. This can be filtered, based on the required filter (startDate, endDate).
   * @param workspaceId Workspace ID
   */
  public async getProblemDialoguesByWorkspace(
    workspaceId: string,
    filter: IssueFilterInput,
    userId: string,
    canAccessAllDialogues: boolean = false,
  ): Promise<Issue[]> {
    const dialogues = await this.countNegativeWorkspaceInteractions(
      workspaceId, filter.startDate, filter.endDate, userId, filter, canAccessAllDialogues
    );
    const issues = orderBy(this.calculateDialogueIssueScore(dialogues), (topic) => topic.rankScore, 'desc');

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
   * Retrieves all workspace issues. This can be filtered, based on the required filter (startDate, endDate).
   * @param workspaceId Workspace ID
   */
  public async getWorkspaceIssues(
    workspaceId: string,
    filter: IssueFilterInput,
    userId: string,
    canAccessAllDialogues: boolean = false
  ): Promise<Issue[]> {
    const topics = await this.topicService.countWorkspaceTopics(
      workspaceId, filter.startDate, filter.endDate, userId, filter, canAccessAllDialogues
    );
    const issues = orderBy(this.extractIssues(topics), (topic) => topic.rankScore, 'desc');

    // Filter out topics that are candidate issues.
    return issues;
  }

  /**
   * Count negative interactions and their frequencies per dialogue within a workspace.
   */
  async countNegativeSessions(
    dialogueIds: string[],
    startDate: Date,
    endDate: Date,
    userId: string,
    topicFilter?: TopicFilterInput
  ): Promise<TopicStatisticsByDialogueId> {
    // Fetch all sessions for the dialogues.
    const sessions = await this.sessionService.findSessionsForDialogues(
      dialogueIds,
      startDate,
      endDate,
      this.topicService.buildSessionFilter(topicFilter),
      {
        nodeEntries:
        {
          include:
            { choiceNodeEntry: true, formNodeEntry: { include: { values: { include: { relatedField: true } } } } },
        },
      }
    ) as unknown as SessionWithEntries[];

    // Calculate all the candidate topic-counts.
    const dialogueStatistics = this.sessionService.extractNegativeScoresByDialogue(sessions);

    return dialogueStatistics;
  }

  /**
   * Count negative interactions and their frequencies per dialogue within a workspace.
   */
  private async countNegativeWorkspaceInteractions(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    userId: string,
    topicFilter: TopicFilterInput,
    canAccessAllDialogues: boolean = false,
  ): Promise<TopicStatisticsByDialogueId> {
    const dialogueIds = (
      await this.workspaceService.getDialogues(
        workspaceId,
        userId,
        topicFilter.dialogueStrings || [],
        canAccessAllDialogues
      )
    ).map(dialogue => dialogue.id);

    // Fetch all sessions for the dialogues.
    return this.countNegativeSessions(dialogueIds, startDate, endDate, userId, topicFilter);
  };

  /**
   * Count negative interactions and their frequencies for a single dialogue.
   */
  private async countNegativeDialogueInteractions(
    dialogueId: string,
    startDate: Date,
    endDate: Date,
    userId: string,
    topicFilter?: TopicFilterInput
  ): Promise<TopicStatisticsByDialogueId> {

    // Fetch all sessions for the dialogues.
    return this.countNegativeSessions([dialogueId], startDate, endDate, userId, topicFilter);
  };

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
  private calculateDialogueIssueScore(dialogues: TopicStatisticsByDialogueId): Issue[] {
    let issues: Issue[] = [];

    Object.entries(dialogues).forEach(([dialogueId, dialogueStats]) => {
      const rankScore = this.calculateScore(dialogueStats);

      issues.push({
        id: `${dialogueId}`,
        topic: '',
        basicStats: {
          average: dialogueStats.score / dialogueStats.count,
          responseCount: dialogueStats.count,
        },
        dialogue: null,
        dialogueId,
        createdAt: dialogueStats.dates[0],
        updatedAt: dialogueStats.dates[dialogueStats.dates.length - 1],
        status: 'OPEN',
        history: {
          id: `${dialogueId}-hist`,
          items: convertDatesToHistogramItems(dialogueStats.dates),
        },
        rankScore,
        followUpAction: dialogueStats.followUpActions.find(isPresent) || null,
        actionRequiredCount: dialogueStats.followUpActions.filter(isPresent).length,
      })
    });

    return issues;
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
          actionRequiredCount: topicStats.followUpActions.filter(isPresent).length,
        })
      });
    });

    return issues;
  }
}
