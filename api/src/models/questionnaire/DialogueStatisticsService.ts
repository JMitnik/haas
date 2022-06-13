import { DialogueImpactScore, DialogueStatisticsSummaryCache, NodeEntry, PrismaClient, Session, SliderNodeEntry } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { groupBy, maxBy, mean, meanBy, orderBy } from 'lodash';
import { addDays, differenceInHours } from 'date-fns';

import { CustomerService } from '../customer/CustomerService';
import SessionService from '../session/SessionService';
import NodeService from '../QuestionNode/NodeService';
import { PrismaCacheService } from '../general/cache/PrismaCacheService';
import DialoguePrismaAdapter from './DialoguePrismaAdapter';
import { NexusGenFieldTypes } from '../../generated/nexus';
import DialogueService from './DialogueService';
import NodeEntryService from '../node-entry/NodeEntryService';
import { TopicService } from '../Topic/TopicService';
import { TopicFilterInput } from '../Topic/Topic.types';
import { Topic } from './DialogueTypes';
import { toUTC } from '../../utils/dateUtils';

const THRESHOLD = 40;

type UrgentPath = NexusGenFieldTypes['UrgentPath'];
type BasicStatistic = NexusGenFieldTypes['BasicStatistics'];

class DialogueStatisticsService {
  cacheService: PrismaCacheService;
  nodeEntryService: NodeEntryService
  dialogueService: DialogueService;
  workspaceService: CustomerService;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  nodeService: NodeService;
  sessionService: SessionService;
  topicService: TopicService;
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.nodeEntryService = new NodeEntryService(prismaClient);
    this.dialogueService = new DialogueService(prismaClient);
    this.workspaceService = new CustomerService(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.sessionService = new SessionService(prismaClient);
    this.topicService = new TopicService(prismaClient);
    this.cacheService = new PrismaCacheService(prismaClient);
    this.prisma = prismaClient;
  }

  buildCacheKey(dialogueId: string, type: DialogueImpactScore, startDateTime: Date, endDateTime?: Date): string {
    return `${dialogueId}_${type}_${startDateTime.getTime()}_${endDateTime?.getTime() ?? 0}`;
  }

  /**
   * Calculate potentially an urgent path for the workspace.
   */
  async calculateUrgentPath(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    topicFilter: TopicFilterInput = {},
  ): Promise<UrgentPath | null> {
    // An urgent path is a path which was considered urgent. This can be either one of the following:
    // TODO: 1. A particular subject was triggered which was marked as "important" (this takes precedence)

    const topicCounts = await this.topicService.countWorkspaceTopics(workspaceId, startDate, endDate, {
      ...topicFilter,
      relatedSessionScoreLowerThreshold: THRESHOLD,
    });

    // This is where the decision is made "what" is considered most urgent to report on.
    const urgentTopic = maxBy(Object.values(topicCounts), 'count');

    if (!urgentTopic) return null;

    return {
      id: `URGENT_PATH_${workspaceId}`,
      path: {
        id: `PATH_URGENT_PATH_${workspaceId}`,
        topicStrings: urgentTopic.relatedTopics,
      },
      // This is resolved separately.
      dialogue: null,
      // TODO: Accept multiple dialogues as output, we only return the "first" one right now.
      dialogueId: urgentTopic.dialogueIds[0],
      // Basic stats
      basicStats: {
        average: urgentTopic.score,
        responseCount: urgentTopic.count,
      },
    }
  }

  findDialogueHealthScore = async (
    dialogueId: string,
    startDateTime: Date,
    endDateTime?: Date,
    threshold: number = 70,
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime, 7) : endDateTime;

    const scopedSessions = await this.sessionService.findSessionsBetweenDates(
      dialogueId,
      startDateTime,
      endDateTimeSet
    );

    const nrVotes = scopedSessions.length;
    const sessionsHigherThanTreshold = scopedSessions.filter((session) => session.mainScore >= threshold);

    const healthScore = nrVotes === 0 ? 0 : sessionsHigherThanTreshold.length / nrVotes * 100;

