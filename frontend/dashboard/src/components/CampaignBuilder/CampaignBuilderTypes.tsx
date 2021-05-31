import { EditCampaignVariantInputType } from 'types/generated-types';

export type ActiveFormType = 'CampaignVariantForm' | 'CampaignForm';

export interface VariantType extends EditCampaignVariantInputType {
  hasProblem?: boolean;
}

export interface ActiveFormProps {
  type: ActiveFormType;
  activeDirectVariantIndex?: number;
}