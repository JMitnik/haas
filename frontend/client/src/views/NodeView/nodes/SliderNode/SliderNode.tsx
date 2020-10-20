import { Variants, motion, transform, useAnimation } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Color from 'color';
import React from 'react';

import { Div } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';
import { cleanInt } from 'utils/cleanInt';

import { GenericNodeProps } from '../types';
import { SliderNodeContainer, SliderNodeValue } from './SliderNodeStyles';
import Slider from './Slider';

type SliderNodeProps = GenericNodeProps;

const SliderNode = ({ node, onEntryStore }: SliderNodeProps) => {
  const form = useForm<{slider: number}>({
    defaultValues: {
      slider: 50.01,
    },
  });

  const handleSubmit = async () => {
    const validForm = await form.triggerValidation('slider');

    if (validForm) {
      const entry: SessionEntryDataProps = {
        slider: { value: cleanInt(form.getValues().slider) },
        choice: undefined,
        register: undefined,
        textbox: undefined,
      };

      onEntryStore(entry, entry.slider?.value);
    }
  };

  return (
    <SliderNodeContainer>
      <Div>
        <NodeTitle>{node.title}</NodeTitle>
      </Div>
      <Div>
        <Slider form={form} onSubmit={handleSubmit} register={form.register} />
      </Div>

    </SliderNodeContainer>
  );
};

export default SliderNode;
