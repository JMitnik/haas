import * as UI from '@haas/ui';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { QuestionNodeLayout } from '../QuestionNode/QuestionNodeLayout';
import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { QuestionNodeTitle } from '../QuestionNode/QuestionNodeTitle';
import { useDialogueStore } from '../Dialogue/DialogueStore';

export const POSTLEAFNODE_ID = '-1';


export const PostLeafNode = ({ node }: QuestionNodeProps) => {
  const { t } = useTranslation();
  const finish = useDialogueStore(state => state.finish);

  useEffect(() => {
    finish(node.id);
  }, [finish, node.id]);

  const title = node.title || t('postleaf_default_title');
  const subtext = node.postLeafBody || t('postleaf_default_subtext');

  return (
    <QuestionNodeLayout node={node}>
      <QuestionNodeTitle>
        {title}
      </QuestionNodeTitle>

      <UI.Div>
        {subtext}
      </UI.Div>
    </QuestionNodeLayout>
  )
};
