import { Share2 } from 'react-feather';
import { useClipboard } from 'use-clipboard-copy';
import React from 'react';

import { Flex, H2 } from '@haas/ui';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { GenericNodeProps } from '../types';
import { ShareButton, ShareButtonContainer, ShareNodeContainer, SuccesMessageContainer } from './ShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const ShareNode = ({ node }: SocialShareNodeProps) => {
  useDialogueFinish();
  const { copied, copy } = useClipboard({
    copiedTimeout: 1000,
  });

  const navi: any = window.navigator;

  const { share } = node;
  const handleCopy = () => {
    if (navi?.share) {
      // Web Share API is supported
      navi.share({
        title: `${share?.title}`,
        url: `${share?.url}`,
        text: 'I would like to share this with you:',
      });
    } else {
      const copiedText = `${share?.title}
      I would like to share this with you:
      ${share?.url}`;
      return copy(copiedText);
    }
  };

  return (
    <ShareNodeContainer>
      <H2 color="white">{node.title}</H2>
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
