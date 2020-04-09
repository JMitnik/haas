import { prisma, QuestionNode, EdgeCreateInput } from '../../generated/prisma-client';

class EdgeResolver {
  static constructEdge(
    parentNodeEntry: QuestionNode,
    childNodeEntry: QuestionNode,
    conditions: any,
  ) : EdgeCreateInput {
    return {
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
    const edge = await prisma.createEdge(EdgeResolver.constructEdge(parent, child, conditions));

    await prisma.updateQuestionNode({
      where: {
        id: parent.id,
      },
      data: {
        edgeChildren: {
          connect: [{ id: edge.id }],
        },
      },
    });
  };
}

export default EdgeResolver;
