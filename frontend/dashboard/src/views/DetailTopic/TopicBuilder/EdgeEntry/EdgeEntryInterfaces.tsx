export interface OverrideLeafProps {
  id?: string;
  type?: string;
  title?: string;
}

export interface EdgeChildProps {
  id?: string;
  conditions: Array<EdgeConditonProps>;
  parentNode: QuestionEntryProps;
  childNode: QuestionEntryProps;
}

export interface QuestionEntryProps {
  id?: string;
  title?: string;
  isRoot?: boolean;
  questionType?: string;
  overrideLeaf?: OverrideLeafProps;
  edgeChildren?: Array<EdgeChildProps>;
  options?: Array<QuestionOptionProps>;
}

export interface QuestionOptionProps {
  id?: string;
  value: string;
  publicValue?: string;
}

export interface EdgeConditonProps {
  id?: string;
  conditionType?: string;
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}