    return { score: healthScore, nrVotes, negativeResponseCount: nrVotes - sessionsHigherThanTreshold.length };
  };

  findWorkspaceHealthScore = async (
    workspaceId: string,
    startDateTime: Date,
    endDateTime?: Date,
    topicFilter?: TopicFilterInput,
    threshold: number = 70,
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime, 7) : endDateTime;
    const dialogues = await this.workspaceService.getDialogues(workspaceId, topicFilter?.dialogueStrings || undefined);
    const mappedDialogueIds = dialogues.map((dialogue) => dialogue.id);

    const scopedSessions = await this.sessionService.findSessionsForDialogues(
      mappedDialogueIds,
      startDateTime,
      endDateTimeSet
    );

    const nrVotes = scopedSessions.length;
    const sessionsHigherThanTreshold = scopedSessions.filter((session) => session.mainScore >= threshold);

    const healthScore = nrVotes === 0 ? 0 : sessionsHigherThanTreshold.length / nrVotes * 100;

    return {
      score: healthScore,
      nrVotes,
      negativeResponseCount: nrVotes - sessionsHigherThanTreshold.length,
    };
  };

  /**
   * Finds sessions and number of votes based on provided start/end date
   * @param dialogueId
   * @param startDateTime
   * @param endDateTime
   * @param refresh Boolean - if set to true will update cached version within database
   * @returns
   */
  initiate = async (
    dialogueId: string,
    type: DialogueImpactScore,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime, 7) : endDateTime;
    const key = this.buildCacheKey(dialogueId, type, startDateTime, endDateTimeSet);

    return await this.cacheService.getOrCreate<DialogueStatisticsSummaryCache>(
      'dialogueStatisticsSummaryCache',
      key,
      async () => {
        const scopedSessions = await this.sessionService.findSessionsBetweenDates(
          dialogueId,
          startDateTime,
          endDateTimeSet
        );

        const impactScore = await this.calculateImpactScore(type, scopedSessions);

        return {
          id: key,
          dialogueId: dialogueId,
          impactScore: impactScore || 0,
          nrVotes: scopedSessions.length,
          impactScoreType: type,
          startDateTime: startDateTime,
          endDateTime: endDateTimeSet,
          updatedAt: toUTC(new Date()),
        }
      },
      { ttl: 180, enabled: refresh }
    )
  }

  /**
   * Calculates impact score of a list of sessions
   * @param type an impact score type
   * @param sessions a list of sessions
   * @returns an impact score or null if no sessions/type are provided
   */
  calculateImpactScore = async (type: DialogueImpactScore, sessions: Session[]) => {
    switch (type) {
      case DialogueImpactScore.AVERAGE:
        const sessionIds = sessions.map((session) => session.id);
        const nodeEntries = await this.sessionService.findNodeEntriesBySessionIds(sessionIds, 0);
        const sliderValues = nodeEntries.map((entry) => entry.sliderNodeEntry?.value).filter(isPresent);
        const average = mean(sliderValues);
        return average;

      default:
        return null;
    }
  }

  calculateNodeEntriesImpactScore = (
    type: DialogueImpactScore,
    nodeEntries: (NodeEntry & {
      sliderNodeEntry: SliderNodeEntry | null;
      session: {
        dialogueId: string;
      } | null;
    })[]
  ) => {
    switch (type) {
      case DialogueImpactScore.AVERAGE:
        const average = meanBy(nodeEntries, (entry) => entry?.sliderNodeEntry?.value);
        return average;

      default:
        return 0;
    }
  }

  /**
   * Calculates the basic statistics of a workspace (using the underlying dialogue statistics).
   * @param customerId
   * @param impactScoreType
   * @param startDateTime
   * @param endDateTime
   * @param refresh
   * @returns
   */
  async calculateWorkspaceBasicStatistics(
    customerId: string,
    impactScoreType: DialogueImpactScore,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false,
  ): Promise<BasicStatistic> {
    const statisticSummaries = await this.findNestedDialogueStatisticsSummary(
      customerId,
      impactScoreType,
      startDateTime,
      endDateTime,
      refresh
    );

    // Get all statistic summaries, and sum them up
    const cumulativeStats = statisticSummaries.reduce((acc, summary) => {
      acc.scoreSum += summary.impactScore;
      acc.responseCount += summary?.nrVotes ?? 0;

      return acc;
    }, { responseCount: 0, scoreSum: 0 } as { responseCount: number; scoreSum: number });

    return {
      average: statisticSummaries.length ? (cumulativeStats.scoreSum / statisticSummaries.length) : 0,
      responseCount: cumulativeStats.responseCount,
    }
  }

  /**
   * Calculate and ranks most popular topics of a workspace
   */
  async rankTopics(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    topicFilter?: TopicFilterInput,
    cutoff = 5
  ): Promise<Topic[]> {
    const topicCounts = await this.topicService.countWorkspaceTopics(
      workspaceId,
      startDate,
      endDate,
      topicFilter,
    );

    // Rank topics (without using index, not efficient)
    const rankedTopics: Topic[] = orderBy(Object.values(topicCounts), 'count', 'desc').map(topicCount => ({
      name: topicCount.topic,
      impactScore: topicCount.score,
      nrVotes: topicCount.count,
      subTopics: [],
      basicStats: {
        average: topicCount.score,
        responseCount: topicCount.count,
      },
    })).slice(0, cutoff);

    return rankedTopics;
  }

  /**
   * Calculates the impact score of all dialogues within a workspace
   * @param customerId
   * @param impactScoreType
   * @param startDateTime
   * @param endDateTime
   * @param refresh
   * @returns
   */
  findNestedDialogueStatisticsSummary = async (
    customerId: string,
    impactScoreType: DialogueImpactScore,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false,
  ) => {
    const dialogueIds = await this.dialogueService.findDialogueIdsByCustomerId(customerId);
    const endDateTimeSet = !endDateTime ? addDays(startDateTime as Date, 7) : endDateTime;

    const cacheKeys = dialogueIds.map(dialogueId => this.buildCacheKey(
      dialogueId,
      impactScoreType,
      startDateTime,
      endDateTimeSet
    ));

    const cachedSummaries: DialogueStatisticsSummaryCache[] = [];
    const caches = await this.cacheService.getBatch<DialogueStatisticsSummaryCache>(
      'dialogueStatisticsSummaryCache',
      cacheKeys,
    );

    if (!refresh) {
      caches.forEach((cache) => {
        if (differenceInHours(Date.now(), cache.updatedAt) == 0) {
          dialogueIds.splice(dialogueIds.indexOf(cache.dialogueId), 1);
          return cachedSummaries.push(cache);
        };
      });
    }

    if (caches.length === cachedSummaries.length && dialogueIds.length === 0) {
      return caches;
    }

    const nodeEntries = await this.nodeEntryService.findDialogueStatisticsRootEntries(
      dialogueIds,
      startDateTime as Date,
      endDateTimeSet,
    );

    // Group node entries by their dialogue ids so we can calculate impact score
    const sessionContext = groupBy(nodeEntries, (nodeEntry) => nodeEntry.session?.dialogueId);

    // If no node entries/sessions exist for a dialogue return empty list so cache entry can still get created
    dialogueIds.forEach((dialogueId) => {
      if (!sessionContext[dialogueId]) {
        sessionContext[dialogueId] = [];
      }
    });

    const newCaches: DialogueStatisticsSummaryCache[] = [];

    // For every dialogue, calculate impact score and upsert a cache entry
    Object.entries(sessionContext).forEach((context) => {
      const dialogueId = context[0];
      const nodeEntries = context[1];
      const impactScore = this.calculateNodeEntriesImpactScore(
        impactScoreType,
        nodeEntries
      );

      const nestedCacheId = this.buildCacheKey(dialogueId, impactScoreType, startDateTime, endDateTimeSet);

      const data: DialogueStatisticsSummaryCache = {
        id: nestedCacheId,
        dialogueId,
        updatedAt: toUTC(new Date(Date.now())),
        impactScore: impactScore || 0,
        impactScoreType: impactScoreType,
        nrVotes: nodeEntries.length || 0,
        startDateTime: startDateTime,
        endDateTime: endDateTimeSet,
      }

      void this.cacheService.createOrUpdate('dialogueStatisticsSummaryCache', nestedCacheId, data);
    });

    return [...cachedSummaries, ...newCaches];
  }
}

export default DialogueStatisticsService;
