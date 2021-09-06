import { PrismaClient } from "@prisma/client"

export const clearDatabase = async (prisma: PrismaClient) => {
    const delSliderNodeEntries = prisma.sliderNodeEntry.deleteMany({ });
    const delVideoNodeEntries = prisma.videoNodeEntry.deleteMany({ });
    const delChoiceNodeEntries = prisma.choiceNodeEntry.deleteMany({ });
    const delNodeEntries = prisma.nodeEntry.deleteMany({ });
    const delFormNodeFields = prisma.formNodeField.deleteMany({ });
    const delFormNodeFieldEntryDatas = prisma.formNodeFieldEntryData.deleteMany({ });
    const delFormNodeEntries = prisma.formNodeEntry.deleteMany({ });
    const delformNodes = prisma.formNode.deleteMany({ });
    const delSessions = prisma.session.deleteMany({ });
    const delQuestions = prisma.questionNode.deleteMany({ });
    const delDialogues = prisma.dialogue.deleteMany({ });
    const delCustomers = prisma.customer.deleteMany({ });

    await prisma.$transaction([
        delSliderNodeEntries,
        delVideoNodeEntries,
        delChoiceNodeEntries,
        delFormNodeEntries,
        delFormNodeFieldEntryDatas,
        delFormNodeFields,
        delformNodes,
        delNodeEntries,
        delSessions,
        delQuestions,
        delDialogues,
        delCustomers,
    ])
}