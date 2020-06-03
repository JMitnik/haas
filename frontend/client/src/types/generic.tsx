import { TreeEdgeProps } from 'models/Tree/TreeEdgeModel';
import { TreeNodeProps } from 'models/Tree/TreeNodeModel';

export interface HAASNodeConditions {
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

export type HAASQuestionType =
| 'SLIDER'
| 'MULTI_CHOICE'
| 'TEXTBOX'
| 'SOCIAL-SHARE'
| 'REGISTRATION'
| 'FINISH';

export interface MultiChoiceOption {
  value: string;
  publicValue?: string;
}

export interface Edge {
  id: string;
  parentNode: HAASNode;
  childNode: HAASNode;
  conditions: [HAASNodeConditions];
}

export interface HAASEdge {
  id: string;
  parentNode: HAASNode;
  childNode: HAASNode;
  conditions: HAASNodeConditions[];
}

export interface HAASNode {
  id: string;
  title: string;
  // type: HAASQuestionType;
  type: string;
  isRoot: boolean;
  children: Array<Edge>;
  conditions?: [HAASNodeConditions];
  overrideLeaf?: HAASNode;
  options?: [MultiChoiceOption];
}

export interface HAASEntry {
  node: HAASNode;
  edge?: HAASEdge | null;
  data: HAASFormEntry;
  depth: number;
}

export interface HAASFormEntry {
  textValue?: string | null;
  numberValue?: number | null;
  multiValues?: HAASFormEntry[];
}

export interface Dialogue {
  id: string;
  questions: TreeNodeProps[];
  edges: TreeEdgeProps[];
  leafs: TreeNodeProps[];
  rootQuestion: TreeNodeProps;
}

interface DialogueContextProps {
  customer: any;
  dialogue?: Dialogue | null;
}

interface ProjectParamProps {
  customerId: string;
  questionnaireId: string;
}

export interface CustomerProps {
  settings: CustomerSettingsProps;
}

export interface Customer {
  name: string;
  settings: CustomerSettingsProps;
  dialogues?: Dialogue[];
}

export interface CustomerSettingsProps {
  logoUrl: string;
}
