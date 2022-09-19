import { Prisma } from '@prisma/client';

export const questionNode = Prisma.validator<Prisma.QuestionNodeArgs>()({
  include: {
    videoEmbeddedNode: true,
    children: true,
    options: true,
    questionDialogue: true,
    overrideLeaf: true,
    topic: true,
  },
});

export type QuestionNode = Prisma.QuestionNodeGetPayload<typeof questionNode>;
