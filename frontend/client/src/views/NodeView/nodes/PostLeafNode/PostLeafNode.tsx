import React from 'react';

import { H2, H4 } from '@haas/ui';
import useDialogueFinish from 'hooks/useDialogueFinish';

import useDialogueTree from 'providers/DialogueTreeProvider';

import { PostLeafNodeContainer } from './PostLeafNodeStyles';

const PostLeafNode = () => {
  const store = useDialogueTree();

  store.stop();

  return (
    <PostLeafNodeContainer>
      <H2 color="white">Thank you for participating!</H2>
      <H4 color="white" textAlign="center">
        We will strive towards making you
        {' '}
        <i>happier.</i>
      </H4>
    </PostLeafNodeContainer>
  );
};

export default PostLeafNode;
