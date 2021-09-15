import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
    const delQuestionNodes = prisma.questionNode.deleteMany({ });
    const delVideoNodes = prisma.videoEmbeddedNode.deleteMany({ });
    const delSliderNodes = prisma.sliderNode.deleteMany({ });

    await prisma.$transaction([
        delVideoNodes,
        delSliderNodes,
        delQuestionNodes,
    ])
};