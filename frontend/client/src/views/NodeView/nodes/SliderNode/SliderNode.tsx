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
import ReactMarkdown from 'react-markdown';
import Slider from './Slider';

type SliderNodeProps = GenericNodeProps;

const sliderValueAnimeVariants: Variants = {
  initial: {
    opacity: 0,
    y: '100px',
    transform: 'scale(1)',
  },
  active: {
    opacity: 1,
    y: 0,
  },
};

const SliderNode = ({ node, onEntryStore }: SliderNodeProps) => {
  const controls = useAnimation();

  const { watch, getValues, triggerValidation, register } = useForm<{slider: number}>({
    defaultValues: {
      slider: 50.01,
    },
  });

  const sliderValue = Number(watch({ nest: true }).slider / 10);
  const sliderColor = transform(sliderValue, [0, 5, 10], ['#E53E3E', '#F6AD55', '#38B2AC']);

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

  return (
    <SliderNodeContainer>
      <Div>
        <NodeTitle><ReactMarkdown>{node.title}</ReactMarkdown></NodeTitle>
      </Div>
      <Div>
        <SliderNodeValue initial="initial" variants={sliderValueAnimeVariants} animate={controls}>
          <motion.p animate={{ color: sliderColor, borderColor: Color(sliderColor).lighten(0.3).hex() }}>
            {sliderValue.toFixed(1)}
          </motion.p>
        </SliderNodeValue>
        <Slider onSubmit={handleSubmit} register={register} animationControls={controls} />
      </Div>

    </SliderNodeContainer>
  );
};

export default SliderNode;
