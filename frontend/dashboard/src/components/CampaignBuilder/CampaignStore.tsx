import create, { SetState } from 'zustand';
import produce from 'immer';
import { devtools } from 'zustand/middleware'
import { get as LGet, set as LSet } from 'lodash';
// @ts-ignore
const immer = config => (set, get) => config(fn => set(produce(fn)), get);

import { CampaignScheduleEnum, CampaignVariantEdgeConditionEnumType, CampaignVariantEnum, EditCampaignInputType } from 'types/generated-types';

import { CampaignFormType } from './CampaignFormSchema';
import { ActiveFormProps, ActiveFormType, VariantType } from './CampaignBuilderTypes';

interface CampaignState extends EditCampaignInputType {
  variants: VariantType[];
  addEmptyVariant: (rootIndex?: string) => void;
  activeForm?: ActiveFormProps | undefined;
  setActiveForm: (activeFormType: ActiveFormType, activeDirectVariantIndex?: number) => void;
  initializeCampaign: () => void;
  editCampaignVariant: (input: any, index: number) => void;
  editCampaign: any;
}

export const useCampaignStore = create<CampaignState>(devtools(immer((set: SetState<CampaignState>) => ({
  id: '',
  label: '',
  variants: [],
  workspaceId: '',
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
      let variantEdge = LGet(state.variants, edgeIndex) as any;

      LSet(state, `variants.${edgeIndex}`, {
        ...variantEdge,
        condition: input.condition,
        childVariant: {
          ...input.childVariant,
          label: input.label,
          type: input.type,
          scheduleType: input.scheduleType,
        }
      })
    } else {
      let variant = LGet(state.variants, input) as any;
      LSet(state, `variants.${index}`, {
        ...variant,
        label: input.label,
        type: input.type,
        scheduleType: input.scheduleType,
      });
    }
  }),
  setActiveForm: (activeFormType: ActiveFormType, activeDirectVariantIndex?: string) => set(state => {
    state.activeForm = {
      activeDirectVariantIndex,
      type: activeFormType
    };
  }),

  addEmptyVariant: (rootIndex?: string, parentVariantId?: string) => {
    set(state => {
      if (!rootIndex) {
        LSet(state, `variants.0`, {
          dialogueId: '',
            id: '',
            scheduleType: CampaignScheduleEnum.General,
            body: '',
            hasProblem: false,
            type: CampaignVariantEnum.Email,
            workspaceId: '',
            label: '',
            children: []
        });
      } else {

        LSet(state, `variants.${rootIndex}.children.0`, {
          parentVariantId,
          condition: CampaignVariantEdgeConditionEnumType.OnNotFinished,
          childVariant: {
            dialogueId: '',
            id: '',
            scheduleType:
              CampaignScheduleEnum.General,
            body: '',
            hasProblem: false,
            type: CampaignVariantEnum.Email,
            workspaceId: '',
            children: [],
          }
        });
      }
    })
  },
}))));
