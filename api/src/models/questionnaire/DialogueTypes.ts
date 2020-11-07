import { NodeType } from '@prisma/client';
import { NodeEntryWithTypes } from '../node-entry/NodeEntryService';

export interface LeafNodeProps {
  id: string;
  nodeId?: string;
  type?: string;
  title: string;
}

export interface QuestionConditionProps {
  id?: number;
  conditionType: string;
  renderMin: number;
  renderMax: number;
  matchValue: string;
}

export interface EdgeNodeProps {
  id: string;
  title: string;
}

export interface EdgeChildProps {
  id?: string;
  conditions: [QuestionConditionProps];
  parentNode: EdgeNodeProps;
  childNode: EdgeNodeProps;
}

export interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
}

export interface PathProps {
  answer?: string | null;
  quantity?: number | null;
  basicSentiment?: string | null;
}

export type HistoryDataWithEntry = (HistoryDataProps & NodeEntryWithTypes);

export interface StatisticsProps {
  nrInteractions: number;
  history: HistoryDataProps[];
  topNegativePath: PathProps[];
  topPositivePath: PathProps[];
  mostPopularPath: PathProps | null;
}

export interface HistoryDataProps {
  x?: string | null;
  y?: number | null;
  entryId?: string | null;
}

export interface PathFrequency {
  answer: string;
  quantity: number;
}

export interface IdMapProps {
  [details: string] : string;
}

export interface QuestionProps {
  id: string;
  title: string;
  isRoot: boolean;
  isLeaf: boolean;
  type: NodeType;
  overrideLeaf: LeafNodeProps;
  options: Array<QuestionOptionProps>;
  children: Array<EdgeChildProps>;
}

export interface DialogueInputProps {
  data: {
    customerSlug: string;
    dialogueSlug: string;
    title: string;
    description: string;
    publicTitle: string;
    contentType: 'SCRATCH' | 'TEMPLATE' | 'SEED';
    templateDialogueId?: string;
    tags: any;
  }
}
