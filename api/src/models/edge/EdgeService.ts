import { EdgeCreateInput, QuestionNode, PrismaClient, QuestionCondition } from '@prisma/client';

import { EdgeChildProps } from './EdgeServiceType';
import EdgePrismaAdapter from './EdgePrismaAdapter';
import QuestionNodePrismaAdapter from '../QuestionNode/QuestionNodePrismaAdapter';

class EdgeService {
  edgePrismaAdapter: EdgePrismaAdapter;
  questionNodePrismaAdapter: QuestionNodePrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.edgePrismaAdapter = new EdgePrismaAdapter(prismaClient);
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prismaClient);
  }

  /**
   * Finds edge by provided ID
   * @param edgeId ID of Edge
   * @returns Edge entry corresponding provided ID
   */
  getEdgeById(edgeId: string) {
    return this.edgePrismaAdapter.getEdgeById(edgeId);
  };

  /**
   * Finds the edge conditions by provided edge ID
   * @param edgeId The  
   * @returns Edge conditions part of provided of edge ID
   */
  async getConditionsById(edgeId: string): Promise<QuestionCondition[]> {
    return this.edgePrismaAdapter.getConditionsById(edgeId);
  };

  /**
   * Constructs a prisma-ready create edge object 
   * @param parentNodeEntry QuestionNode prisma entry
   * @param childNodeEntry QuestionNode prisma entry
   * @param conditions EdgeConditions
   * @returns Prisma-ready create edge object
   */
  static constructEdge(
    parentNodeEntry: QuestionNode,
    childNodeEntry: QuestionNode,
    conditions: any,
  ): EdgeCreateInput {
    return {
      dialogue: {
        connect: {
          id: parentNodeEntry.questionDialogueId || undefined,
        },
      },
      parentNode: {
        connect: {
          id: parentNodeEntry.id,
        },
      },
      conditions: {
        create: [conditions],
      },
      childNode: {
        connect: {
          id: childNodeEntry.id,
        },
      },
    };
  };

  /**
   * Creates an Edge object in the database
   * @param parent QuestionNode 
   * @param child QuestionNode
   * @param conditions Conditions edge should conform to
   */
  createEdge = async (parent: QuestionNode, child: QuestionNode, conditions: any) => {
    const edge = await this.edgePrismaAdapter.create(EdgeService.constructEdge(parent, child, conditions));

    await this.questionNodePrismaAdapter.connectEdgeToQuestion(parent.id, edge.id);
  };

  /**
   * Removes all current edges from the database which are not part of the new set of edges
   * @param activeEdges Current set of edges
   * @param newEdges New set of edges
   * @param questionId ID of question
   */
  removeNonExistingEdges = async (activeEdges: Array<string>,
    newEdges: Array<EdgeChildProps>, questionId: any) => {
    if (questionId) {
      const newEdgeIds = newEdges.map(({ id }) => id);
      const removeEdgeChildIds = activeEdges?.filter((id) => (!newEdgeIds.includes(id) && id));
      if (removeEdgeChildIds?.length > 0) {
        await this.edgePrismaAdapter.deleteMany(removeEdgeChildIds);
      }
    }
  };
};

export default EdgeService;
