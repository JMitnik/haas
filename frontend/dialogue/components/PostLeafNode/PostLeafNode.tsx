import * as UI from '@haas/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { NodeLayout } from '../QuestionNode/NodeLayout';
import { QuestionNodeTitle } from '../QuestionNode/QuestionNodeStyles';
import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';

export const POSTLEAFNODE_ID = '-1';



export const PostLeafNode = ({ node }: QuestionNodeProps) => {
  const { t } = useTranslation();

  const title = node.title || t('postleaf_default_title');
  const subtext = node.postLeafBody || t('postleaf_default_subtext');

  return (
    <NodeLayout node={node}>
      <QuestionNodeTitle>
        {title}
      </QuestionNodeTitle>

      <UI.Div>
        {subtext}
      </UI.Div>
    </NodeLayout>
  )
};
