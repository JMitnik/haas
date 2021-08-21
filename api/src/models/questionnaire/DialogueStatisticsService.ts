import { PrismaClient } from "@prisma/client";
import { groupBy, maxBy, meanBy, minBy } from 'lodash'
import { add, format } from "date-fns";
import parse from "date-fns/parse";

import { DialogueTree } from './entities/DialogueTree';
import { traverseTree } from '../../utils/traverseTree';
import { NexusGenEnums, NexusGenFieldTypes, NexusGenInputs } from "../../generated/nexus";
import { DialogueStatisticsPrismaAdapter } from "./DialogueStatisticsPrismaAdapter";
import { SessionChoiceGroupValue, SessionGroup } from "./DialogueStatisticsServiceTypes";
import { DialogueTreeNode } from "./entities/DialogueTreeTypes";

const groupKey = {
  hour: 'HH-dd-LL-y',
  day: 'dd-LL-y',
  week: 'LL-y',
}

const groupAddDateKey = {
  hour: { hours: 1 },
  day: { days: 1 },
  week: { weeks: 1 },
  month: { months: 1 }
}

export class DialogueStatisticsService {
  prisma: PrismaClient;
  prismaAdapter: DialogueStatisticsPrismaAdapter;

  constructor(prisma: PrismaClient, prismaAdapter: DialogueStatisticsPrismaAdapter) {
    this.prisma = prisma;
    this.prismaAdapter = prismaAdapter;
  }

