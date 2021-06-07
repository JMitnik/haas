import * as UI from '@haas/ui';


import { ActiveFormProps, ActiveFormType, VariantType } from './CampaignBuilderTypes';
import * as LS from './CampaignBuilderStyles';

interface CampaignStepProps {
  onStepClick: any;
  children?: ({ isActive, onFormChange }: any) => React.ReactNode;
  variantEdgeIndex?: string;
  activeForm?: ActiveFormProps;
  label?: string;
  type?: ActiveFormType;
  variant?: VariantType;
}

export const BaseCampaignStep = ({ activeForm, onStepClick, label, children }: CampaignStepProps) => {
  const handleActiveForm = () => onStepClick('CampaignForm');
  const isActive = activeForm?.type === 'CampaignForm';

  return (
    <LS.CampaignStepContainer>
      {children?.({ isActive, onFormChange: handleActiveForm })}
    </LS.CampaignStepContainer>
  )
};

export const CampaignVariantStep = ({ activeForm, onStepClick, children, variantEdgeIndex }: CampaignStepProps) => {
  const handleActiveForm = () => onStepClick('CampaignVariantForm', variantEdgeIndex);
  const isActive = activeForm?.type === 'CampaignVariantForm' && activeForm.activeVariantEdgeIndex == variantEdgeIndex;

  return (
    <LS.CampaignStepContainer>
      {children?.({ isActive, onFormChange: handleActiveForm })}
    </LS.CampaignStepContainer>
  )
};

export const CampaignStep = (props: CampaignStepProps) => {
  if (props.type === 'CampaignForm') {
    return <BaseCampaignStep {...props} />
  }

  return <CampaignVariantStep {...props} />
}
