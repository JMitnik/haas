import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import create, { SetState } from 'zustand';
import produce from 'immer';

// @ts-ignore
const immer = config => (set, get) => config(fn => set(produce(fn)), get);

import { CampaignScheduleEnum, CampaignVariantEnum, EditCampaignInputType } from 'types/generated-types';
import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';

import * as LS from './CampaignBuilderStyles';
import { CampaignForm } from './CampaignForm';
import { CampaignFormType } from './CampaignFormSchema';
import { ActiveFormProps, ActiveFormType, VariantType } from './CampaignBuilderTypes';
import { CampaignStep } from './CampaignStep';

interface VariantFormProblems {

}

interface CampaignState extends EditCampaignInputType {
  variants: VariantType[];
  addEmptyVariant: () => void;
  activeForm?: ActiveFormProps | undefined;
  setActiveForm: (activeFormType: ActiveFormType, activeId?: string) => void;
  initializeCampaign: () => void;
}

const useCampaignStore = create<CampaignState>(immer((set: SetState<CampaignState>) => ({
  id: '',
  label: '',
  variants: [],
  workspaceId: '',
  activeForm: undefined,

  initializeCampaign: () => set(state => {
    state.label = 'My first campaign'
  }),
  editCampaign: (campaignFormInputs: CampaignFormType) => set(state => {
    // @ts-ignore
    state.label = campaignFormInputs?.label;
  }),
  setActiveForm: (activeFormType: ActiveFormType, activeId?: string) => set(state => {
    state.activeForm = {
      activeId,
      type: activeFormType
    };
  }),

  addEmptyVariant: () => { set(state => {
    state.variants?.push({
      dialogueId: '',
      id: '',
      scheduleType:
      CampaignScheduleEnum.General,
      body: '',
      hasProblem: false,
      type: CampaignVariantEnum.Email,
      workspaceId: '',
    });
  })},
})));

export const CampaignBuilder = () => {
  const { label, initializeCampaign, setActiveForm, activeForm } = useCampaignStore();
  const { t } = useTranslation();

  console.log(activeForm);

  return (
    <LS.BuilderContainer>
      <LS.BuilderCanvas>
        {!label ? (
          <UI.Div gridColumn="3/10">
            <UI.Div bg="white">
              <UI.IllustrationCard text={t('initialize_campaign')} svg={<SelectIll />}>
                <UI.Button onClick={initializeCampaign}>Initialize campaign</UI.Button>
              </UI.IllustrationCard>
            </UI.Div>
          </UI.Div>
        ): (
          <CampaignStep label={label} activeForm={activeForm} type='CampaignForm' onStepClick={setActiveForm}>
            {({ isActive, onFormChange }) => (
              <>
                <UI.Div gridColumn="2/3">
                  <LS.BuilderLabel isActive={isActive}>CAMPAIGN</LS.BuilderLabel>
                </UI.Div>
                <UI.Div gridColumn="3 / 9">
                  <UI.Card isActive={isActive} bg="white" onClick={onFormChange}>
                    <UI.CardBody>
                      <UI.Text color="gray.900" fontWeight="400" fontSize="1.2rem">
                        {label}
                      </UI.Text>
                    </UI.CardBody>
                  </UI.Card>
                </UI.Div>
              </>
            )}
          </CampaignStep>
        )}
      </LS.BuilderCanvas>
      <LS.BuilderEditPane>
        {activeForm?.type === 'CampaignForm' && (
          <CampaignForm label={label} />
        )}
      </LS.BuilderEditPane>
    </LS.BuilderContainer>
  )
};