import { PrismaClient } from "@prisma/client"

export const clearDatabase = async (prisma: PrismaClient) => {
    const delNodeEntries = prisma.nodeEntry.deleteMany({});
    const delFormNodeEntries = prisma.formNodeEntry.deleteMany({});
    const delFormNodeFields = prisma.formNodeField.deleteMany({});
    const delFormNodeFieldEntryDatas = prisma.formNodeFieldEntryData.deleteMany({});
    const delSessions = prisma.session.deleteMany({});
    const delDialogues = prisma.dialogue.deleteMany({});
    const delCustomers = prisma.customer.deleteMany({});

    await prisma.$transaction([
        delNodeEntries,
        delFormNodeEntries,
        delFormNodeFields,
        delFormNodeFieldEntryDatas,
        delSessions,
        delDialogues,
        delCustomers,
    ])
}