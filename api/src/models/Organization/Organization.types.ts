import { NexusGenEnums, NexusGenFieldTypes } from '../../generated/nexus';

export type OrganizationLayerType = NexusGenEnums['OrganizationLayerType'];
export type OrganizationLayer = NexusGenFieldTypes['OrganizationLayer'];

export enum OrganizationLayerTypeEnum {
  GROUP = 'GROUP',
  DIALOGUE = 'DIALOGUE',
  INTERACTION = 'INTERACTION',
}
