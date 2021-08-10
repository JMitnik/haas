import { PrismaClient } from "@prisma/client";
import { groupBy, maxBy, meanBy, minBy } from 'lodash'
import { add, format } from "date-fns";
import parse from "date-fns/parse";
import { NexusGenFieldTypes, NexusGenInputs } from "../../generated/nexus";
import { DialogueStatisticsPrismaAdapter } from "./DialogueStatisticsPrismaAdapter";
import { SessionGroup } from "./DialogueStatisticsServiceTypes";

const groupKey = {
  hour: 'HH-dd-LL-y',
  day: 'dd-LL-y',
  month: 'LL-y',
}

export class DialogueStatisticsService {
  prisma: PrismaClient;
  prismaAdapter: DialogueStatisticsPrismaAdapter;

  constructor(prisma: PrismaClient, prismaAdapter: DialogueStatisticsPrismaAdapter) {
    this.prisma = prisma;
    this.prismaAdapter = prismaAdapter;
  }

  /**
   * Gets nodes with statistics, per branch, along with count.
   * */
  getNodeStatisticsByRootBranch = async (dialogueId: string, min: number, max: number) => {
    const nodeCounts = await this.prismaAdapter.countNodeEntriesByRootBranch(dialogueId, min, max);
    const { nodes } = await this.prismaAdapter.getNodesAndEdges(dialogueId);

    const nodesWithCount = nodeCounts.map(nodeCount => ({
      statistics: {
        count: nodeCount._count,
      },
      node: nodes.find(node => node.id === nodeCount.relatedNodeId)
    }));

    return {
      nodes: nodesWithCount.map(node => ({
        ...node.node,
        statistics: node.statistics,
      }))
    }
  }

  private getSessionStatisticsSummary = (
    sessionGroup: SessionGroup
  ): NexusGenFieldTypes['DialogueStatisticsSessionsSummaryType'] => {
    const sessionStatistics = sessionGroup.reduce((result, current) => {
      const score = current.nodeEntries.find(
        nodeEntry => nodeEntry.relatedNode?.isRoot
      )?.sliderNodeEntry?.value || 0;

      if (score > result.max) result.max = score;
      if (score < result.min) result.min = score;
      result.sum += score;

      return result;
    }, { max: -Infinity, min: +Infinity, sum: 0 });

    return {
      count: sessionGroup.length,
      average: sessionStatistics.sum / sessionGroup.length,
      max: sessionStatistics.max,
      min: sessionStatistics.min,
    }
  }

  private getChoiceStatisticsSummary = (
    sessionGroup: SessionGroup
  ): NexusGenFieldTypes['DialogueStatisticsSessionsSummaryType'] => {
    const sessionStatistics = sessionGroup.reduce((result, current) => {
      if (current.rootValue > result.max) result.max = current.rootValue;
      if (current.rootValue < result.min) result.min = current.rootValue;
      result.sum += current.rootValue;

      return result;
    }, { max: -Infinity, min: +Infinity, sum: 0 });

    return {
      count: sessionGroup.length,
      average: sessionStatistics.sum / sessionGroup.length,
      max: sessionStatistics.max,
      min: sessionStatistics.min,
    }
  }

  private getDialogueStatisticsSummaryGroup = (
    startDate: Date,
    endDate: Date,
    sessionGroup: SessionGroup
  ): NexusGenFieldTypes['DialogueStatisticsSummaryGroupType'] => {
    // TODO: Generate choices-level summary using lodash (or another prisma call perhaps?)
    const nodeEntryStatistics = sessionGroup.reduce((result, current) => {
      current.nodeEntries.forEach(nodeEntry => {
        if (!nodeEntry.relatedNodeId) return;
        if (!nodeEntry.choiceNodeEntry) return;

        if (!(nodeEntry.relatedNodeId in result.nodes)) {
          // @ts-ignore
          result.nodes[nodeEntry.relatedNodeId] = { value: nodeEntry.choiceNodeEntry.value, count: 0, sumScore: 0, maxScore: 0, minScore: 0 }
        }

        // @ts-ignore
        let lookupNode = result.nodes[nodeEntry.relatedNodeId];

        // @ts-ignore
        if (current.rootValue > lookupNode.maxScore) result.nodes[nodeEntry.relatedNodeId].maxScore = current.rootValue;

        // @ts-ignore
        if (current.rootValue < lookupNode.minScore) result.nodes[nodeEntry.relatedNodeId].minScore = current.rootValue;
        // @ts-ignore
        result.nodes[nodeEntry.relatedNodeId].count += 1;
        // @ts-ignore
        result.nodes[nodeEntry.relatedNodeId].sumScore += current.rootValue;
      })

      return result;
    }, { nodes: {} });

    console.log(nodeEntryStatistics);
    return {
      choicesSummaries: null,
      sessionsSummary: this.getSessionStatisticsSummary(sessionGroup),
      startDate,
      endDate
    }
  }

  /**
   * Gets statistics-summarized about dialogue
   */
  getDialogueStatisticsSummary = async (
    dialogueId: string,
    filter?: NexusGenInputs['DialogueStatisticsSummaryFilterInput']
  ): Promise<NexusGenFieldTypes['DialogueStatisticsSummaryType']> => {
    // TODO: Read data from Redis

    const sessions = await this.prismaAdapter.getSessionsBetweenDates(dialogueId, filter?.startDate, filter?.endDate);

    // Group sessions by group
    // TODO: Convert dateGroup to use filter.groupBy
    const sessionGroups: [string, SessionGroup][] = Object.entries(groupBy(sessions.map(session => ({
      ...session,
      rootValue: session.nodeEntries.find(nodeEntry => nodeEntry.relatedNode?.isRoot)?.sliderNodeEntry?.value || 0,
      dateGroup: format(session.createdAt, 'LL-y')
    })), 'dateGroup'));

    return {
      summaryGroups: sessionGroups.map(([date, sessionGroup]) => {
        const startDate = parse(date, 'LL-y', new Date());
        const endDate = add(startDate, { months: 1 });

        return this.getDialogueStatisticsSummaryGroup(startDate, endDate, sessionGroup);
      })
    };
  }
}
