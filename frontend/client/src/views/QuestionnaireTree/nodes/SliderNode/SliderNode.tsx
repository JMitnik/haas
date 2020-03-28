import React from 'react';
import { H1, Slider, ColumnFlex, Div, H2 } from '@haas/ui';
import { useForm } from 'react-hook-form';
import useHAASTree from 'hooks/use-haas-tree';
import { cleanInt } from 'utils/cleanInt';
import { GenericNodeProps } from '../Node';
import { HAASFormEntry } from 'hooks/use-questionnaire';
import { SliderNodeContainer, SliderNodeValue } from './SliderNodeStyles';

type SliderNodeProps = GenericNodeProps;

const SliderNode = ({ node }: SliderNodeProps) => {
  const {
    treeDispatch: { goToChild }
  } = useHAASTree();

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
        <SliderNodeValue
          textAlign="center"
          my="0"
          fontSize={['5rem !important', '5rem !important']}
          color="white"
        >
          {showValue()}
        </SliderNodeValue>
      </Div>
      <Slider
        width={1}
        name="numberValue"
        onMouseUp={() => onSubmit()}
        onTouchEnd={() => onSubmit()}
        min={0}
        max={100}
        mt={4}
        defaultValue={50}
        ref={register}
      />
    </SliderNodeContainer>
  );
};

export default SliderNode;
