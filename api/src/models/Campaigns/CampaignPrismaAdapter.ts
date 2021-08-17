import { PrismaClient } from '@prisma/client';

import { CampaignWithVariants } from './CampaignTypes';

export class CampaignPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findCampaign = async (id: string, workspaceId: string): Promise<CampaignWithVariants | null> => {
    return this.prisma.campaign.findFirst({
      where: {
        AND: [
          { workspaceId },
          { id },
        ]
      },
      include: {
        deliveries: true,
        variantsEdges: {
          include: {
            campaignVariant: {
              include: {
                dialogue: true,
                workspace: true,
                customVariables: true,
              }
            },
          }
        }
      }
    });
  }
}
