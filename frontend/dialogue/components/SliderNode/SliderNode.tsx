import * as UI from '@haas/ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useRef } from 'react';

import { QuestionNodeContainer } from '../QuestionNode/QuestionNodeStyles';
import { useSession } from '../Session/SessionProvider';
import { QuestionNodeLayout } from '../QuestionNode/QuestionNodeLayout';
import { findSliderChildEdge } from './findSliderChildEdge';
import { SliderBunny } from './SliderBunny';
import { QuestionNodeTitle } from '../QuestionNode/QuestionNodeTitle';
import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { SessionActionType } from '../../types/generated-types';

export const SliderNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const startTime = useRef(Date.now());
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      slider: 50,
    },
  });
  const { sessionId } = useSession();
  const getValues = form.getValues;

  /**
   * Handles a sliding action: find child and pass that child to par
   */
  const handleRunAction = useCallback(() => {
    const sliderValue = parseInt(getValues().slider as unknown as string, 10);
    const childEdge = findSliderChildEdge(sliderValue, node.children);
    const childNodeId = childEdge.childNode.id;

    onRunAction({
      sessionId,
      timestamp: Math.floor(Date.now() - startTime.current),
      action: {
        type: SessionActionType.SliderAction,
        slider: {
          value: sliderValue,
        },
      },
      reward: {
        overrideCallToActionId: node.overrideLeafId,
        toEdge: childEdge?.id,
        toNode: childNodeId,
      },
    });
  }, [getValues, sessionId, node, onRunAction]);

  return (
    <QuestionNodeContainer>
      <QuestionNodeLayout node={node}>
        <QuestionNodeTitle>{node.title}</QuestionNodeTitle>
        <UI.Div position="relative">
          <SliderBunny
            form={form}
            onSubmit={handleRunAction}
            happyText={node.sliderNode?.happyText || t('happy')}
            unhappyText={node.sliderNode?.unhappyText || t('unhappy')}
            markers={node.sliderNode?.markers || []}
          />
        </UI.Div>
      </QuestionNodeLayout>
    </QuestionNodeContainer>
  )
};
