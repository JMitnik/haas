import React from 'react';

import { H2, H4 } from '@haas/ui';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { GenericNodeProps } from '../types';
import { ShareNodeContainer } from './ShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const ShareNode = ({ node }: SocialShareNodeProps) => {
  useDialogueFinish();
  console.log('node: ', node);

  return (
    <ShareNodeContainer>
      <H2 color="white">Thank you for participating (ShareNode)!</H2>
      <H4 color="white" textAlign="center">
        We will strive towards making you
        {' '}
        <i>happier.</i>
      </H4>
    </ShareNodeContainer>
  );
};

export default ShareNode;
