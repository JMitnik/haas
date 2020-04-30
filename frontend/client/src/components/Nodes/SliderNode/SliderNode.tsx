import React from 'react';
import { Slider, Div, H2 } from '@haas/ui';
import { useForm } from 'react-hook-form';
import useHAASTree from 'providers/dialogue-tree-provider';
import { cleanInt } from 'utils/cleanInt';
import { GenericNodeProps } from '../Node/Node';
import { HAASFormEntry } from 'types/generic';
import { SliderNodeContainer, SliderNodeValue } from './SliderNodeStyles';
import { useAnimation, motion } from 'framer-motion';

type SliderNodeProps = GenericNodeProps;

const SliderNode = ({ node }: SliderNodeProps) => {
  const {
    treeDispatch: { goToChild }
  } = useHAASTree();

  const controls = useAnimation();

  const { watch, getValues, triggerValidation, register } = useForm<HAASFormEntry>({
    defaultValues: {
      numberValue: 50
    }
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
        goToChild(node, formEntry.numberValue, formEntry);
      }
    }
  };

  const showValue = () => {
    const val = watch({ nest: true }).numberValue;

    if (val) return val / 10;

    return 0;
  };

  return (
    <SliderNodeContainer>
      <Div>
        <H2>{node.title}</H2>
      </Div>
      <Div>
        <SliderNodeValue
          textAlign="center"
          my="0"
          pb="100px"
          fontSize={['3rem !important']}
          color="red"
          backgroundColor="white"
        >
          <motion.div animate={controls}>
            {showValue()}
          </motion.div>
        </SliderNodeValue>
        <Slider
          width={1}
          name="numberValue"
          onMouseDown={() => controls.start({
            scale: 1.5,
          })}
          onMouseUp={() => onSubmit()}
          onTouchEnd={() => onSubmit()}
          min={0}
          max={100}
          mt={4}
          defaultValue={50}
          ref={register}
        />
      </Div>
    </SliderNodeContainer>
  );
};

export default SliderNode;
