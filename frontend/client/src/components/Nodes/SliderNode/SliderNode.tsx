import { Div, H2 } from '@haas/ui';
import { GenericNodeProps } from '../NodeLayout/NodeLayout';
import { HAASFormEntry } from 'types/generic';
import { SliderNodeContainer, SliderNodeValue } from './SliderNodeStyles';
import { cleanInt } from 'utils/cleanInt';
import { useAnimation } from 'framer-motion';
import { useForm } from 'react-hook-form';
import React from 'react';
import Slider from './Slider';
import useDialogueTree from 'providers/DialogueTreeProvider';

type SliderNodeProps = GenericNodeProps;

const sliderValueAnimeVariants = {
  initial: {
    transform: 'scale(1)',
  },
  active: {
    transform: 'scale(1.5)',
  },
};

const SliderNode = ({ node }: SliderNodeProps) => {
  // const {
  //   treeDispatch: { saveEntry, goToChild },
  // } = useDialogueTree();
  const goToChild = (a: any, b: any, c: any) => {};
  const saveEntry = (a: any, b: any, c: any) => {};

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

  const onSubmit = async () => {
    const validForm = await triggerValidation('numberValue');

    if (validForm) {
      const formEntry = formatSliderEntry(getValues({ nest: true }));

      if (formEntry?.numberValue) {
        saveEntry(node, formEntry?.numberValue, formEntry);
        goToChild(node, formEntry.numberValue, null);
      }
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
        <H2>{node.title}</H2>
      </Div>
      <Div>
        <SliderNodeValue initial="initial" variants={sliderValueAnimeVariants} animate={controls}>
          {showValue()}
        </SliderNodeValue>
        <Slider onSubmit={onSubmit} register={register} animationControls={controls} />
      </Div>
    </SliderNodeContainer>
  );
};

export default SliderNode;
