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
import SliderNode from './nodes/SliderNode/SliderNode';
import SocialShareNode from './nodes/SocialShareNode/SocialShareNode';
import TextboxNode from './nodes/TextboxNode/TextboxNode';

const nodeMap: Record<string, (props: GenericNodeProps) => JSX.Element> = {
  SLIDER: SliderNode,
  MULTI_CHOICE: MultiChoiceNode,
  TEXTBOX: TextboxNode,
  SOCIAL_SHARE: SocialShareNode,
  REGISTRATION: RegisterNode,
  POST_LEAF: PostLeafNode,
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

  const handleEntryStore = (entry: any, edgeKey: any) => {
    // Store the entry
    store.session.add(node.id, entry);

    // Get next edge and navigate there
    const nextEdgeId = node.getNextEdgeIdFromKey(edgeKey);
    history.push(`/${store.customer?.slug}/${store.tree?.id}/${nextEdgeId}`);
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
