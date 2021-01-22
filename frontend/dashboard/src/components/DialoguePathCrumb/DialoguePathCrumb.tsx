import React from 'react';
import * as UI from '@haas/ui';
import { Clipboard, Clock, Link as LinkIcon, MessageCircle, Target } from 'react-feather';

import { Edge, QuestionNode, QuestionNodeTypeEnum } from 'types/generated-types';
import Logo from 'components/Logo';

import * as L from './DialoguePathCrumbStyles';

interface NodeType {
  type: QuestionNodeTypeEnum;
}

interface EdgeType {
  parentNodeId?: string | null;
  childNodeId?: string | null;
  parentNode?: NodeType | null;
  childNode?: NodeType | null;
}

interface DialoguePathType {
  edges: EdgeType[];
}

interface DialoguePathCrumbProps {
  dialoguePath: DialoguePathType;
}

export const NodeTypeIcon = ({ node }: { node: NodeType | null }) => {
  if (!node?.type) return <UI.Div />;

  switch (node.type) {
    case 'SLIDER':
      return <Logo />;
    case 'CHOICE':
      return <Target />;
    case 'LINK':
      return <LinkIcon />;
    case 'REGISTRATION':
      return <Clipboard />;
    case 'TEXTBOX':
      return <MessageCircle />;
    case 'FORM':
      return <Clipboard />;
    default:
      return <Logo />;
  }
};

export const DialoguePathCrumb = ({ dialoguePath }: DialoguePathCrumbProps) => {
  return (
    <UI.Flex>
      {dialoguePath.edges.map((edge, index) => (
        <L.DialoguePathCrumbContainer
          isInline
          pr={3}
          zIndex={10 - index}
        >
          <NodeTypeIcon node={edge.parentNode || null} />
        </L.DialoguePathCrumbContainer>
      ))}
    </UI.Flex>
  )
}