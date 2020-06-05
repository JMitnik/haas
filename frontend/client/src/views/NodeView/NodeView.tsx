import React from 'react';

import { GenericNodeProps } from 'views/NodeView/Nodes/NodeLayout/NodeLayout';
import { Loader } from '@haas/ui';
import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import { useHistory } from 'react-router-dom';
import DialogueTreeLayout from 'layouts/DialogueTreeLayout';
import FinishNode from 'views/NodeView/Nodes/FinishNode/FinishNode';
import MultiChoiceNode from 'views/NodeView/Nodes/MultiChoiceNode/MultiChoiceNode';
import RegisterNode from 'views/NodeView/Nodes/RegisterNode/RegisterNode';
import SliderNode from 'views/NodeView/Nodes/SliderNode/SliderNode';
import SocialShareNode from 'views/NodeView/Nodes/SocialShareNode/SocialShareNode';
import TextboxNode from 'views/NodeView/Nodes/TextboxNode/TextboxNode';
import useDialogueTree from 'providers/DialogueTreeProvider';

const nodeMap: Record<string, (props: GenericNodeProps) => JSX.Element> = {
  SLIDER: SliderNode,
  MULTI_CHOICE: MultiChoiceNode,
  TEXTBOX: TextboxNode,
  SOCIAL_SHARE: SocialShareNode,
  REGISTRATION: RegisterNode,
  FINISH: FinishNode,
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
    <DialogueTreeLayout>
      <NodeType onEntryStore={handleEntryStore} node={node} />
    </DialogueTreeLayout>
  );
};

export default NodeView;
