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
  getEdgeById(edgeId: string) {
    return this.edgePrismaAdapter.getEdgeById(edgeId);
  }

  async getConditionsById(edgeId: string): Promise<QuestionCondition[]> {
    return this.edgePrismaAdapter.getConditionsById(edgeId);
  }

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
  }

  createEdge = async (parent: QuestionNode, child: QuestionNode, conditions: any) => {
    const edge = await this.edgePrismaAdapter.create(EdgeService.constructEdge(parent, child, conditions));

    await this.questionNodePrismaAdapter.connectEdgeToQuestion(parent.id, edge.id);
  };

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
}

export default EdgeService;
