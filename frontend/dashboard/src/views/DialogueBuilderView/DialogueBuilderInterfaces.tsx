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
  children?: Array<EdgeChildProps>;
  options?: Array<QuestionOptionProps>;
  sliderNode?: any;
}

export interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
}

export interface ShallowQuestionEntryProps {
  id?: string;
  title?: string;
}

export interface EdgeChildProps {
  id?: string;
  conditions: Array<EdgeConditonProps>;
  parentNode: ShallowQuestionEntryProps;
  childNode: ShallowQuestionEntryProps;
}

export interface EdgeConditonProps {
  id?: number;
  conditionType?: string;
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

export interface LeafProps {
  id: string;
  type: string;
  title: string;
}
