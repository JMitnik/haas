import * as UI from '@haas/ui';
import React from 'react';

import { QuestionNode, QuestionNodeTypeEnum } from 'types/core-types';
import { useDialogueState } from 'modules/Dialogue/DialogueState';

import { PostLeafNodeContainer } from './PostLeafNodeStyles';

export const POSTLEAFNODE_ID = '-1';

export const defaultPostLeafNode: QuestionNode = {
  id: POSTLEAFNODE_ID,
  title: '',
  type: QuestionNodeTypeEnum.Generic,
  isLeaf: true,
  isRoot: false,
  links: [],
  options: [],
  children: [],
};

const PostLeafNode = () => {
  const { dialogue } = useDialogueState();

  const header = dialogue?.postLeafNode?.header || 'Thank you for participating!';
  const subHeader = dialogue?.postLeafNode?.subtext || 'We will strive towards making your happier';

  return (
    <PostLeafNodeContainer>
      <UI.H2 color="white">{header}</UI.H2>
      <UI.H4 color="white" textAlign="center">
        {subHeader}
      </UI.H4>
    </PostLeafNodeContainer>
  );
};
export default PostLeafNode;
