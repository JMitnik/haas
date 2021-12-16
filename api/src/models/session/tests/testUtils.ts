// TODO: Remove and replace after merging Daan's PR

import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
  if (!(process.env.NODE_ENV === 'test')) return;

  await prisma.$transaction([
    prisma.formNodeFieldEntryData.deleteMany({}),
    prisma.formNodeField.deleteMany({}),
    prisma.formNodeEntry.deleteMany({}),
    prisma.sliderNodeEntry.deleteMany({}),
    prisma.choiceNodeEntry.deleteMany({}),
    prisma.videoNodeEntry.deleteMany({}),
    prisma.nodeEntry.deleteMany({}),
    prisma.sessionEventChoiceValue.deleteMany({}),
    prisma.sessionEventSliderValue.deleteMany({}),
    prisma.sessionEvent.deleteMany({}),
    prisma.session.deleteMany({}),
    prisma.userOfCustomer.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.questionNode.deleteMany({}),
    prisma.dialogue.deleteMany({}),
    prisma.customer.deleteMany({}),
  ]);
}
