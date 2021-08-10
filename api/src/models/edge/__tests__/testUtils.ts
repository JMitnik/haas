import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
    const delEdges = prisma.edge.deleteMany({});
    const delNodes = prisma.questionNode.deleteMany({});
    const delDialogues = prisma.dialogue.deleteMany({});
    const delCustomers = prisma.customer.deleteMany({});

    await prisma.$transaction([
        delEdges,
        delNodes,
        delDialogues,
        delCustomers
    ]);
};