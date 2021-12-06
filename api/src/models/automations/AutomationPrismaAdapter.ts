import { DeliveryStatusTypeEnum, Prisma, PrismaClient } from '@prisma/client';

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findAutomationById = async (automationId: string) => {
    return this.prisma.automation.findUnique({
      where: {
        id: automationId,
      },
      include: {
        workspace: true,
        automationTrigger: {
          include: {
            event: {
              include: {
                question: true,
                dialogue: true,
              }
            },
            conditions: {
              include: {
                questionScope: true,
                dialogueScope: true,
                matchValue: true,
                workspaceScope: true,
                dialogue: true,
                question: true,
              }
            },
            actions: true,
          },
        },
      },
    });
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
