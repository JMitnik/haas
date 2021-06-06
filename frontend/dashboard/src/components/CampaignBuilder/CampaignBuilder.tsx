import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import create, { SetState } from 'zustand';
import produce from 'immer';
import { devtools } from 'zustand/middleware'

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
import { useCampaignStore } from './CampaignStore';
import { RecursiveCampaignStep } from './RecursiveCampaignStep';
import { get } from 'lodash';

type EdgeType = 'Weights' | 'Normal';

interface IncomingCampaignEdgeProps {
  type?: EdgeType;
  isActive?: boolean;
}

export const IncomingCampaignEdge = ({ type = 'Weights', isActive }: IncomingCampaignEdgeProps) => {
  const { t } = useTranslation();

  return (
    <LS.BuilderEdgeContainer isActive={isActive}>
      <LS.BuilderEdge />
      {type === 'Weights' && (
        <LS.BuilderEdgeLabel>
          100%
        </LS.BuilderEdgeLabel>
      )}
      <LS.EdgeFoot>
        <UI.Icon>
          <ChevronDown />
        </UI.Icon>
      </LS.EdgeFoot>
    </LS.BuilderEdgeContainer>
  )
};

export const AddCampaignEdge = ({ onClick, type = 'Normal' }: { onClick?: () => void, type?: EdgeType }) => (
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
    {type === 'Weights' && (
      <LS.BuilderEdgeLabel>
        100%
      </LS.BuilderEdgeLabel>
    )}
    <LS.EdgeFoot>
      <UI.Icon>
        <ChevronDown />
      </UI.Icon>
    </LS.EdgeFoot>
  </LS.BuilderEdgeContainer>
)

const getParentIndex = (variantIndex: string): string | undefined => {
  const possibleVariantIndex = variantIndex.lastIndexOf('.children[0].childVariant');

  if (possibleVariantIndex) {
    return variantIndex.slice(0, possibleVariantIndex);
  }

  return undefined;
}

const getParentEdgeIndex = (variantIndex: string): string | undefined => {
  const possibleVariantIndex = variantIndex.lastIndexOf('.childVariant');

  if (possibleVariantIndex) {
    return variantIndex.slice(0, possibleVariantIndex);
  }

  return undefined;
}

export const CampaignBuilder = () => {
  const {
    variants,
    label,
    initializeCampaign,
    setActiveForm,
    activeForm,
    addEmptyVariant,
    editCampaign,
    editCampaignVariant
  } = useCampaignStore();
  const { t } = useTranslation();
  console.log(variants);

  const activeVariant = activeForm?.activeDirectVariantIndex ?
    get(variants, activeForm?.activeDirectVariantIndex, undefined) : undefined;

  const parentVariantIndex = activeForm?.activeDirectVariantIndex ?
    getParentIndex(activeForm?.activeDirectVariantIndex): undefined;
  const parentActiveVariant = parentVariantIndex ? get(variants, parentVariantIndex, undefined): undefined;


  const parentVariantEdgeIndex = activeForm?.activeDirectVariantIndex ?
    getParentEdgeIndex(activeForm?.activeDirectVariantIndex): undefined;
  const parentVariantEdge = parentVariantEdgeIndex ? get(variants, parentVariantEdgeIndex, undefined): undefined;

  return (
    <LS.BuilderContainer>
      <LS.BuilderCanvas>
        {!label ? (
          <UI.Div minWidth="500px">
            <UI.Div bg="white">
              <UI.IllustrationCard text="Get started with your campaign" svg={<SelectIll />}>
                <UI.Button onClick={initializeCampaign}>Start your new campaign</UI.Button>
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
                <RecursiveCampaignStep
                  activeForm={activeForm}
                  addEmptyVariant={addEmptyVariant}
                  setActiveForm={setActiveForm}
                  rootIndex={`${index}`}
                  variant={variant}
                />
              </UI.Div>
            ))}
          </UI.Div>
        )}
      </LS.BuilderCanvas>
      <LS.BuilderEditPane>
        {activeForm?.type === 'CampaignForm' && (
          <CampaignForm label={label} onChange={editCampaign} />
        )}
        {activeForm?.type === 'CampaignVariantForm' && activeVariant && activeForm.activeDirectVariantIndex != undefined && (
          <CampaignVariantForm
            key={activeForm.activeDirectVariantIndex}
            variantIndex={activeForm.activeDirectVariantIndex}
            variant={activeVariant}
            pariantVariantEdgeIndex={parentVariantEdgeIndex}
            parentVariantEdge={parentVariantEdge}
            onChange={editCampaignVariant}
          />
        )}
      </LS.BuilderEditPane>
    </LS.BuilderContainer>
  )
};
