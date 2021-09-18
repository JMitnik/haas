import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
    const delQuestionNodes = prisma.questionNode.deleteMany({});
    const delVideoNodes = prisma.videoEmbeddedNode.deleteMany({});
    const delSliderMarkers = prisma.sliderNodeMarker.deleteMany({})
    const delSliderNodes = prisma.sliderNode.deleteMany({});
    const delShareNodes = prisma.share.deleteMany({});
    const delLinkNodes = prisma.link.deleteMany({});
    const delFormNodes = prisma.formNode.deleteMany({});
    const delFormFields = prisma.formNodeField.deleteMany({});
    const delDialogues = prisma.dialogue.deleteMany({});
    const delWorkspaces = prisma.customer.deleteMany({});
    const delquestionOptions = prisma.questionOption.deleteMany({});
    const delEdges = prisma.edge.deleteMany({});

    await prisma.$transaction([
        delVideoNodes,
        delSliderMarkers,
        delSliderNodes,
        delShareNodes,
        delLinkNodes,
        delFormFields,
        delFormNodes,
        delquestionOptions,
        delEdges,
        delQuestionNodes,
        delDialogues,
        delWorkspaces
    ])
};