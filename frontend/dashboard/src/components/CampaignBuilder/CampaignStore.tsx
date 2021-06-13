import create, { SetState } from 'zustand';
import produce from 'immer';
import { devtools } from 'zustand/middleware'
import { get as LGet, set as LSet } from 'lodash';
// @ts-ignore
const immer = config => (set, get) => config(fn => set(produce(fn)), get);

import { CampaignScheduleEnum, CampaignVariantEdgeConditionEnumType, CampaignVariantEnum, EditCampaignInputType } from 'types/generated-types';

import { CampaignFormType } from './CampaignFormSchema';
import { ActiveFormProps, ActiveFormType, VariantEdgeType, VariantType } from './CampaignBuilderTypes';

export interface CampaignState extends EditCampaignInputType {
  variantEdges: VariantEdgeType[];
  activeForm?: ActiveFormProps | undefined;
  editCampaign: any;
  setEntireVariantTree: any;
  addEmptyVariant: (rootIndex?: string) => void;
  setActiveForm: (activeFormType: ActiveFormType, activeVariantEdgeIndex?: number) => void;
  initializeCampaign: () => void;
  editCampaignVariant: (input: any, index: number) => void;
}

export interface CampaignType {
  label?: string;
  variantEdges?: VariantEdgeType[];
}

export const useCampaignStore = create<CampaignState>(devtools(immer((set: SetState<CampaignState>) => ({
  id: '',
  label: '',
  variantEdges: [],
  workspaceId: '',
  dialogueId: '',
  activeForm: undefined,

  initializeCampaign: () => set(state => {
    state.label = 'My first campaign';
    state.activeForm = {
      type: 'CampaignForm'
    };
  }),
  editCampaign: (campaignFormInputs: CampaignFormType) => set(state => {
    // @ts-ignore
    state.label = campaignFormInputs?.label;
  }),
  editCampaignVariant: (input: any, index: number, edgeIndex?: string) => set(state => {
    if (edgeIndex) {
      let variantEdge = LGet(state.variantEdges, edgeIndex) as any;

      LSet(state, `variantEdges.${edgeIndex}`, {
        ...variantEdge,
        condition: input.condition || undefined,
        scheduleType: input.scheduleType,
        hasProblem: input.hasProblem,
        childVariant: {
          ...input.childVariant,
          label: input.label,
          type: input.type,
          scheduleType: input.scheduleType,
        }
      })
    } else {
      let variantEdge = LGet(state.variantEdges, index) as any;

      LSet(state, `variantEdges.${index}`, {
        ...variantEdge,
        condition: input.condition || undefined,
        scheduleType: input.scheduleType,
        hasProblem: input.hasProblem,
        childVariant: {
          ...variantEdge?.childVariant,
          label: input.label,
          // followUpAmount: input.followUpAmount,
          // followUpMetric: input.followUpMetric,
          type: input.type,
        }
      });
    }
  }),
  setActiveForm: (activeFormType: ActiveFormType, activeVariantEdgeIndex?: string) => set(state => {
    state.activeForm = {
      activeVariantEdgeIndex,
      type: activeFormType
    };
  }),

  setEntireVariantTree: (variantEdges: any) => set(state => {
    console.log(variantEdges);
    LSet(state, 'variantEdges', variantEdges)
  }),
  addEmptyVariant: (rootIndex?: string, parentVariantId?: string) => {
    set(state => {
      if (!rootIndex) {
        LSet(state, `variantEdges.0`, {
          parentVariantId: null,
          condition: null,
          scheduleType: CampaignScheduleEnum.General,
          hasProblem: false,
          childVariant: {
            dialogueId: '',
            id: '',
            body: '',
            type: CampaignVariantEnum.Email,
            workspaceId: '',
            label: '',
            children: []
          }
        });
      } else {

        LSet(state, `variantEdges.${rootIndex}.childVariant.children.0`, {
          parentVariantId,
          condition: CampaignVariantEdgeConditionEnumType.OnNotFinished,
          scheduleType: CampaignScheduleEnum.FollowUp,
          hasProblem: false,
          childVariant: {
            dialogueId: '',
            id: '',
            body: '',
            type: CampaignVariantEnum.Email,
            workspaceId: '',
            children: [],
          }
        });
      }
    })
  },
}))));
