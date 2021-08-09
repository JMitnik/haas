import { PrismaClient } from "@prisma/client";
import { DialogueStatisticsPrismaAdapter } from "./DialogueStatisticsPrismaAdapter";

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
}
