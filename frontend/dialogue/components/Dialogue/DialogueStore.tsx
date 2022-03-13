import create from 'zustand';
import { loggerInstance } from '@haas/tools';

import {
  Dialogue,
  Workspace,
  QuestionNode as QuestionNodeType,
  SessionEvent,
  SessionState,
} from '../../types/core-types';
import { QuestionNode as GeneratedQuestionNode } from '../../types/generated-types';
import { POSTLEAFNODE_ID } from '../PostLeafNode/PostLeafNode';

interface DialogueState {
  idToNode: Record<string, GeneratedQuestionNode> | undefined;
  dialogue: Dialogue | undefined;
  workspace: Workspace | undefined;

  sessionId: string | null;
  isInitializing: boolean;

  initialize: (dialogue: Dialogue, workspace: Workspace, sessionId: string) => void;

  /** Track past-present-future of state-action-rewards. **/
  activeEvent: SessionEvent;
  pastEvents: SessionEvent[];
  futureEvents: SessionEvent[];

  applyEvent: (event: SessionEvent) => SessionEvent;
  detectUndoRedo: (nodeId: string) => void;
  undoEvent: () => void;
  redoEvent: () => void;

  /** State-action pairs that will get uploaded. **/
  uploadEvents: SessionEvent[];

  /** Empty state-action-rewards. **/
  popEventQueue: () => SessionEvent[];

  /** Set state-action-rewards. **/
  // setActiveCallToAction: (callToAction?: QuestionNodeType) => QuestionNodeType;

  /** Get current node. **/
  getCurrentNode: () => (QuestionNodeType | undefined);
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
  sessionId: null,
  idToNode: undefined,
  dialogue: undefined,
  workspace: undefined,
  isInitializing: true,

  activeEvent: undefined,
  pastEvents: [],
  futureEvents: [],

  uploadEvents: [],

  initialize: (dialogue: Dialogue, workspace: Workspace, sessionId: string,) => {
    const allNodes = [...dialogue?.questions, ...dialogue.leafs];

    const idToNode = allNodes.reduce((lookup, node) => {
      lookup[node.id] = node;

      return lookup;
    }, {} as Record<string, GeneratedQuestionNode>);

    const initialState: SessionEvent = {
      sessionId,
      state: {
        nodeId: dialogue.rootQuestion.id,
        activeCallToActionId: undefined,
      },
      timestamp: Date.now(),
      action: undefined,
      reward: undefined,
    };

    set({
      idToNode,
      dialogue,
      workspace,
      activeEvent: initialState,
      isInitializing: false,
    });
  },

  applyEvent: (event: SessionEvent) => {
    let nextEvent: SessionEvent;

    // TODO: I need to update the "current event" with the potential new reward and action,
    // AND THEN set a new event.
    set(currentState => {
      // Update the current event with the new action and reward
      const updatedEvent: SessionEvent = {
        state: currentState.activeEvent.state,
        action: event.action,
        reward: event.reward,
        sessionId: currentState.activeEvent.sessionId,
        timestamp: Date.now(),
      };

      // New active call-to-action is either the call-to-action from the latest event, or the previous one.
      let nextActiveCallToActionId = event.reward?.overrideCallToActionId || updatedEvent.state.activeCallToActionId;

      // If we are on the same node as the call-to-action node, we need to unset the call-to-action
      if (updatedEvent.state.nodeId === nextActiveCallToActionId) {
        nextActiveCallToActionId = undefined;
      }

      // Update the state for the next event.
      const nextState: SessionState = {
        activeCallToActionId: nextActiveCallToActionId,
        nodeId: event.reward?.toNode || nextActiveCallToActionId || POSTLEAFNODE_ID,
      };

      nextEvent = {
        sessionId: currentState.sessionId,
        timestamp: Date.now(),
        state: nextState,
      };

      return {
        activeEvent: nextEvent,
        uploadEvents: [...currentState.uploadEvents, updatedEvent],
        pastEvents: [...currentState.pastEvents, updatedEvent],
        futureEvents: [],
      };
    });

    return nextEvent;
  },
  undoEvent: () => {
    set(currentState => {
      const currentStateActionReward = currentState.activeEvent;
      const previousStateActionReward = currentState.pastEvents.pop();

      return {
        pastEvents: currentState.pastEvents,
        activeEvent: previousStateActionReward,
        futureEvents: [...currentState.futureEvents, currentStateActionReward],
      }
    });
  },
  detectUndoRedo: (nextNodeId: string) => {
    const pastEvents = get().pastEvents;
    const futureEvents = get().futureEvents;

    const futureState = futureEvents.length > 0 ? futureEvents[futureEvents.length - 1]?.state?.nodeId : null;
    const pastState = pastEvents.length > 0 ? pastEvents[pastEvents.length - 1]?.state?.nodeId : null;

    if (nextNodeId === futureState) {
      get().redoEvent()
    } else if (nextNodeId === pastState) {
      get().undoEvent()
    } else {
      loggerInstance.log('Not forward or backward');
    }
  },
  redoEvent: () => {
    set(currentState => {
      const currentStateActionReward = currentState.activeEvent;
      const nextStateActionReward = currentState.futureEvents.pop();

      return {
        pastEvents: [...currentState.pastEvents, currentStateActionReward],
        activeEvent: nextStateActionReward,
        futureEvents: [...currentState.futureEvents],
      }
    });
  },
  getCurrentNode: () => {
    const idToNode = get().idToNode;
    const activeEvent = get().activeEvent;

    if (idToNode && activeEvent) {
      return idToNode[activeEvent.state.nodeId];
    }

    return undefined;
  },
  popEventQueue: () => {
    const queuedStateActions = get().uploadEvents;
    set({ uploadEvents: [] });
    return queuedStateActions;
  },
}));
