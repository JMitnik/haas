import * as UI from '@haas/ui';
import React from 'react';

import { QuestionNode, QuestionNodeTypeEnum } from 'types/core-types';
import { useDialogueState } from 'modules/Dialogue/DialogueState';

import { LanguageEnumType } from 'types/generated-types';
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

const getCloseText = (language?: LanguageEnumType) => {
  switch (language) {
    case LanguageEnumType.Dutch:
      return 'U kunt nu dit scherm sluiten';
    case LanguageEnumType.English:
      return 'You may close this window now';
    case LanguageEnumType.German:
      return 'Sie können dieses Fenster jetzt schließen';
    default:
      return 'You may close this window now';
  }
};

const PostLeafNode = () => {
  const { dialogue } = useDialogueState();

  const header = dialogue?.postLeafNode?.header || 'Thank you for participating!';
  const subHeader = dialogue?.postLeafNode?.subtext || 'We strive to make you happier';

  return (
    <PostLeafNodeContainer>
      <UI.H2>{header}</UI.H2>
      <UI.Div>
        <UI.H4 textAlign="center">
          {subHeader}
        </UI.H4>
        <UI.Div>{getCloseText(dialogue?.language)}</UI.Div>
      </UI.Div>
    </PostLeafNodeContainer>
  );
};
export default PostLeafNode;
