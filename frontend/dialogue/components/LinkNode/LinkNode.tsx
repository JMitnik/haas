import * as UI from '@haas/ui';
import React from 'react';

import { LinkItemType } from '../../types/core-types';
import { QuestionNodeLayout } from '../QuestionNode/QuestionNodeLayout';
import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { LinkItem } from './LinkItem';
import UpsellNode from './UpsellNode';
import { QuestionNodeTitle } from '../QuestionNode/QuestionNodeTitle';

export const LinkNode = ({ node }: QuestionNodeProps) => {
  // TODO: Use the social capabilities of this event to enqueue
  const handleLinkClick = (link: LinkItemType, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    window.open(event.currentTarget.href, event.currentTarget.rel);
  };

  return (
    <QuestionNodeLayout node={node}>
      <QuestionNodeTitle>
        {node.title}
      </QuestionNodeTitle>

      {node.links?.length === 1 && (
        <UpsellNode link={node.links[0]}/>
      )}

      <UI.Flex justifyContent="center">
        <UI.Span display="inline-block">
          {(node.links?.length === 0 || node.links?.length > 1) && (
            <UI.Flex data-testid="shareitems" justifyContent="center" alignItems="center">
              {node.links?.map((link, index) => (
                <LinkItem key={index} onClick={handleLinkClick} link={link}/>
              ))}
            </UI.Flex>
          )}
        </UI.Span>
      </UI.Flex>

    </QuestionNodeLayout>
  );
};
