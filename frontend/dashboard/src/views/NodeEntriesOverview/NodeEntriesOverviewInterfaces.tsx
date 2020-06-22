export interface NodeEntryValueProps {
  numberValue?: number;
  textValue?: string;
  multiValues?: Array<NodeEntryValueProps>;
  id: string;
}

export interface RelatedNodeProps {
  title: string;
}

export interface NodeEntryProps {
  values: Array<NodeEntryValueProps>;
  relatedNode: RelatedNodeProps;
}
