import { Prisma, PrismaClient, QuestionNode } from "@prisma/client";
import { NodeWithEdge } from "./DialogueStatisticsServiceTypes";
import { NodeService } from '../QuestionNode/NodeService'

export class DialogueStatisticsPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get all nodes and edges.
   */
  getNodesAndEdges = async (dialogueId: string) => {
    const dialogueWithNodes = await this.prisma.dialogue.findUnique({
      where: { id: dialogueId },
      include: {
        questions: {
          include: {
            isParentNodeOf: {
              include: {
                conditions: true
              }
            },
          }
        },
        edges: true
      }
    });

    return {
      nodes: dialogueWithNodes?.questions || [],
      edges: dialogueWithNodes?.edges || []
    };
  }

  /**
   * Fetch all sessions between startDate and endDate, with sliderNodeEntries and choiceNodeEntries
   **/
  getSessionsBetweenDates = async (dialogueId: string, startDate?: Date, endDate?: Date) => {
    const sessions = await this.prisma.session.findMany({
      where: {
        AND: [
          { dialogueId },
          { createdAt: startDate ? { gte: new Date(startDate) } : undefined },
          { createdAt: endDate ? { lte: new Date(endDate) } : undefined },
        ]
      },
      include: {
        nodeEntries: {
          include: {
            sliderNodeEntry: true,
            choiceNodeEntry: true,
            relatedNode: {
              select: {
                isRoot: true
              }
            }
          },
        }
      }
    });

    return sessions;
  }

  /**
   * Gets nodes with statistics, per branch, along with count.
   * */
  getNodeStatisticsByRootBranch = async (dialogueId: string, min: number, max: number) => {
    const nodeCounts = await this.countNodeEntriesByRootBranch(dialogueId, min, max);
    const { nodes, edges } = await this.getNodesAndEdges(dialogueId);

    return nodes.map(node => ({
      ...node,
      statistics: {
        count: nodeCounts.find(nodeCount => nodeCount.relatedNodeId ===node.id)?._count || 0
      }
    }));
  }

  /**
   * Count node-entries by condition of root branch.
   *
   * Example: count all node-entries where root slider is between 0 and 40 (and return their IDS).
   */
  countNodeEntriesByRootBranch = async (dialogueId: string, min: number, max: number) => {
    const nodeEntryCounts = this.prisma.nodeEntry.groupBy({
      by: ['relatedNodeId'],
      _count: true,
      where: {
        // Where a session contains ...
        session: {
          AND: [
            {
              nodeEntries: {
                // ...contains at least one node-entry which ...
                some: {
                  AND: [
                    // 1) is a root node-entry
                    { relatedNode: { isRoot: true, } },
                    // 2) is a slider-node entry with a value smaller than max
                    {
                      sliderNodeEntry: {
                        value: {
                          lte: max
                        }
                      }
                    },
                    // 3) and is also a slider-node entry with a value larger than max
                    {
                      sliderNodeEntry: {
                        value: {
                          gt: min
                        }
                      }
                    }
                  ]
                }
              }
            },
            {
              dialogueId: dialogueId
            }
          ]
        }
      }
    })

    return nodeEntryCounts;
  }
}
