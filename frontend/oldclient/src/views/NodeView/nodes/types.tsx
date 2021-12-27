import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';
import { TreeNodeProps } from 'models/Tree/TreeNodeModel';

export interface GenericNodeProps {
  node: TreeNodeProps;
  onEntryStore: (entry: SessionEntryDataProps, key: any, overrideLeaf?: TreeNodeProps) => void;
  onQueueOnlyStore?: (entry: SessionEntryDataProps) => void;
}
