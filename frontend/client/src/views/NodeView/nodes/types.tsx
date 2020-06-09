import { TreeNodeProps } from 'models/Tree/TreeNodeModel';

export interface GenericNodeProps {
  node: TreeNodeProps;
  onEntryStore: (entry: any, key: any) => void;
}
