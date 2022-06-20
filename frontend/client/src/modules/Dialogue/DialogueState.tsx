import create from 'zustand';

import {
  Dialogue,
  DialogueStateType,
  Metadata,
  QuestionNode,
  SessionEvent,
  Workspace,
} from '../../types/core-types';
import { POSTLEAFNODE_ID, defaultPostLeafNode } from '../PostLeafNode/PostLeafNode';
import { calculateNewCallToAction, calculateNextState, makeNodeMap } from './DialogueState.helpers';

interface DialogueState {
  // Properties
  /** GlobalStateType contains the dialogue type independent of forward/backward. */
  globalStateType: DialogueStateType;
  metadata: Metadata | undefined;
  isFinished: boolean;
  idToNode: Record<string, QuestionNode> | undefined;
  dialogue: Dialogue | undefined;
  workspace: Workspace | undefined;
  terminalNodeId: string | undefined;
  sessionId: string | null;
  isInitializing: boolean;

  // Initialization function
  initialize: (dialogue: Dialogue, workspace: Workspace, metadata: Metadata) => void;

  /** Track past-present-future of state-action-rewards. * */
  activeEvent: SessionEvent | undefined;
  pastEvents: SessionEvent[];
  futureEvents: SessionEvent[];

  /** Interact with our event queues */
  applyEvent: (event: SessionEvent, disableUploadQueue: boolean) => SessionEvent | undefined;
  detectUndoRedo: (nodeId: string) => void;
  undoEvent: () => void;
  redoEvent: () => void;

  /** State-action pairs that will get uploaded. * */
  uploadEvents: SessionEvent[];

  /** Restart the dialogue  */
  restart: () => SessionEvent;
  redoAll: () => SessionEvent;

  /** Empty state-action-rewards. * */
  popEventQueue: () => SessionEvent[];

  /** Get current node. * */
  getCurrentNode: () => (QuestionNode | undefined);

  /** Finalize the dialogue */
  finish: (terminalNodeId?: string) => void;
}

