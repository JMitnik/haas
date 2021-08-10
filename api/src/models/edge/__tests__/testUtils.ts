import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
    const delEdgeConditions = prisma.questionCondition.deleteMany({});
    const delEdges = prisma.edge.deleteMany({});
    const delNodes = prisma.questionNode.deleteMany({});
    const delDialogues = prisma.dialogue.deleteMany({});
    const delCustomers = prisma.customer.deleteMany({});

    await prisma.$transaction([
        delEdgeConditions,
        delEdges,
        delNodes,
        delDialogues,
        delCustomers
    ]);
};