import React from 'react';

import { GenericNodeProps } from 'components/Nodes/NodeLayout/NodeLayout';
import { Loader } from '@haas/ui';
import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import { useHistory } from 'react-router-dom';
import DialogueTreeLayout from 'layouts/DialogueTreeLayout';
import FinishNode from 'components/Nodes/FinishNode/FinishNode';
import MultiChoiceNode from 'components/Nodes/MultiChoiceNode/MultiChoiceNode';
import RegisterNode from 'components/Nodes/RegisterNode/RegisterNode';
import SliderNode from 'components/Nodes/SliderNode/SliderNode';
import SocialShareNode from 'components/Nodes/SocialShareNode/SocialShareNode';
import TextboxNode from 'components/Nodes/TextboxNode/TextboxNode';
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
