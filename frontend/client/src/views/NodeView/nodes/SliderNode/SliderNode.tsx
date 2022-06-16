import { Div } from '@haas/ui';
import { useForm } from 'react-hook-form';
import React from 'react';

import { GenericQuestionNodeProps } from 'modules/Node/Node.types';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionActionType } from 'types/core-types';

import { SliderNodeContainer } from './SliderNodeStyles';
import { findSliderChildEdge } from './SliderNode.helpers';
import Slider from './Slider';

type SliderNodeProps = GenericQuestionNodeProps;

const SliderNode = ({ node, onRunAction }: SliderNodeProps) => {
  const form = useForm<{ slider: number }>({
    defaultValues: {
      slider: 50.01,
    },
  });

  const handleSubmit = async () => {
    const validForm = await form.triggerValidation('slider');
    if (!validForm) return;

    const value = form.getValues().slider;

    const childEdge = findSliderChildEdge(value, node.children);
    const childNode = childEdge?.childNode?.id;

    onRunAction({
      startTimestamp: new Date(Date.now()),
      action: {
        type: SessionActionType.SliderAction,
        slider: { value },
      },
      reward: {
        toNode: childNode,
        toEdge: childEdge.id,
        overrideCallToActionId: node.overrideLeaf?.id,
      },
    });
  };

  return (
    <SliderNodeContainer>
      <Div>
        <NodeTitle>{node.title}</NodeTitle>
      </Div>
      <Div>
        <Slider
          happyText={node.sliderNode?.happyText}
          unhappyText={node.sliderNode?.unhappyText}
          markers={node?.sliderNode?.markers || []}
          form={form}
          onSubmit={handleSubmit}
          register={form.register}
        />
      </Div>
    </SliderNodeContainer>
  );
};

export default SliderNode;
