import { prisma, QuestionNode } from '../../generated/prisma-client';

class EdgeResolver {
  static constructEdge = async (parent: QuestionNode, child: QuestionNode, conditions: any) => {
    const edge = await prisma.createEdge({
      parentNode: {
        connect: {
          id: parent.id,
        },
      },
      conditions: {
        create: [conditions],
      },
      childNode: {
        connect: {
          id: child.id,
        },
      },
    });

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
