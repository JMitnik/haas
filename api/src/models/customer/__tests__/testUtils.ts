import { PrismaClient } from "@prisma/client";

export const clearCustomerDatabase = async (prisma: PrismaClient) => {
  const deleteTags = prisma.tag.deleteMany({});
  const deleteRoles = prisma.role.deleteMany({});
  const colourSettings = prisma.colourSettings.deleteMany({});
  const fontSettings = prisma.fontSettings.deleteMany({});
  const customerSettings = prisma.customerSettings.deleteMany({});
  const deleteDialogues = prisma.dialogue.deleteMany({});
  const deleteWorkspaces = prisma.customer.deleteMany({});


  await prisma.$transaction([
    deleteTags,
    deleteRoles,
    colourSettings,
    fontSettings,
    customerSettings,
    deleteDialogues,
    deleteWorkspaces,
  ]);
}