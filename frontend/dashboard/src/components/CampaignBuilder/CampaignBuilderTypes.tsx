import { EditCampaignVariantEdgeInputType, EditCampaignVariantInputType } from 'types/generated-types';

export type ActiveFormType = 'CampaignVariantForm' | 'CampaignForm';

export interface VariantType extends EditCampaignVariantInputType {
  followUpMetric?: string;
  followUpAmount?: number;
  repeatMetric?: string;
  repeatAmount?: number;
  variantEdge?: VariantEdgeType | null;
  hasProblem?: boolean;
}

export interface VariantEdgeType extends EditCampaignVariantEdgeInputType {
  childVariant?: VariantType | null;
}

export interface ActiveFormProps {
  type: ActiveFormType;
  activeVariantEdgeIndex?: string;
}
