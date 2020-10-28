import { Redirect, useHistory } from 'react-router-dom';
import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import React from 'react';

import { Loader } from '@haas/ui';
import DialogueTreeLayout from 'layouts/DialogueTreeLayout';
import NodeLayout from 'layouts/NodeLayout';
import useDialogueTree from 'providers/DialogueTreeProvider';
import useUploadQueue from 'providers/UploadQueueProvider';

import { GenericNodeProps } from './nodes/types';
import MultiChoiceNode from './nodes/MultiChoiceNode/MultiChoiceNode';
import PostLeafNode from './nodes/PostLeafNode/PostLeafNode';
import RegisterNode from './nodes/RegisterNode/RegisterNode';
import ShareNode from './nodes/ShareNode/ShareNode';
import SliderNode from './nodes/SliderNode/SliderNode';
import SocialShareNode from './nodes/SocialShareNode/SocialShareNode';
import TextboxNode from './nodes/TextboxNode/TextboxNode';

const nodeMap: Record<string, (props: GenericNodeProps) => JSX.Element> = {
  SLIDER: SliderNode,
  CHOICE: MultiChoiceNode,
  TEXTBOX: TextboxNode,
  LINK: SocialShareNode,
  REGISTRATION: RegisterNode,
  POST_LEAF: PostLeafNode,
  SHARE: ShareNode,
};

const NodeType = ({ node, onEntryStore }: GenericNodeProps) => {
  const Component = nodeMap[node?.type || 'Slider'];

  if (!Component) {
    return <Loader />;
  }

  return <Component onEntryStore={onEntryStore} node={node} />;
};

interface NodeViewProps {
  node: TreeNodeProps;
}

const NodeView = ({ node }: NodeViewProps) => {
  const store = useDialogueTree();
  const history = useHistory();
  const { queueEntry, willQueueEntry } = useUploadQueue();

  /**
   * Stores entry and proceeds to next node
   * @param entry
   * @param edgeKey
   */
  const handleEntryStore = (entry: any, edgeKey: any) => {
    // Store the entry
    store.session.add(node.id, entry);

    // Use current condition to decide next Edge (or if we are at leaf, we will do something else)
    const { edgeId, goesToLeaf, goesToPostLeaf } = node.getNextEdgeIdFromKey(edgeKey);

    // If our entry is valid, and we will queue the entry (meaning, a session has been uploaded)
    if (entry && willQueueEntry) {
      queueEntry({
        nodeId: node.id,
        data: entry,
      });
    }

    // Navigation: go to post-leaf
    if (goesToPostLeaf) {
      return history.push(`/${store.customer?.slug}/${store.tree?.slug}/${edgeId}`);
    }

    // Navigation: go to active-leaf
    if (goesToLeaf) {
      const activeLeaf = store.tree?.activeLeaf;
      return history.push(`/${store.customer?.slug}/${store.tree?.slug}/n/${activeLeaf?.id}`);
    }

    // Navigation: go to next node
    return history.push(`/${store.customer?.slug}/${store.tree?.slug}/${edgeId}`);
  };

  /**
   * Stores entry in queue only (does not proceed to next node)
   * @param entry
   * @param edgeKey
   */
  const handleQueueEntryOnly = (entry: any) => {
    if (entry && willQueueEntry) {
      queueEntry({
        nodeId: node.id,
        data: entry,
      });
    }
  };

  if (node.isRoot) {
    store.start();
  }

  // Do the main check in
  if ((!node.isLeaf && !node.isRoot && !store.hasStarted) || (node.isPostLeaf && !store.hasStarted)) {
    return <Redirect to={`/${store.customer?.slug}/${store.tree?.slug}`} />;
  }

  if (node.isPostLeaf) {
    store.stop();
  }

  return (
    <DialogueTreeLayout node={node}>
      <NodeLayout>
        <NodeType onQueueOnlyStore={handleQueueEntryOnly} onEntryStore={handleEntryStore} node={node} />
      </NodeLayout>
    </DialogueTreeLayout>
  );
};

export default NodeView;
