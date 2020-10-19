import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import { useHistory } from 'react-router-dom';
import React from 'react';

import { Loader } from '@haas/ui';
import DialogueTreeLayout from 'layouts/DialogueTreeLayout';
import NodeLayout from 'layouts/NodeLayout';
import useDialogueTree from 'providers/DialogueTreeProvider';

import { GenericNodeProps } from './nodes/types';
import MultiChoiceNode from './nodes/MultiChoiceNode/MultiChoiceNode';
import PostLeafNode from './nodes/PostLeafNode/PostLeafNode';
import RegisterNode from './nodes/RegisterNode/RegisterNode';
import ShareNode from './nodes/ShareNode/ShareNode';
import SliderNode from './nodes/SliderNode/SliderNode';
import SocialShareNode from './nodes/SocialShareNode/SocialShareNode';
import TextboxNode from './nodes/TextboxNode/TextboxNode';
import useJourneyFinish from 'hooks/use-dialogue-finish';

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
  const { appendToInteraction, createInteraction, isFinished } = useJourneyFinish();

  const handleEntryStore = (entry: any, edgeKey: any) => {
    // Store the entry
    store.session.add(node.id, entry);

    if (isFinished) {
      appendToInteraction(entry);
    }

    // Get next edge and navigate there
    const { edgeId, isAtLeaf } = node.getNextEdgeIdFromKey(edgeKey);

    if (isAtLeaf) {
      const activeLeaf = store.tree?.activeLeaf;
      return history.push(`/${store.customer?.slug}/${store.tree?.slug}/n/${activeLeaf?.id}`);
    }

    return history.push(`/${store.customer?.slug}/${store.tree?.slug}/${edgeId}`);
  };

  return (
    <DialogueTreeLayout node={node}>
      <NodeLayout>
        <NodeType onEntryStore={handleEntryStore} node={node} />
      </NodeLayout>
    </DialogueTreeLayout>
  );
};

export default NodeView;
