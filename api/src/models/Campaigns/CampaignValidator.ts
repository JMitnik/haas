import { PrismaClient } from "@prisma/client";
import { NexusGenFieldTypes, NexusGenInputs } from "../../generated/nexus";
import { CampaignPrismaAdapter } from "./CampaignPrismaAdapter";
import { workspaceId } from "./__tests__/testUtils";

export class CampaignValidator {
  prisma: PrismaClient;
  prismaAdapter: CampaignPrismaAdapter;

  constructor(prisma: PrismaClient, prismaAdapter: CampaignPrismaAdapter) {
    this.prisma = prisma;
    this.prismaAdapter = prismaAdapter;
  }

  async validateWorkspaceAndDialogueExists(workspaceId: string, dialogueId: string): Promise<NexusGenFieldTypes['ProblemFieldType'][]> {
    let problems: NexusGenFieldTypes['ProblemFieldType'][] = [];
    const workspaceWithDialogues = await this.prisma.customer.findOne({
      where: { id: workspaceId },
      include: {
        dialogues: true
      }
    });


    if (!workspaceWithDialogues) {
      problems.push({
        field: 'workspaceId',
        problem: 'DOES_NOT_EXIST'
      })
    }

    const dialogue = workspaceWithDialogues?.dialogues.find(dialogue => dialogue.id === dialogueId);
    console.log(dialogueId);

    if (!dialogue) {
      problems.push({
        field: 'dialogueId',
        problem: 'DOES_NOT_EXIST'
      });
    }

    return problems;
  }

  async validateCreateCampaignInput(
    createCampaignInput: NexusGenInputs['CreateCampaignInputType']
    ): Promise<NexusGenFieldTypes['ProblemFieldType'][]> {
      let problems: NexusGenFieldTypes['ProblemFieldType'][] = [];

      problems.push(
        ...(await this.validateWorkspaceAndDialogueExists(
          createCampaignInput.workspaceId,
          createCampaignInput?.variantEdges?.[0].childVariant?.dialogueId || ''
        ))
      );

      return problems;
  }
}
