import { PrismaClient } from '@prisma/client';
import { maxBy } from 'lodash';

import CustomerService from '../customer/CustomerService';
import { NexusGenEnums } from '../../generated/nexus';

enum OrganizationLayerType {
  GROUP = 'GROUP',
  DIALOGUE = 'DIALOGUE',
  INTERACTION = 'INTERACTION',
}

class OrganizationService {
  customerService: CustomerService;

  constructor(prismaClient: PrismaClient) {
    this.customerService = new CustomerService(prismaClient);
  };

  getOrganizationLayers = async (workspaceId: string) => {
    // Every organization consits at least of a dialogue and interaction layer
    const finalLayers: { type: NexusGenEnums['OrganizationLayerType'] }[] = [
      {
        type: OrganizationLayerType.DIALOGUE,
      },
      {
        type: OrganizationLayerType.INTERACTION,
      },
    ];

    const dialogues = await this.customerService.getDialogues(workspaceId);
    const dialogueTitles = dialogues.map((dialogue) => {
      return dialogue.title.split('-');
    });

    // Find the dialogue with the most amount of layers
    const deepestLayers = maxBy(dialogueTitles, (splittedTitle) => splittedTitle.length) as string[];

    if (!deepestLayers.length) return finalLayers;

    // Substract with 1 as the last entry of the dialogue title is considered a dialogue and not a group
    const groupLayers: { type: NexusGenEnums['OrganizationLayerType'] }[] = [...Array(deepestLayers.length - 1)].map(
      () => ({
        type: OrganizationLayerType.GROUP,
      }));

    finalLayers.unshift(...groupLayers);

    return finalLayers;
  }


};

export default OrganizationService;
