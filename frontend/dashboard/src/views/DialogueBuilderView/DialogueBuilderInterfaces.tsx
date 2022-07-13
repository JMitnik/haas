import { QuestionNodeTypeEnum } from 'types/generated-types';

export interface CTANode {
  id: string;
  title: string;
  type?: QuestionNodeTypeEnum;
}

export interface MappedCTANode {
  label?: string;
  value?: string;
  type?: QuestionNodeTypeEnum;
}

export interface OverrideLeafProps {
  id?: string;
  type?: string;
  title?: string;
}
export interface QuestionEntryProps {
  id: string;
  icon: (props: any) => JSX.Element;
  updatedAt?: string;
  creationDate?: string;
  title: string;
  extraContent?: string | null;
  isRoot: boolean;
  isLeaf: boolean;
  type: string;
  overrideLeaf?: OverrideLeafProps;
  children?: EdgeChildProps[];
  options?: QuestionOptionProps[];
  sliderNode?: any;
}

export interface MappedQuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
  overrideLeaf?: MappedCTANode;
  newOverrideLeaf?: MappedCTANode;
  position?: number;
}

export interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
  overrideLeaf?: CTANode;
  position?: number;
  isTopic: boolean;
}

export interface ShallowQuestionEntryProps {
  id?: string;
  title?: string;
}

export interface EdgeChildProps {
  id?: string;
  conditions: EdgeConditionProps[];
  parentNode: ShallowQuestionEntryProps;
  childNode: ShallowQuestionEntryProps;
}

export interface EdgeConditionProps {
  id?: number;
  conditionType?: string;
  renderMin?: number | null;
  renderMax?: number | null;
  matchValue?: string | null;
}
