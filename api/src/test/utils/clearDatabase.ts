import { PrismaClient } from 'prisma/prisma-client';

export const clearDatabase = async (prisma: PrismaClient) => {
  if (process.env.NODE_ENV === 'test') {
    await prisma.$transaction([
      prisma.formNodeFieldEntryData.deleteMany({}),
      prisma.formNodeField.deleteMany({}),
      prisma.formNodeEntry.deleteMany({}),
      prisma.sliderNodeEntry.deleteMany({}),
      prisma.choiceNodeEntry.deleteMany({}),
      prisma.videoNodeEntry.deleteMany({}),
      prisma.nodeEntry.deleteMany({}),
      prisma.session.deleteMany({}),
      prisma.automation.deleteMany({}),
      prisma.automationTrigger.deleteMany({}),
      prisma.automationEvent.deleteMany({}),
      prisma.automationConditionOperand.deleteMany({}),
      prisma.dialogueConditionScope.deleteMany({}),
      prisma.questionConditionScope.deleteMany({}),
      prisma.workspaceConditionScope.deleteMany({}),
      prisma.automationCondition.deleteMany({}),
      prisma.automationConditionBuilder.deleteMany({}),
      prisma.automationAction.deleteMany({}),
      prisma.userOfCustomer.deleteMany({}),
      prisma.comment.deleteMany({}),
      prisma.actionRequest.deleteMany({}),
      prisma.issue.deleteMany({}),
      prisma.topic.deleteMany({}),
      prisma.user.deleteMany({}),
      prisma.questionNode.deleteMany({}),
      prisma.dialogue.deleteMany({}),
      prisma.tag.deleteMany({}),
      prisma.dataPeriodSchedule.deleteMany({}),
      prisma.evaluationPeriodSchedule.deleteMany({}),
      prisma.dialogueSchedule.deleteMany({}),
      prisma.customer.deleteMany({}),
    ]);
  }
}
