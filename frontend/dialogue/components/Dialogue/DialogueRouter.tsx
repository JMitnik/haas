import { Routes, Route, useLocation } from 'react-router-dom';
import create, { GetState, SetState } from 'zustand';

import { Dialogue, Workspace, QuestionNode as QuestionNodeType, SessionEventInput } from 'types/helper-types';
import { QuestionNodeRenderer } from 'components/QuestionNode/QuestionNodeRenderer';
import { useEffect } from 'react';
import { useParams, useResolvedPath } from 'react-router';
import { SessionEventType } from 'types/generated-types';

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
  sliderValue?: SliderActionValue;
  choiceValue?: ChoiceActionValue;
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
  setActiveCallToAction: (callToAction: QuestionNodeType) => void;
  getCurrentNode: (dialogue: Dialogue, urlNodeId?: string) => QuestionNodeType;
}

export const useStore = create<DialogueState>((set, get) => ({
  actionEvents: [],
  queuedActionEvents: [],

  setActiveCallToAction: (callToAction: QuestionNodeType) => {
    set({ activeCallToAction: callToAction });
  },

  /**
   * Gets current node: if urlNodeId is provided (nodeId from url), find node with that id, else get root question.
   * @param dialogue
   * @param urlNodeId
   * @returns
   */
  getCurrentNode: (dialogue: Dialogue, urlNodeId: string) => {
    if (urlNodeId && urlNodeId !== 'cta') {
      const question = dialogue.questions.find((node) => node.id === urlNodeId);
      if (question) return question;

      const callToAction = dialogue.leafs.find((node) => node.id === urlNodeId);
      return callToAction;
    }

    if (urlNodeId === 'cta') {
      return get().activeCallToAction;
    }

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

interface DialogueRouterProps {
  dialogue: Dialogue;
  workspace: Workspace;
  onEventUpload: (events: SessionEventInput[]) => void;
}


export const DialogueRouter = ({ dialogue, workspace, onEventUpload }: DialogueRouterProps) => {
  console.log(onEventUpload);
  return (
    <Routes>
      <Route path="/:workspace/:dialogue" element={<QuestionNodeRenderer onEventUpload={onEventUpload} dialogue={dialogue} />}>
        <Route path="n/:nodeId" element={<QuestionNodeRenderer onEventUpload={onEventUpload} dialogue={dialogue} />} />
      </Route>
    </Routes>
  )
}
