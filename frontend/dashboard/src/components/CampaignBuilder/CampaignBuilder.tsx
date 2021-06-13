import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import produce from 'immer';

// @ts-ignore
const immer = config => (set, get) => config(fn => set(produce(fn)), get);

import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';

import * as LS from './CampaignBuilderStyles';
import { CampaignForm } from './CampaignForm';
import { CampaignStep } from './CampaignStep';
import { ChevronDown, Plus } from 'react-feather';
import { CampaignVariantForm } from './CampaignVariantForm';
import { useCampaignStore } from './CampaignStore';
import { RecursiveCampaignStep } from './RecursiveCampaignStep';
import { get } from 'lodash';
import { CampaignType } from 'types/generated-types';

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
  const possibleVariantIndex = variantIndex.lastIndexOf('.children[0]');

  if (possibleVariantIndex) {
    return variantIndex.slice(0, possibleVariantIndex);
  }

  return undefined;
}

interface CampaignBuilderProps {
  onSave: (campaign: any) => void;
}

export const CampaignBuilder = ({ onSave }: CampaignBuilderProps) => {
  const {
    id,
    variantEdges,
    label,
    initializeCampaign,
    setActiveForm,
    activeForm,
    addEmptyVariant,
    editCampaign,
    editCampaignVariant
  } = useCampaignStore();
  const { t } = useTranslation();

  const activeVariantEdge = activeForm?.activeVariantEdgeIndex ?
    get(variantEdges, `${activeForm?.activeVariantEdgeIndex}`, undefined) : undefined;

  const parentVariantIndex = activeForm?.activeVariantEdgeIndex ?
    getParentIndex(activeForm?.activeVariantEdgeIndex): undefined;
  const parentActiveVariant = parentVariantIndex ? get(variantEdges, parentVariantIndex, undefined): undefined;

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
            {variantEdges.length === 0 && (
              <UI.Flex alignItems="center" justifyContent="center">
                <AddCampaignEdge onClick={() => addEmptyVariant()} />
              </UI.Flex>
            )}
            {variantEdges.map((variantEdge, index) => (
              <UI.Div key={index}>
                <RecursiveCampaignStep
                  activeForm={activeForm}
                  addEmptyVariant={addEmptyVariant}
                  setActiveForm={setActiveForm}
                  rootIndex={`${index}`}
                  variantEdge={variantEdge}
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
        {activeForm?.type === 'CampaignVariantForm' && activeVariantEdge && activeForm.activeVariantEdgeIndex != undefined && (
          <CampaignVariantForm
            key={activeForm.activeVariantEdgeIndex}
            variantEdge={activeVariantEdge}
            variantEdgeIndex={activeForm.activeVariantEdgeIndex}
            onChange={editCampaignVariant}
          />
        )}
      </LS.BuilderEditPane>

      <LS.BuilderControls>
        <UI.Flex>
          <UI.Button onClick={() => onSave({ id, label: (label || ''), variantEdges })}>Save</UI.Button>
        </UI.Flex>
      </LS.BuilderControls>
    </LS.BuilderContainer>
  )
};
