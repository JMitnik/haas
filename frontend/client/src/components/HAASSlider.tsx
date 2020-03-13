import React, { useEffect } from 'react';
import { H1, Slider, ColumnFlex, Div } from '@haas/ui';
import { useFormContext, useForm } from 'react-hook-form';
import { useHAASTree, HAASEntry } from '../hooks/use-haas-tree';


const cleanInt = (x: any) => {
  x = Number(x);
  return x >= 0 ? Math.floor(x) : Math.ceil(x);
};

export default cleanInt;


export const HAASSlider = () => {
  const { watch, setValue, getValues, triggerValidation, register } = useForm<HAASEntry>({
    defaultValues: {
      data: {
        numberValue: 50,
        edgeId: '',
        nodeId: ''
      }
    }
  });

  const { goToChild, nodeHistoryStack, edgeHistoryStack } = useHAASTree();
  const [ activeNode ] = nodeHistoryStack.slice(-1);
  const [ activeEdge ] = edgeHistoryStack.slice(-1);

  // Register the relevant form-entries via
  useEffect(() => {
    register('data.edgeId');
    register('data.nodeId');
  }, [register]);

  // Set the relevant active-node on render
  useEffect(() => {
    if (activeNode?.id) {
      setValue('data.nodeId', activeNode.id);
    }
  }, [activeNode, register, setValue]);

  // Set the relevant edge on render
  useEffect(() => {
    if (activeEdge?.id) {
      setValue('data.edgeId', activeEdge.id);
    }
  }, [activeEdge, register, setValue]);

  const onSubmit = async () => {
    const validForm = await triggerValidation('data.numberValue');

    if (validForm) {
      const formEntry = formatSliderEntry(getValues({ nest: true }));

      if (formEntry.data.numberValue) {
        goToChild(formEntry.data.numberValue, formEntry);
      }
    }
  };

  const formatSliderEntry = (entry: HAASEntry) => {
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
