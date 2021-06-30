import { H2, H4 } from '@haas/ui';
import React from 'react';

import useDialogueTree from 'providers/DialogueTreeProvider';

import { PostLeafNodeContainer } from './PostLeafNodeStyles';

const PostLeafNode = () => {
  const { store } = useDialogueTree();

  console.log('dialogue finisher', store.tree?.dialogueFinisher);

  return (
    <PostLeafNodeContainer>
      <H2 color="white">{store.tree?.dialogueFinisher?.header || 'Thank you for participating!'}</H2>
      {store.tree?.dialogueFinisher?.subtext ? (
        <H4 color="white" textAlign="center">
          {store.tree?.dialogueFinisher?.subtext}
        </H4>
      )
        : (
          <H4 color="white" textAlign="center">
            We will strive towards making you
            {' '}
            <i>happier.</i>
          </H4>
        )}

    </PostLeafNodeContainer>
  );
};
export default PostLeafNode;
