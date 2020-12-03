import { Share2 } from 'react-feather';
import { useClipboard } from 'use-clipboard-copy';
import React from 'react';

import { Flex } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';

import { GenericNodeProps } from '../types';
import { ShareButton, ShareButtonContainer, ShareNodeContainer, SuccesMessageContainer } from './ShareNodeStyles';

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
        <Flex position="relative" width="100%" alignItems="center" justifyContent="center">
          <ShareButton onClick={handleCopy}>
            <Share2 />
            <span>
              {share?.tooltip || 'Share'}
            </span>
          </ShareButton>
          {copied && (
          <SuccesMessageContainer animate={{
            bottom: ['-50px', '-40px'],
            opacity: [0, 1],
            transition: {
              duration: 0.5,
            },
          }}
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
