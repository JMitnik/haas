import { PrismaClient } from '@prisma/client';
import { maxBy } from 'lodash';

import CustomerService from '../customer/CustomerService';
import { NexusGenEnums } from '../../generated/nexus';

enum OrganizationLayerType {
  GROUP = 'GROUP',
  DIALOGUE = 'DIALOGUE',
  INTERACTION = 'INTERACTION',
}

interface OrganizationLayer { id: string; depth: number; type: NexusGenEnums['OrganizationLayerType'] }

class OrganizationService {
  customerService: CustomerService;

  constructor(prismaClient: PrismaClient) {
    this.customerService = new CustomerService(prismaClient);
  };

  getOrganizationLayers = async (workspaceId: string) => {
    // Every organization consits at least of a dialogue and interaction layer
    const layers: OrganizationLayer[] = [
      {
        id: `${workspaceId}-0-${OrganizationLayerType.DIALOGUE}`,
        depth: 0,
        type: OrganizationLayerType.DIALOGUE,
      },
      {
        id: `${workspaceId}-1-${OrganizationLayerType.INTERACTION}`,
        depth: 1,
        type: OrganizationLayerType.INTERACTION,
      },
    ];

    const dialogues = await this.customerService.getDialogues(workspaceId);
    const dialogueTitles = dialogues.map((dialogue) => {
      return dialogue.title.split('-');
    });

    // Find the dialogue with the most amount of layers
    const deepestLayers = maxBy(dialogueTitles, (splittedTitle) => splittedTitle.length) as string[];

    if (!deepestLayers.length) return layers;

    // Substract with 1 as the last entry of the dialogue title is considered a dialogue and not a group
    const groupLayers: OrganizationLayer[] = [...Array(deepestLayers.length - 1)].map(
      () => ({
        id: '-1',
        depth: -1,
        type: OrganizationLayerType.GROUP,
      }));

    layers.unshift(...groupLayers);

    const finalLayers: OrganizationLayer[] = layers.map((layer, index) => ({
      id: `${workspaceId}-${index}-${layer.type}`,
      depth: index,
      type: layer.type,
    }));

    return finalLayers;
  }


};

export default OrganizationService;
