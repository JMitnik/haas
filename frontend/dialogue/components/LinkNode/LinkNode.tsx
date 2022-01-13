import * as UI from '@haas/ui';

import { NodeLayout } from '../QuestionNode/NodeLayout';
import { QuestionNodeTitle } from '../QuestionNode/QuestionNodeStyles';
import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { LinkItem } from './LinkNodeStyles';
import UpsellNode from './UpsellNode';

export const LinkNode = ({ node }: QuestionNodeProps) => {
  // TODO: Use the social capabilities of this event to enqueue
  const handleLinkClick = (event: any) => {
    console.log(event);
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
          {/* {node.links.length === 0 && <DefaultSocialItems />} */}
          {node.links?.map((link, index) => (
            <LinkItem
              title={link.title || undefined}
              data-testid={link.type}
              href={link.url}
              onClick={handleLinkClick}
              target="__blank"
              key={index}
              rel="noopener noreferrer"
              backgroundColor={link.backgroundColor || '#007bb5'}
            >
              test
              {/* {link.type === 'TWITTER' && <Twitter stroke="none" fill="white" />}
              {link.type === 'FACEBOOK' && <Facebook stroke="none" fill="white" />}
              {link.type === 'INSTAGRAM' && <Instagram stroke="white" />}
              {link.type === 'LINKEDIN' && <Linkedin stroke="none" fill="white" />}
              {link.type === 'WHATSAPP' && <Whatsapp stroke="none" fill="white" />}
              {(!['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'WHATSAPP'].includes(link.type) && link.iconUrl)
                && <CustomIcon logo={link.iconUrl} />}
              {(!['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'WHATSAPP'].includes(link.type) && !link.iconUrl)
                && <Globe data-testid="globe" stroke="white" />} */}
            </LinkItem>
          ))}

        </UI.Flex>
      )}

    </NodeLayout>
  );
};
