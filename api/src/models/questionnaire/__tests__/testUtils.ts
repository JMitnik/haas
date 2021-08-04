import { PrismaClient } from "@prisma/client";

export const clearDialogueDatabase = async (prisma: PrismaClient) => {
  const deleteSliderNodes = prisma.sliderNode.deleteMany({});
  const deleteTextBoxNodes = prisma.textboxNodeEntry.deleteMany({});
  const deleteRegistrationNodes = prisma.registrationNodeEntry.deleteMany({});
  const deleteLinkNodes = prisma.linkNodeEntry.deleteMany({});
  const deleteChoiceNodes = prisma.choiceNodeEntry.deleteMany({});
  const deleteNodeEntries = prisma.nodeEntry.deleteMany({});
  const deleteSessions = prisma.session.deleteMany({});
  const deleteEdgeConditions = prisma.questionCondition.deleteMany({})
  const deleteEdges = prisma.edge.deleteMany({});
  const deleteQuestionOptions = prisma.questionOption.deleteMany({});
  const deleteQuestions = prisma.questionNode.deleteMany({});
  const deleteTags = prisma.tag.deleteMany({});
  const deleteDialogues = prisma.dialogue.deleteMany({});
  const deleteCustomers = prisma.customer.deleteMany({});

  await prisma.$transaction([
    deleteSliderNodes,
    deleteTextBoxNodes,
    deleteRegistrationNodes,
    deleteLinkNodes,
    deleteChoiceNodes,
    deleteNodeEntries,
    deleteSessions,
    deleteEdgeConditions,
    deleteEdges,
    deleteQuestionOptions,
    deleteQuestions,
    deleteTags,
    deleteDialogues,
    deleteCustomers,
  ]);
}