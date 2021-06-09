import { EdgeCreateInput, QuestionNode, PrismaClient } from '@prisma/client';
import { EdgeServiceType } from './EdgeServiceType';
import { EdgePrismaAdapterType } from './EdgePrismaAdapterType';
import EdgePrismaAdapter from './EdgePrismaAdapter';
import { QuestionNodePrismaAdapterType } from '../QuestionNode/adapters/QuestionNode/QuestionNodePrismaAdapterType';
import QuestionNodePrismaAdapter from '../QuestionNode/adapters/QuestionNode/QuestionNodePrismaAdapter';

interface QuestionConditionProps {
  id?: number;
  conditionType: string;
  renderMin: number;
  renderMax: number;
  matchValue: string;
}

interface EdgeNodeProps {
  id: string;
  title: string;
}

interface EdgeChildProps {
  id?: string;
  conditions: [QuestionConditionProps];
  parentNode: EdgeNodeProps;
  childNode: EdgeNodeProps;
}

class EdgeService implements EdgeServiceType {
  edgePrismaAdapter: EdgePrismaAdapterType;
  questionNodePrismaAdapter: QuestionNodePrismaAdapterType;

  constructor(prismaClient: PrismaClient) {
    this.edgePrismaAdapter = new EdgePrismaAdapter(prismaClient);
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prismaClient);
  }
  getEdgeById(edgeId: string) {
    return this.edgePrismaAdapter.getEdgeById(edgeId);
  }

  async getConditionsById(edgeId: string): Promise<import("@prisma/client").QuestionCondition[]> {
    return this.edgePrismaAdapter.getConditionsById(edgeId);
  }

  static constructEdge(
    parentNodeEntry: QuestionNode,
    childNodeEntry: QuestionNode,
    conditions: any,
  ) : EdgeCreateInput {
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
    
    await this.questionNodePrismaAdapter.update(parent.id, {
      children: {
        connect: [{ id: edge.id }],
      },
    });
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
