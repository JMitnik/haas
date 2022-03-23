import * as UI from '@haas/ui';
import { Share2 } from 'react-feather';
import { useClipboard } from 'use-clipboard-copy';
import React from 'react';

import { Flex } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';

import { ClientButton } from 'components/Buttons/Buttons';
import { GenericNodeProps } from '../types';
import { ShareButtonContainer, ShareNodeContainer, SuccesMessageContainer } from './ShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const formatUrl = (url: string) => {
  if (url.startsWith('http')) return url;

  return `https://${url}`;
};

const ShareNode = ({ node }: SocialShareNodeProps) => {
  const { copied, copy } = useClipboard({
    copiedTimeout: 1000,
  });

  const navi: any = window.navigator;

  const { share } = node;
  const handleCopy = async (): Promise<any> => {
    if (navi?.share) {
      // If Web Share API is supported
      await navi.share({
        text: `${share?.title} \n ${formatUrl(share?.url || '')}`,
      });
      window.location.reload();
    } else {
      const copiedText = `${share?.title} \n
        ${formatUrl(share?.url || '')}`;
      copy(copiedText);
    }
    return '';
  };

  return (
    <ShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>
      <ShareButtonContainer flexGrow={1}>
        <Flex
          width="auto"
          position="relative"
          alignItems="center"
          justifyContent="center"
        >
          <UI.Div width="auto">
            <ClientButton lefticon={<Share2 />} onClick={handleCopy} usePulse size="lg">
              {share?.tooltip || 'Share'}
            </ClientButton>
          </UI.Div>
          {copied && (
          <SuccesMessageContainer
            animate={{ opacity: 1, bottom: -30 }}
            initial={{ opacity: 0, bottom: -80 }}
          >
            Copied Link!
          </SuccesMessageContainer>
          )}

        </Flex>

      </ShareButtonContainer>

    </ShareNodeContainer>
  );
};

export default ShareNode;
