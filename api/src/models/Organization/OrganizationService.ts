import { PrismaClient } from '@prisma/client';
import { maxBy } from 'lodash';
import { isPresent } from 'ts-is-present';

import CustomerService from '../../models/customer/CustomerService';
import { makeLayer } from './Organization.helpers';
import { OrganizationLayer, OrganizationLayerTypeEnum } from './Organization.types';

export class OrganizationService {
  private workspaceService: CustomerService;

  constructor(prismaClient: PrismaClient) {
    this.workspaceService = new CustomerService(prismaClient);
  };

  /**
   * Gets all organization layers: this starts with GROUPS => DIALOGUE/TEAM => INTERACTION
   * @param workspaceId
   * @returns
   */
  public async getOrganizationLayers(workspaceId: string): Promise<OrganizationLayer[]> {
    const dialogues = await this.workspaceService.getDialogues(workspaceId);
    const dialogueTitles = dialogues.map((dialogue) => dialogue.title.split('-'));

    // Find the dialogue with the most amount of layers
    const deepestLayers = maxBy(dialogueTitles, (splittedTitle) => splittedTitle.length) as string[];

    // Every organization consists at least of a dialogue and interaction layer.
    if (!deepestLayers.length) return [
      makeLayer(workspaceId, 0, OrganizationLayerTypeEnum.DIALOGUE),
      makeLayer(workspaceId, 1, OrganizationLayerTypeEnum.INTERACTION),
    ];

    const groupLayers = [...Array(deepestLayers.length - 1)].map(
      (_, index) => makeLayer(workspaceId, index, OrganizationLayerTypeEnum.GROUP)
    );

    const layers: OrganizationLayer[] = [
      // Fill starting layers with groups
      ...groupLayers,
      // Then add dialogue
      makeLayer(workspaceId, deepestLayers.length, OrganizationLayerTypeEnum.DIALOGUE),
      // Then add interaction
      makeLayer(workspaceId, deepestLayers.length + 1, OrganizationLayerTypeEnum.INTERACTION),
    ].filter(isPresent);

    return layers;
  }
};

