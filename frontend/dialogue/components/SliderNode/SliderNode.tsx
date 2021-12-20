import * as UI from '@haas/ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useRef } from 'react';

import { QuestionNodeProps } from 'components/QuestionNode/QuestionNodeTypes';
import { QuestionNodeContainer, QuestionNodeTitle } from 'components/QuestionNode/QuestionNodeStyles';
import { useSession } from 'components/Session/SessionProvider';
import { SessionEventType } from 'types/generated-types';
import { NodeLayout } from 'components/QuestionNode/NodeLayout';

import { findSliderChildEdge } from './findSliderChildEdge';
import { SliderBunny } from './SliderBunny';

export const SliderNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const { t } = useTranslation();
  const startTime = useRef(new Date());
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
    const nextEdge = findSliderChildEdge(sliderValue, node.children);
    const nextNodeId = nextEdge.childNode.id;

    onRunAction({
      event: {
        sessionId,
        toNodeId: nextNodeId,
        eventType: SessionEventType.SliderAction,
        sliderValue: {
          relatedNodeId: node.id,
          value: sliderValue,
          timeSpent: new Date().getTime() - startTime.current.getTime(),
        },
        timestamp: new Date(),
      },
      activeCallToAction: node.overrideLeaf,
    })
  }, [getValues, sessionId, node, onRunAction]);

  return (
    <QuestionNodeContainer>
      <NodeLayout node={node}>
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
      </NodeLayout>
    </QuestionNodeContainer>
  )
};
