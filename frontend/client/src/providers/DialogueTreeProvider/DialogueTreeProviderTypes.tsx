import { Dialogue, HAASEntry, HAASNode } from 'types/generic';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';

export interface URLParams {
  companySlug: string;
  projectId: string;
  edgeId: string;
}

export interface TreeDispatchProps {
  goToChild: (
    currentNode: HAASNode,
    key: string | number | null,
    newNodeFormEntry: any,
  ) => void;
  findNodeFromEdge: (
    edgeId?: string
  ) => HAASNode | null,
  getActiveLeaf: (
    leafId: string
  ) => HAASNode
  saveEntry: (
    currentNode: HAASNode,
    key: string | number | null,
    nodeEntry: SessionEntryDataProps,
  ) => void;
}

interface TreeActionGotoChildProps {
  currentNode: HAASNode;
  nodeEntry: SessionEntryDataProps;
}

interface TreeActionStartProps {
  rootNode: HAASNode;
}

export type TreeAction =
| {
  type: 'startTree',
  payload: TreeActionStartProps
}
| {
  type: 'goToChild';
  payload: TreeActionGotoChildProps;
}
| {
  type: 'popTreeState';
  payload: TreeActionGotoChildProps;
}
| {
  type: 'finish';
}
| {
  type: 'setDialogueAndCustomer';
  dialogue: Dialogue;
  customer: any;
}
| {
  type: 'unsetDialogueAndCustomer'
}
| {
  type: 'resetTree'
};

export interface TreeStateProps {
  historyStack: HAASEntry[];
  currentDepth: number;
  activeLeaf: HAASNode;
  isAtLeaf: boolean;
  isFinished: boolean;
}
