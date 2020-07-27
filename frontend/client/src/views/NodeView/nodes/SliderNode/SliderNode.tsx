import { useAnimation } from 'framer-motion';
import { useForm } from 'react-hook-form';
import React from 'react';

import { Div } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';
import { cleanInt } from 'utils/cleanInt';

import { GenericNodeProps } from '../types';
import { SliderNodeContainer, SliderNodeValue } from './SliderNodeStyles';
import Slider from './Slider';

type SliderNodeProps = GenericNodeProps;

const sliderValueAnimeVariants = {
  initial: {
    transform: 'scale(1)',
  },
  active: {
    transform: 'scale(1.5)',
  },
};

const SliderNode = ({ node, onEntryStore }: SliderNodeProps) => {
  const controls = useAnimation();

  const { watch, getValues, triggerValidation, register } = useForm<{slider: number}>({
    defaultValues: {
      slider: 50.01,
    },
  });

  const handleSubmit = async () => {
    const validForm = await triggerValidation('slider');

    if (validForm) {
      const entry: SessionEntryDataProps = {
        slider: { value: cleanInt(getValues().slider) },
        choice: undefined,
        register: undefined,
        textbox: undefined,
      };

      onEntryStore(entry, entry.slider?.value);
    }
  };

  const showValue = () => {
    const val = watch({ nest: true }).slider;

    if (val) return Number(val / 10).toFixed(1);

    return 0;
  };

  return (
    <SliderNodeContainer>
      <Div>
        <NodeTitle>{node.title}</NodeTitle>
      </Div>
      <Div>
        <SliderNodeValue initial="initial" variants={sliderValueAnimeVariants} animate={controls}>
          {showValue()}
        </SliderNodeValue>
        <Slider onSubmit={handleSubmit} register={register} animationControls={controls} />
      </Div>

    </SliderNodeContainer>
  );
};

export default SliderNode;
