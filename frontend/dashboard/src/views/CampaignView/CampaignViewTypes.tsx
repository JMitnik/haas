import { CampaignVariantType as GeneratedCampaignVariantType } from 'types/generated-types';

export interface CampaignVariantType extends Omit<GeneratedCampaignVariantType, 'dialogue' | 'workspace'> {
  dialogue: {
    id: string;
    title: string;
  }
}

export interface CampaignType {
  label: string;
  variants: CampaignVariantType[];
}
