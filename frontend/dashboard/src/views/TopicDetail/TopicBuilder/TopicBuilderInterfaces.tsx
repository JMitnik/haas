export interface OverrideLeafProps {
  id?: string;
  type?: string;
  title?: string;
}
export interface QuestionEntryProps {
  id?: string;
  title?: string;
  isRoot?: boolean;
  isLeaf?: boolean;
  type?: string;
  overrideLeaf?: OverrideLeafProps;
  children?: Array<EdgeChildProps>;
  options?: Array<QuestionOptionProps>;
}

export interface QuestionOptionProps {
  id?: string;
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
  id?: string;
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
