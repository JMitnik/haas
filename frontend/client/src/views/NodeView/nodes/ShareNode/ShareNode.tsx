import { Share2 } from 'react-feather';
import React from 'react';

import { H2, H4 } from '@haas/ui';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { GenericNodeProps } from '../types';
import { ShareButton, ShareButtonContainer, ShareNodeContainer } from './ShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const ShareNode = ({ node }: SocialShareNodeProps) => {
  useDialogueFinish();
  console.log('node: ', node);

  const { share } = node;

  return (
    <ShareNodeContainer>
      <H2 color="white">{node.title}</H2>
      <ShareButtonContainer>
        <ShareButton>
          <Share2 />
          Share
        </ShareButton>
      </ShareButtonContainer>

    </ShareNodeContainer>
  );
};

export default ShareNode;
