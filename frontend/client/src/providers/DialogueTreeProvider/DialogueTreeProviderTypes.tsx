import { Dialogue, HAASEdge, HAASEntry, HAASFormEntry, HAASNode } from 'types/generic';

export interface URLParams {
  companySlug: string;
  projectId: string;
  edgeId: string;
}

export interface TreeDispatchProps {
  goToChild: (
    currentNode: HAASNode,
    key: string | number | null,
    newNodeFormEntry: HAASFormEntry
  ) => void;
  getActiveNode: (
    edgeId?: string
  ) => HAASNode | null,
  getActiveLeaf: (
    leafId: string
  ) => HAASNode
}

interface TreeActionGotoChildProps {
  currentNode: HAASNode;
  nodeEntry: HAASFormEntry;
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
