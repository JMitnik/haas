import { EdgeCreateInput, QuestionNode } from '@prisma/client';
import prisma from '../../prisma';

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

class EdgeResolver {
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

  static createEdge = async (parent: QuestionNode, child: QuestionNode, conditions: any) => {
    const edge = await prisma.edge.create(
      { data: EdgeResolver.constructEdge(parent, child, conditions) },
    );

    await prisma.questionNode.update({
      where: {
        id: parent.id,
      },
      data: {
        children: {
          connect: [{ id: edge.id }],
        },
      },
    });
  };

  static removeNonExistingEdges = async (activeEdges: Array<string>,
    newEdges: Array<EdgeChildProps>, questionId: any) => {
    if (questionId) {
      const newEdgeIds = newEdges.map(({ id }) => id);
      const removeEdgeChildIds = activeEdges?.filter((id) => (!newEdgeIds.includes(id) && id));
      if (removeEdgeChildIds?.length > 0) {
        await prisma.edge.deleteMany({ where: { id: { in: removeEdgeChildIds } } });
      }
    }
  };
}

export default EdgeResolver;
