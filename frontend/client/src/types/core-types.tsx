import {
  CustomerSettings,
  QuestionOption as GeneratedQuestionOption,
  GetCustomer,
  GetDialogue,
  LinkType,
  NodeEntryDataInput,
  QuestionFragment,
  QuestionFragmentFragment,
} from './generated-types';

export { QuestionNodeTypeEnum } from './generated-types';

export enum DialogueStateType {
  INITIALIZING = 'INITIALIZING',
  ROOT = 'ROOT',
  INVESTIGATING = 'INVESTIGATING',
  CALL_TO_ACTION = 'CALL_TO_ACTION',
  POSTLEAF = 'POSTLEAF',
}

export enum SessionActionType {
  ChoiceAction = 'CHOICE_ACTION',
  FormAction = 'FORM_ACTION',
  Navigation = 'NAVIGATION',
  SliderAction = 'SLIDER_ACTION',
}

export interface SessionReward {
  /** The optional child-edge that is derived based on the state+action of the current event */
  toEdge?: string;
  /** The resulting node based on `toEdge`.  */
  toNode?: string;

  /** Which call to action was set on this session-reward. */
  overrideCallToActionId?: string;
}

export interface SessionAction extends NodeEntryDataInput {
  type: SessionActionType;
}

export interface SessionState {
  stateType: DialogueStateType;
  nodeId?: string;
  activeCallToActionId?: string;
}

export interface SessionEvent {
  startTimestamp: Date;
  endTimestamp?: Date;
  state?: SessionState;
  action?: SessionAction;
  reward?: SessionReward;
}

export type WorkspaceSettings = CustomerSettings;

export type LinkItemType = LinkType;

export type Dialogue = GetDialogue.Dialogue;

export type Workspace = GetCustomer.Customer;

export interface QuestionNode extends QuestionFragmentFragment {
  postLeafBody?: string;
}

export type Edge = GetDialogue.Edges;

export type Choice = GeneratedQuestionOption;

export type Link = QuestionFragment.Links;

export type Marker = QuestionFragment.Markers;
