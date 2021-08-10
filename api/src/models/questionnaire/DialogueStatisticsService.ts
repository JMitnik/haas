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

  private getDialogueStatisticsSummaryGroup = (
    startDate: Date,
    endDate: Date,
    sessionGroup: SessionGroup
  ): NexusGenFieldTypes['DialogueStatisticsSummaryGroupType'] => {
    // TODO: Generate choices-level summary using lodash (or another prisma call perhaps?)

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
    const sessions = await this.prismaAdapter.getSessionsBetweenDates(dialogueId, filter?.startDate, filter?.endDate);

    // Group sessions by group
    // TODO: Convert dateGroup to use filter.groupBy
    const sessionGroups: [string, SessionGroup][] = Object.entries(groupBy(sessions.map(session => ({
      ...session,
      dateGroup: format(session.createdAt, 'LL-y')
    })), 'dateGroup'));

    // TODO: Generate choices-level summary using lodash (or another prisma call perhaps?)

    return {
      summaryGroups: sessionGroups.map(([date, sessionGroup]) => {
        const startDate = parse(date, 'LL-y', new Date());
        const endDate = add(startDate, { months: 1 });

        return this.getDialogueStatisticsSummaryGroup(startDate, endDate, sessionGroup);
      })
    };
  }
}
