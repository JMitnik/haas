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
import { ChevronDown, Plus } from 'react-feather';
import { CampaignVariantForm } from './CampaignVariantForm';

interface VariantFormProblems {

}

interface CampaignState extends EditCampaignInputType {
  variants: VariantType[];
  addEmptyVariant: () => void;
  activeForm?: ActiveFormProps | undefined;
  setActiveForm: (activeFormType: ActiveFormType, activeDirectVariantIndex?: number) => void;
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
  setActiveForm: (activeFormType: ActiveFormType, activeDirectVariantIndex?: number) => set(state => {
    state.activeForm = {
      activeDirectVariantIndex,
      type: activeFormType
    };
  }),

  addEmptyVariant: () => {
    set(state => {
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
    })
  },
})));



export const AddCampaignEdge = ({ onClick }: { onClick?: () => void }) => (
  <LS.BuilderEdgeContainer>
    <LS.BuilderEdge />
    {onClick && (
      <LS.BuilderAddContainer>
        <UI.IconButton
          borderRadius="100%"
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          icon={Plus}
          aria-label="Add"
          onClick={onClick}
        />
      </LS.BuilderAddContainer>
    )}
    <LS.EdgeFoot>
      <UI.Icon>
        <ChevronDown />
      </UI.Icon>
    </LS.EdgeFoot>
  </LS.BuilderEdgeContainer>
)

export const CampaignBuilder = () => {
  const { variants, label, initializeCampaign, setActiveForm, activeForm, addEmptyVariant } = useCampaignStore();
  const { t } = useTranslation();

  console.log(activeForm);

  return (
    <LS.BuilderContainer>
      <LS.BuilderCanvas>
        {!label ? (
          <UI.Div minWidth="500px">
            <UI.Div bg="white">
              <UI.IllustrationCard text="Get started with your campaign" svg={<SelectIll />}>
                <UI.Button onClick={initializeCampaign}>Initialize campaign</UI.Button>
              </UI.IllustrationCard>
            </UI.Div>
          </UI.Div>
        ) : (
          <UI.Div>
            <CampaignStep label={label} activeForm={activeForm} type='CampaignForm' onStepClick={setActiveForm}>
              {({ isActive, onFormChange }) => (
                <>
                  <UI.Div gridColumn="4/5">
                    <LS.BuilderLabel isActive={isActive}>CAMPAIGN</LS.BuilderLabel>
                  </UI.Div>
                  <UI.Div gridColumn="5 / 9">
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
            {variants.length === 0 && (
              <UI.Flex alignItems="center" justifyContent="center">
                <AddCampaignEdge onClick={() => addEmptyVariant()} />
              </UI.Flex>
            )}
            {variants.map((variant, index) => (
              <UI.Div key={index}>
                <UI.Flex justifyContent="center">
                  <AddCampaignEdge />
                </UI.Flex>
                <CampaignStep
                  label={label}
                  activeForm={activeForm}
                  type="CampaignVariantForm"
                  directVariantIndex={index}
                  onStepClick={setActiveForm}
                >
                  {({ isActive, onFormChange }) => (
                    <>
                      <UI.Div gridColumn="4/5">
                        <LS.BuilderLabel isActive={isActive}>{index + 1}</LS.BuilderLabel>
                      </UI.Div>
                      <UI.Div gridColumn="5 / 9">
                        <UI.Card isActive={isActive} bg="white" onClick={onFormChange}>
                          <UI.CardBody>
                            {variant.label}
                          </UI.CardBody>
                        </UI.Card>
                      </UI.Div>
                    </>
                  )}
                </CampaignStep>
              </UI.Div>
            ))}
          </UI.Div>
        )}
      </LS.BuilderCanvas>
      <LS.BuilderEditPane>
        {activeForm?.type === 'CampaignForm' && (
          <CampaignForm label={label} />
        )}
        {activeForm?.type === 'CampaignVariantForm' && activeForm.activeDirectVariantIndex != undefined && (
          <CampaignVariantForm variant={variants[activeForm.activeDirectVariantIndex]} />
        )}
      </LS.BuilderEditPane>
    </LS.BuilderContainer>
  )
};