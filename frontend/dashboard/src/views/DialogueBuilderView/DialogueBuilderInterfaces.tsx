import { QuestionNodeTypeEnum } from "types";

export interface CTANode {
  id: string;
  title: string;
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
  isRoot: boolean;
  isLeaf: boolean;
  type: string;
  overrideLeaf?: OverrideLeafProps;
  children?: EdgeChildProps[];
  options?: QuestionOptionProps[];
  sliderNode?: any;
}

export interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
  overrideLeaf?: CTANode;
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
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}