export const useDialogueState = create<DialogueState>((set, get) => ({
  globalStateType: DialogueStateType.INITIALIZING,
  sessionId: null,
  terminalNodeId: undefined,
  idToNode: undefined,

  // Global storage
  dialogue: undefined,
  workspace: undefined,
  metadata: undefined,

  // Track the events.
  activeEvent: undefined,
  pastEvents: [],
  futureEvents: [],

  uploadEvents: [],

  // Transition States
  isFinished: false,
  isInitializing: true,

  /**
   * Initialize the DialogueState.
   * - Sets a lookup-table for nodes.
   * - Initializes the very first state.
   * - Sets the state.
   */
  initialize: (dialogue: Dialogue, workspace: Workspace, metadata: Metadata) => {
    const idToNode = makeNodeMap([...dialogue.questions, ...dialogue.leafs]);

    const initialEvent: SessionEvent = {
      startTimestamp: new Date(Date.now()),
      state: {
        depth: 0,
        stateType: DialogueStateType.ROOT,
        nodeId: dialogue.rootQuestion.id,
        activeCallToActionId: undefined,
      },
      action: undefined,
      reward: undefined,
    };

    set({
      globalStateType: DialogueStateType.ROOT,
      idToNode,
      dialogue,
      workspace,
      activeEvent: initialEvent,
      isInitializing: false,
      metadata,
    });
  },

  /**
   * Applies a new event to the chain of events.
   *
   * - Completes the "current" event, by calculating what action was taken from the current event and observed reward.
   * - Prepare the next event, its call-to-action, and which node to transition to next.
   * - Updates the event queues (uploadEvents, pastEvents, and futureEvents).
   * - Update the globalStateType.
   */
  applyEvent: (event: SessionEvent, disableUploadQueue: boolean = false) => {
    // eslint-disable-next-line no-undef-init
    let nextEvent: SessionEvent | undefined = undefined;

    set((currentState) => {
      if (!currentState.activeEvent) {
        throw new Error('Cannot apply event without active event.');
      }

      const updatedCurrentEvent: SessionEvent = {
        ...currentState.activeEvent,
        action: event.action,
        reward: event.reward,
        endTimestamp: new Date(Date.now()),
      };

      const newCallToActionId = calculateNewCallToAction(event.reward, updatedCurrentEvent.state);
      const { nodeId, stateType } = calculateNextState(POSTLEAFNODE_ID, event.reward, newCallToActionId);

      nextEvent = {
        startTimestamp: new Date(Date.now()),
        state: {
          depth: (updatedCurrentEvent?.state?.depth || 0) + 1,
          activeCallToActionId: newCallToActionId,
          nodeId,
          stateType,
        },
        reward: undefined,
        action: undefined,
      };

      const uploadEvents = disableUploadQueue
        ? currentState.uploadEvents
        : [...currentState.uploadEvents, updatedCurrentEvent];

      return {
        activeEvent: nextEvent,
        uploadEvents,
        pastEvents: [...currentState.pastEvents, updatedCurrentEvent],
        futureEvents: [],
        globalStateType: stateType,
      };
    });

    return nextEvent;
  },

  /**
   * In the case that is hard to ascertain whether user has done or undone an action
   * (think of navigating in the Browser, it is hard to find out if it was forward or backward)
   * we can use this function to use the node-id in the URL to detect if the user went forward or backward.
   */
  detectUndoRedo: (nextNodeId: string) => {
    const { pastEvents } = get();
    const { futureEvents } = get();

    const futureState = futureEvents.length > 0 ? futureEvents[futureEvents.length - 1]?.state?.nodeId : null;
    const pastState = pastEvents.length > 0 ? pastEvents[pastEvents.length - 1]?.state?.nodeId : null;

    if (nextNodeId === futureState) {
      get().redoEvent();
    } else if (nextNodeId === pastState) {
      get().undoEvent();
    } else { // This should technically be impossible
      console.error('Not forward or backward');

      // TODO: Make loggerInstance work again
      // loggerInstance.log('Not forward or backward');
    }
  },

  /**
   * When undoing, look at the last events in the `pastEvents` stack and pop it off.
   * Also, ensure our futureEvents receives our active-event prior to undoing (in case of redoing).
   */
  undoEvent: () => {
    set((currentState) => {
      const currentEvent = currentState.activeEvent;
      const futureEvents = currentEvent ? [...currentState.futureEvents, currentEvent] : [...currentState.futureEvents];

      const previousEvent = currentState.pastEvents.pop();

      // Get all except the last event
      const uploadEvents = currentState.uploadEvents.slice(0, currentState.uploadEvents.length - 1);

      return {
        pastEvents: currentState.pastEvents,
        uploadEvents,
        activeEvent: previousEvent,
        futureEvents,
      };
    });
  },

  /**
   * When redoing, look at the last events in the `futureEvents` stack and pop it off.
   * Also, ensure our pastEvents receives our active-event prior to undoing (in case of redoing).
   */
  redoEvent: () => {
    set((currentState) => {
      const currentEvent = currentState.activeEvent;
      const pastEvents = currentEvent ? [...currentState.pastEvents, currentEvent] : [...currentState.pastEvents];
      const uploadEvents = currentEvent ? [...currentState.uploadEvents, currentEvent] : [...currentState.uploadEvents];
      const nextEvent = currentState.futureEvents.pop();

      return {
        pastEvents,
        uploadEvents,
        activeEvent: nextEvent,
        futureEvents: [...currentState.futureEvents],
      };
    });
  },

  /**
   * Gets the currently active Node based on the current node-id.
   */
  getCurrentNode: () => {
    const { idToNode, activeEvent } = get();

    if (activeEvent?.state?.nodeId === POSTLEAFNODE_ID) {
      return defaultPostLeafNode;
    }

    if (idToNode && activeEvent?.state?.nodeId) {
      return idToNode[activeEvent.state.nodeId];
    }

    return defaultPostLeafNode;
  },

  /**
   * Restart the entire flow, and returns the new event.
   */
  restart: () => {
    const dialogue = get().dialogue as Dialogue;

    const initialEvent: SessionEvent = {
      startTimestamp: new Date(Date.now()),
      state: {
        depth: 0,
        stateType: DialogueStateType.ROOT,
        nodeId: dialogue.rootQuestion.id,
        activeCallToActionId: undefined,
      },
      action: undefined,
      reward: undefined,
    };

    set({
      globalStateType: DialogueStateType.ROOT,
      activeEvent: initialEvent,
      pastEvents: [],
      uploadEvents: [],
      futureEvents: [],
      isInitializing: false,
    });

    return initialEvent;
  },

  /**
   * RedoAll
   */
  redoAll: () => {
    set((currentState) => {
      const currentEvent = (
        currentState.futureEvents.length > 0 ? currentState.futureEvents[0] : currentState.activeEvent
      );
      const pastEvents = [...currentState.pastEvents, currentState.activeEvent as SessionEvent];

      return {
        pastEvents,
        activeEvent: currentEvent,
        futureEvents: [],
      };
    });

    return get().activeEvent as SessionEvent;
  },

  /**
   * Get the last items from the `uploadsEvent` queue, and reset the queue.
   */
  popEventQueue: () => {
    const queuedStateActions = get().uploadEvents;
    set({ uploadEvents: [] });
    return queuedStateActions;
  },

  /**
   * Set the `isFinished` flag to true.
   * @param terminalNodeId
   */
  finish: (terminalNodeId: string | undefined = undefined) => {
    set({ isFinished: true, terminalNodeId });
  },
}));
