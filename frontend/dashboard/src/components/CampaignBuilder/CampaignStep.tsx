import * as UI from '@haas/ui';


import { ActiveFormProps, ActiveFormType, VariantType } from './CampaignBuilderTypes';
import * as LS from './CampaignBuilderStyles';

interface CampaignStepProps {
  onStepClick: any;
  children?: ({ isActive, onFormChange }: any) => React.ReactNode;
  directVariantIndex?: number;
  activeForm?: ActiveFormProps;
  label?: string;
  type?: ActiveFormType;
  variant?: VariantType;
}

export const BaseCampaignStep = ({ activeForm, onStepClick, label, children }: CampaignStepProps) => {
  const handleActiveForm = () => onStepClick('CampaignForm');
  const isActive = activeForm?.type === 'CampaignForm';
  console.log(activeForm);

  return (
    <LS.CampaignStepContainer>
      {children?.({ isActive, onFormChange: handleActiveForm })}
    </LS.CampaignStepContainer>
  )
};

export const CampaignVariantStep = ({ activeForm, onStepClick, children, directVariantIndex }: CampaignStepProps) => {
  const handleActiveForm = () => onStepClick('CampaignVariantForm', directVariantIndex);
  const isActive = activeForm?.type === 'CampaignVariantForm' && activeForm.activeDirectVariantIndex == directVariantIndex;

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