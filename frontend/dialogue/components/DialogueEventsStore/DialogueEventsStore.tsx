import create from 'zustand';

import { Dialogue, QuestionNode as QuestionNodeType, SessionEventInput } from '../../types/helper-types';
import {
  SessionEventType,
  SessionEventSliderValueInput,
  SessionEventChoiceValueInput,
  SessionEventFormValueInput,
} from '../../types/generated-types';

export interface SliderActionValue {
  value: number;
  nodeId: string;
  timeSpent: number;
}

export interface ChoiceActionValue {
  optionId: string;
  value: string;
  nodeId: string;
  timeSpent: number;
}

export type NodeActionValue = SliderActionValue;

interface ActionValue {
  actionType: SessionEventType;
  sliderValue?: SessionEventSliderValueInput;
  choiceValue?: SessionEventChoiceValueInput;
  formValue?: SessionEventFormValueInput;
}

export interface ActionEvent {
  to: string;
  value: ActionValue;
  timestamp: Date;
}

interface DialogueState {
  actionEvents: SessionEventInput[];
  queuedActionEvents: SessionEventInput[];
  activeCallToAction?: QuestionNodeType;
  logAction: (actionEvent: SessionEventInput) => void;
  popActionQueue: () => SessionEventInput[];
  setActiveCallToAction: (callToAction?: QuestionNodeType) => QuestionNodeType;
  getCurrentNode: (dialogue: Dialogue, urlNodeId?: string) => QuestionNodeType;
}

export const useEventsStore = create<DialogueState>((set, get) => ({
  actionEvents: [],
  queuedActionEvents: [],

  setActiveCallToAction: (callToAction?: QuestionNodeType) => {
    if (callToAction) {
      set({ activeCallToAction: callToAction });
    }

    return get().activeCallToAction;
  },

  /**
   * Gets current node: if urlNodeId is provided (nodeId from url), find node with that id, else get root question.
   * @param dialogue
   * @param urlNodeId
   * @returns
   */
  getCurrentNode: (dialogue: Dialogue, urlNodeId: string) => {
    if (urlNodeId && urlNodeId !== '-1') {
      const question = dialogue.questions.find((node) => node.id === urlNodeId);
      if (question) return question;

      const callToAction = dialogue.leafs.find((node) => node.id === urlNodeId);
      return callToAction;
    }

    if (urlNodeId === '-1') {
      return dialogue.root;
    }

    // if (urlNodeId === 'cta') {
    //   const activeCallToAction = get().activeCallToAction;

    //   // TODO: Make postleaf
    //   // if (!activeCallToAction) {
    //   //   return
    //   // };
    //   return get().activeCallToAction;
    // }

    return dialogue.rootQuestion;
  },
  logAction: (actionEvent: SessionEventInput) => {
    set({
      actionEvents: [...get().actionEvents, actionEvent],
      queuedActionEvents: [...get().queuedActionEvents, actionEvent],
    });
  },
  popActionQueue: () => {
    const queuedEvents = get().queuedActionEvents;
    set({ queuedActionEvents: [] });
    return queuedEvents;
  },
}));
