import { Share2 } from 'react-feather';
import { useClipboard } from 'use-clipboard-copy';
import React from 'react';

import { Flex } from '@haas/ui';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { GenericNodeProps } from '../types';
import { ShareButton, ShareButtonContainer, ShareNodeContainer, SuccesMessageContainer } from './ShareNodeStyles';
import ReactMarkdown from 'react-markdown';

type SocialShareNodeProps = GenericNodeProps;

const formatUrl = (url: string) => {
  if (url.startsWith('http')) return url;

  return `https://${url}`;
};

const ShareNode = ({ node }: SocialShareNodeProps) => {
  useDialogueFinish();
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
      })
        .then(() => alert('Done'))
        .catch((err: any) => alert(err));
    } else {
      const copiedText = `${share?.title} \n
        ${formatUrl(share?.url || '')}`;
      copy(copiedText);
    }
    return '';
  };

  return (
    <ShareNodeContainer>
      <NodeTitle><ReactMarkdown>{node.title}</ReactMarkdown></NodeTitle>
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
