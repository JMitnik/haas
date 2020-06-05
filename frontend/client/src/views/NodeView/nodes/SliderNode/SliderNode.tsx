import { useAnimation } from 'framer-motion';
import { useForm } from 'react-hook-form';
import React from 'react';

import { Div } from '@haas/ui';
import { HAASFormEntry } from 'types/generic';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
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

  const { watch, getValues, triggerValidation, register } = useForm<HAASFormEntry>({
    defaultValues: {
      numberValue: 50.01,
    },
  });

  const formatSliderEntry = (entry: HAASFormEntry) => {
    const { numberValue, ...entryVals } = entry;

    if (numberValue) {
      return { ...entryVals, numberValue: cleanInt(numberValue) };
    }

    return entry;
  };

  const handleSubmit = async () => {
    const validForm = await triggerValidation('numberValue');

    if (validForm) {
      const formEntry = formatSliderEntry(getValues({ nest: true }));

      const entry: any = {
        numberValue: formEntry.numberValue,
        textValue: null,
        multiValues: null,
      };

      onEntryStore(entry, formEntry.numberValue);
    }
  };

  const showValue = () => {
    const val = watch({ nest: true }).numberValue;

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
