import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
    const delQuestionNodes = prisma.questionNode.deleteMany({});
    const delVideoNodes = prisma.videoEmbeddedNode.deleteMany({});
    const delSliderMarkers = prisma.sliderNodeMarker.deleteMany({})
    const delSliderNodes = prisma.sliderNode.deleteMany({});
    const delShareNodes = prisma.share.deleteMany({});
    const delLinkNodes = prisma.link.deleteMany({});

    await prisma.$transaction([
        delVideoNodes,
        delSliderMarkers,
        delSliderNodes,
        delShareNodes,
        delLinkNodes,
        delQuestionNodes,
    ])
};