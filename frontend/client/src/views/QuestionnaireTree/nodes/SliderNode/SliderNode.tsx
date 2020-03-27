import React from 'react';
import { H1, Slider, ColumnFlex, Div } from '@haas/ui';
import { useForm } from 'react-hook-form';
import useHAASTree, { HAASFormEntry } from 'hooks/use-haas-tree';
import { cleanInt } from 'utils/cleanInt';
import { GenericNodeProps } from '../Node';

type SliderNodeProps = GenericNodeProps;

const SliderNode = () => {
  const { goToChild, addFormEntry } = useHAASTree();

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
        addFormEntry(formEntry);
        goToChild(formEntry.numberValue, formEntry);
      }
    }
  };

  const showValue = () => {
    const val = watch({ nest: true }).numberValue;

    if (val) return val / 10;

    return 0;
  };

  return (
    <form>
      <Div pb={['60px', '120px']}>
        <ColumnFlex height="100%" justifyContent="space-between" width={1}>
          <H1
            textAlign="center"
            my="0"
            fontSize={['5rem !important', '5rem !important']}
            color="white"
          >
            {showValue()}
          </H1>
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
        </ColumnFlex>
      </Div>
    </form>
  );
};

export default SliderNode;
