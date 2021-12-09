import { Routes, Route, useLocation } from 'react-router-dom';
import create, { GetState, SetState } from 'zustand';

import { Dialogue, Workspace, QuestionNode as QuestionNodeType } from 'types/helper-types';
import { QuestionNodeRenderer } from 'components/QuestionNode/QuestionNodeRenderer';
import { useEffect } from 'react';
import { useParams, useResolvedPath } from 'react-router';

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

export enum ActionType {
  CHOICE_ACTION = 'CHOICE_ACTION',
  SLIDER_ACTION = 'SLIDER_ACTION',
  NAVIGATION = 'NAVIGATION',
}

interface ActionValue {
  actionType: ActionType;
  sliderValue?: SliderActionValue;
  choiceValue?: ChoiceActionValue;
}

export interface ActionEvent {
  to: string;
  value: ActionValue;
  timestamp: Date;
}

interface DialogueState {
  actionEvents: ActionEvent[];
  activeCallToAction?: QuestionNodeType;
  logAction: (actionEvent: ActionEvent) => void;
  setActiveCallToAction: (callToAction: QuestionNodeType) => void;
  getCurrentNode: (dialogue: Dialogue, urlNodeId?: string) => QuestionNodeType;
}

export const useStore = create<DialogueState>((set, get) => ({
  actionEvents: [],

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
  logAction: (actionEvent: ActionEvent) => {
    set({
      actionEvents: [...get().actionEvents, actionEvent],
    });
  }
}));

interface DialogueRouterProps {
  dialogue: Dialogue;
  workspace: Workspace;
}


export const DialogueRouter = ({ dialogue, workspace }: DialogueRouterProps) => {
  return (
    <Routes>
      <Route path="/:workspace/:dialogue" element={<QuestionNodeRenderer dialogue={dialogue} />}>
        <Route path="n/:nodeId" element={<QuestionNodeRenderer dialogue={dialogue} />} />
      </Route>
    </Routes>
  )
}