  /**
   * Gets statistics-summarized about dialogue
   */
  getDialogueStatisticsSummary = async (
    dialogueId: string,
    filter?: NexusGenInputs['DialogueStatisticsSummaryFilterInput'],
    sessionGroupBy?: NexusGenEnums['DialogueStatisticsSummaryGroupby']
  ): Promise<NexusGenFieldTypes['DialogueStatisticsSummaryType']> => {
    // TODO: Read data from Redis

    // TODO: Add safety guards: if by hour, then do max 5 days
    // TODO: Add safety guards: if by day, then do max 31 days
    // TODO: Add safety guards: if by week, then do max 52 weeks
    // TODO: Add safety guards: if by months, then do max 12 months
    const groupByKey = groupKey[sessionGroupBy || 'hour'];

    const sessions = await this.prismaAdapter.getSessionsBetweenDates(
      dialogueId,
      filter?.startDate,
      filter?.endDate
    );

    // Group sessions by group
    // TODO: Convert dateGroup to use filter.groupBy
    const sessionGroups: [string, SessionGroup][] = Object.entries(groupBy(sessions.map(session => ({
      ...session,
      rootValue: session.nodeEntries.find(nodeEntry => nodeEntry.relatedNode?.isRoot)?.sliderNodeEntry?.value || 0,
      dateGroup: format(session.createdAt, groupByKey)
    })), 'dateGroup'));

    return {
      pathsSummary: await this.getPathsSummary(dialogueId, filter?.startDate, filter?.endDate),
      choicesSummaries: await this.getChoiceStatisticsSummary(dialogueId, filter?.startDate, filter?.endDate),
      branchesSummary: null,
      sessionsSummaries: sessionGroups.map(([date, sessionGroup]) => {
        const startDate = parse(date, groupByKey, new Date());
        const endDate = add(startDate, groupAddDateKey[sessionGroupBy || 'hour']);

        return this.getSessionStatisticsSummary(sessionGroup, startDate, endDate);
      })
    };
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
    sessionGroup: SessionGroup,
    startDate: Date,
    endDate: Date,
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
      startDate,
      endDate,
      count: sessionGroup.length,
      average: sessionStatistics.sum / sessionGroup.length,
      max: sessionStatistics.max,
      min: sessionStatistics.min,
    }
  }

  private getChoiceStatisticsSummary = async (
    dialogueId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<NexusGenFieldTypes['DialogueChoiceSummaryType'][]> => {
    const sessions = await this.prismaAdapter.getSessionsBetweenDates(dialogueId, startDate, endDate);
    const nodeEntryStatistics = sessions.reduce((result, current) => {
      const rootValue = current.nodeEntries.find(nodeEntry => nodeEntry.relatedNode?.isRoot)?.sliderNodeEntry?.value;

      current.nodeEntries.forEach(nodeEntry => {
        if (!nodeEntry.relatedNodeId) return;
        if (!nodeEntry.choiceNodeEntry) return;

        // If we have not added the node yet, add it.
        if (!(nodeEntry.relatedNodeId in result.nodes)) {
          // @ts-ignore
          result.nodes[nodeEntry.relatedNodeId] = {
            value: nodeEntry.choiceNodeEntry.value,
            count: 0,
            sumScore: 0,
            maxScore: -Infinity,
            minScore: +Infinity
          }
        }

        // @ts-ignore
        let lookupNode = result.nodes[nodeEntry.relatedNodeId];

        // Add max-score, min-score, count, and a sum of all scores
        // @ts-ignore
        if (rootValue > lookupNode.maxScore) result.nodes[nodeEntry.relatedNodeId].maxScore = rootValue;
        // @ts-ignore
        if (rootValue < lookupNode.minScore) result.nodes[nodeEntry.relatedNodeId].minScore = rootValue;
        // @ts-ignore
        result.nodes[nodeEntry.relatedNodeId].count += 1;
        // @ts-ignore
        result.nodes[nodeEntry.relatedNodeId].sumScore += rootValue;
      })

      return result;
    }, { nodes: {} });

    // @ts-ignore
    const choices: [string, SessionChoiceGroupValue][] = Object.entries(nodeEntryStatistics['nodes']);



    return choices.map(([choiceId, choiceStatistics]) => ({
      averageValue: choiceStatistics.sumScore / choiceStatistics.count,
      choiceValue: choiceStatistics.value,
      count: choiceStatistics.count,
      max: choiceStatistics.maxScore,
      min: choiceStatistics.minScore,
    }))
  }

  private getPathsSummary = async (
    dialogueId: string,
    startDate: Date,
    endDate: Date
  ): Promise<NexusGenFieldTypes['DialoguePathsSummaryType']> => {
    const nodeCounts = await this.prismaAdapter.groupNodeEntriesBetweenDates(dialogueId, startDate, endDate);
    const dialogue = await this.prismaAdapter.getNodesAndEdges(dialogueId);

    if (!dialogue?.nodes) return {
      mostCriticalPath: null,
      mostPopularPath: null,
    }

    const dialogueTree = new DialogueTree().initFromPrismaNodes(dialogue.nodes, dialogue.edges);

    const selectPopularNode = (node: DialogueTreeNode) => {
      const candidateEdges = node.isParentNodeOf.map(edge => ({
        ...edge,
        edgeCount: nodeCounts.find((edgeCount) => edgeCount.relatedNodeId === edge?.childNodeId)
      }));

      return maxBy(candidateEdges, (edge) => edge.edgeCount);
    };

    const branches = dialogueTree.getBranchesByRootSlider();

    const negativePath = traverseTree(branches.negativeBranch.rootEdge?.childNode, selectPopularNode);
    const negativeNodeId = negativePath.getLastNode().id;
    const negativePathCount = nodeCounts.find((edgeCount => edgeCount.relatedNodeId === negativeNodeId))?._count;
    const positivePath = traverseTree(branches.positiveBranch.rootEdge?.childNode, selectPopularNode);
    const positiveNodeId = positivePath.getLastNode().id;
    const positivePathCount = nodeCounts.find((edgeCount => edgeCount.relatedNodeId === positiveNodeId))?._count;

    return {
      mostCriticalPath: {
        edges: negativePath.edges,
        nodes: negativePath.nodes,
        callToAction: negativePath.callToActionId
          ? dialogue.nodes.find(node => node.id === negativePath.callToActionId) : null,
        dialoguePathSummary: {
          countEntries: negativePathCount || 0,
        }
      },
      mostPopularPath: {
        edges: positivePath.edges,
        nodes: positivePath.nodes,
        callToAction: positivePath.callToActionId
        ? dialogue.nodes.find(node => node.id === positivePath.callToActionId) : null,
        dialoguePathSummary: {
          countEntries: positivePathCount || 0,
        }
      }
    }
  }
}
