import { NodeType, LanguageEnum, NodeEntry, QuestionOption, Session, ChoiceNodeEntry } from '@prisma/client';

import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';
import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';

export type Topic = NexusGenFieldTypes['TopicType'];
export type DialogueStatisticsSummaryFilterInput = NexusGenInputs['DialogueStatisticsSummaryFilterInput'];
export type DialogueConnectionFilterInput = NexusGenInputs['DialogueConnectionFilterInput'];

export interface ChildNodeEntry {
  id: number;
  value: string | number | null;
  nodeEntryId: string;
};

export interface TopicSession extends Session {
  nodeEntries: {
    id: string;
    choiceNodeEntry: ChoiceNodeEntry | null;
  }[];
}

export interface TopicNodeEntry extends ChildNodeEntry {
  nodeEntry: NodeEntry & {
    relatedNode: {
      // options: QuestionOption[];
      children: {
        childNode: {
          options: QuestionOption[];
        } | null;
        isRelatedNodeOfNodeEntries: {
          id: string;
          session: {
            mainScore: number;
          } | null;
          choiceNodeEntry: {
            value: string | null;
          } | null;
        }[];
      }[];
    } | null;
  };
}

export interface CopyDialogueInputType {
  customerSlug: string;
  dialogueSlug: string;
  templateId: string;
  title: string;
  publicTitle: string;
  description: string;
  dialogueTags: { entries?: string[] | null | undefined } | null | undefined;
  language: LanguageEnum;
};
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
  [details: string]: string;
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
  };
}
