import { EditCampaignVariantEdgeInputType, EditCampaignVariantInputType } from 'types/generated-types';

export type ActiveFormType = 'CampaignVariantForm' | 'CampaignForm';

export interface VariantType extends EditCampaignVariantInputType {
  hasProblem?: boolean;
}

export interface VariantEdgeType extends EditCampaignVariantEdgeInputType {}

export interface ActiveFormProps {
  type: ActiveFormType;
  activeVariantEdgeIndex?: string;
}
