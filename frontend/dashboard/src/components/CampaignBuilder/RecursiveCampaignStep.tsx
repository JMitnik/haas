import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import produce from 'immer';

// @ts-ignore
const immer = config => (set, get) => config(fn => set(produce(fn)), get);

import { CampaignScheduleEnum, CampaignVariantEdgeConditionEnumType } from 'types/generated-types';

import * as LS from './CampaignBuilderStyles';
import { VariantEdgeType, VariantType } from './CampaignBuilderTypes';
import { CampaignStep } from './CampaignStep';
import { ChevronDown, Plus } from 'react-feather';

type EdgeType = 'Weights' | 'Normal';

interface IncomingCampaignEdgeProps {
  type?: EdgeType;
  isActive?: boolean;
  variantEdge?: VariantEdgeType;
}


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


export const IncomingCampaignEdge = ({ type, isActive, variantEdge }: IncomingCampaignEdgeProps) => {
  const { t } = useTranslation();

  return (
    <LS.BuilderEdgeContainer isActive={isActive}>
      <LS.BuilderEdge />
      {type === 'Weights' ? (
        <LS.BuilderEdgeLabel>
          100%
        </LS.BuilderEdgeLabel>
      ) : (
        <>
          {variantEdge?.condition === CampaignVariantEdgeConditionEnumType.OnNotFinished && (
            <LS.BuilderEdgeLabel>
              Not finished after {variantEdge.childVariant?.followUpAmount} {variantEdge.childVariant?.followUpMetric}
            </LS.BuilderEdgeLabel>
          )}
          {variantEdge?.condition === CampaignVariantEdgeConditionEnumType.OnNotOpened && (
            <LS.BuilderEdgeLabel>
              Not opened after {variantEdge.childVariant?.followUpAmount} {variantEdge.childVariant?.followUpMetric}
            </LS.BuilderEdgeLabel>
          )}
        </>
      )}
      <LS.EdgeFoot>
        <UI.Icon>
          <ChevronDown />
        </UI.Icon>
      </LS.EdgeFoot>
    </LS.BuilderEdgeContainer>
  );
};

interface RecursiveCampaignStepProps {
  rootIndex: string;
  parentVariant?: VariantType | undefined;
  variantEdge?: VariantEdgeType | undefined;
  activeForm: any;
  setActiveForm: any;
  addEmptyVariant: (index: string) => void;
}

export const RecursiveCampaignStep = ({
  rootIndex,
  variantEdge,
  setActiveForm,
  activeForm,
  addEmptyVariant
}: RecursiveCampaignStepProps) => {
  const variant = variantEdge?.childVariant;

  return (
    <>
      <UI.Flex justifyContent="center">
        <IncomingCampaignEdge variantEdge={variantEdge}  />
      </UI.Flex>
      <CampaignStep
        label=''
        activeForm={activeForm}
        type="CampaignVariantForm"
        variantEdgeIndex={rootIndex}
        onStepClick={() => setActiveForm('CampaignVariantForm', rootIndex)}
      >
        {({ isActive, onFormChange }) => (
          <>
            <UI.Div gridColumn="4/5">
              <LS.BuilderLabel isActive={isActive}>{1}</LS.BuilderLabel>
            </UI.Div>
            <UI.Div gridColumn="5 / 9">
              <UI.Card isActive={isActive} bg="white" onClick={onFormChange}>
                <UI.CardBody>
                  <UI.Helper mb={2}>{variant?.scheduleType}</UI.Helper>
                  {variant?.label}
                </UI.CardBody>
                {!!variantEdge?.childVariant?.hasProblem && <LS.BuilderStepProblem>!</LS.BuilderStepProblem>}
              </UI.Card>
            </UI.Div>
          </>
        )}
      </CampaignStep>
      {!!variant?.children?.length && variant?.children?.map((childVariantEdge, index) => (
        <UI.Div key={index}>
          <RecursiveCampaignStep
            rootIndex={`${rootIndex}.childVariant.children[${index}]`}
            parentVariant={variant}
            variantEdge={childVariantEdge}
            activeForm={activeForm}
            addEmptyVariant={addEmptyVariant}
            setActiveForm={setActiveForm}
          />
        </UI.Div>
      ))}
      {!variant?.children?.length && variant?.scheduleType !== CampaignScheduleEnum.Recurring && (
        <UI.Flex alignItems="center" justifyContent="center">
          <AddCampaignEdge
            onClick={() => addEmptyVariant(rootIndex)}
          />
        </UI.Flex>
      )}
    </>
  )
}
