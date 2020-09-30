import { Share2 } from 'react-feather';
import { useClipboard } from 'use-clipboard-copy';
import React from 'react';

import { Div, Flex, H2 } from '@haas/ui';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { GenericNodeProps } from '../types';
import { ShareButton, ShareButtonContainer, ShareNodeContainer } from './ShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const ShareNode = ({ node }: SocialShareNodeProps) => {
  useDialogueFinish();
  const { copied, copy } = useClipboard({
    copiedTimeout: 600,
  });
  console.log('node: ', node);

  const newVariable: any = window.navigator;

  const { share } = node;
  const handleCopy = () => {
    console.log('new variable: ', newVariable);
    if (newVariable?.share) {
      // Web Share API is supported
      newVariable.share({
        title: `${share?.title}`,
        url: `${share?.url}`,
        text: 'Here is your discount code. Please go to following link',
      });
    } else {
      const copiedText = `${share?.title}
      Here is your discount code. Please go to following link:
      ${share?.url}`;
      return copy(copiedText);
    }
  };

  return (
    <ShareNodeContainer>
      <H2 color="white">{node.title}</H2>
      <ShareButtonContainer flexGrow={1}>
        <Flex width="100%" alignItems="center" justifyContent="center">
          <ShareButton onClick={() => handleCopy()}>
            <Share2 />
            Share
          </ShareButton>
        </Flex>
        <Div>
          {copied && 'Copied link!' }
        </Div>

      </ShareButtonContainer>

    </ShareNodeContainer>
  );
};

export default ShareNode;
