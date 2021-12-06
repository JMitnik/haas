import { DeliveryStatusTypeEnum, Prisma, PrismaClient } from '@prisma/client';

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findWorkspaceByAutomationId = async (automationId: string) => {
    const automation = await this.prisma.automation.findUnique({
      where: {
        id: automationId,
      },
      include: {
        workspace: true,
      },
    });
    return automation?.workspace || null;
  }

  findAutomationsByWorkspaceId = async (workspaceId: string) => {
    const workspace = await this.prisma.customer.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        automations: true,
      }
    });
    return workspace?.automations || [];
  };

}
