import React from 'react';
import { H1, Slider, ColumnFlex, Div } from '@haas/ui';
import { useForm } from 'react-hook-form';
import { useHAASTree, HAASFormEntry } from '../hooks/use-haas-tree';


const cleanInt = (x: any) => {
  x = Number(x);
  return x >= 0 ? Math.floor(x) : Math.ceil(x);
};

export default cleanInt;


export const HAASSlider = () => {
  const { goToChild } = useHAASTree();

  const { watch, getValues, triggerValidation, register } = useForm<HAASFormEntry>({
    defaultValues: {
      data: {
        numberValue: 50,
      },
    },
  });

  const onSubmit = async () => {
    const validForm = await triggerValidation('data.numberValue');

    if (validForm) {
      const formEntry = formatSliderEntry(getValues({ nest: true }));

      if (formEntry.data.numberValue) {
        goToChild(formEntry.data.numberValue, formEntry);
      }
    }
  };

  const formatSliderEntry = (entry: HAASFormEntry) => {
    const { numberValue, ...entryVals } = entry?.data;

    if (numberValue) {
      return {
        data: {
          numberValue: cleanInt(numberValue) ,
          ...entryVals
        }
      };
    }

    return entry;
  }

  const showValue = () => {
    let val = watch({ nest: true }).data.numberValue;

    if (val) return val / 10;

    return 0;
  }

  return (
    <form>
      <Div flexGrow={0.5}>
        <ColumnFlex height="100%" justifyContent="space-between" width={1}>
          <H1 textAlign="center" color="white">{showValue()}</H1>
          <Slider
            width={1}
            name="data.numberValue"
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
  )
};
