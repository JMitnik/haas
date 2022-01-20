import * as UI from '@haas/ui';

import { LinkItemType } from '../../types/helper-types';
import { NodeLayout } from '../QuestionNode/NodeLayout';
import { QuestionNodeTitle } from '../QuestionNode/QuestionNodeStyles';
import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { LinkItem } from './LinkItem';
import UpsellNode from './UpsellNode';

export const LinkNode = ({ node }: QuestionNodeProps) => {
  // TODO: Use the social capabilities of this event to enqueue
  const handleLinkClick = (link: LinkItemType, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    window.open(event.currentTarget.href, event.currentTarget.rel);
  };

  return (
    <NodeLayout node={node}>
      <QuestionNodeTitle>
        {node.title}
      </QuestionNodeTitle>

      {node.links?.length === 1 && (
        <UpsellNode link={node.links[0]} />
      )}

      {(node.links?.length === 0 || node.links?.length > 1) && (
        <UI.Flex data-testid="shareitems" justifyContent="center" alignItems="center">
          {node.links?.map((link, index) => (
            <LinkItem key={index} onClick={handleLinkClick} link={link} />
          ))}
        </UI.Flex>
      )}

    </NodeLayout>
  );
};
