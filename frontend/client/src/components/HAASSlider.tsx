import React from 'react';
import { H1, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree } from '../hooks/use-json-tree';

export const HAASSlider = () => {
  const { register, watch, getValues } = useFormContext();
  const { goToChild } = useJSONTree();

  return (
    <Div flexGrow={0.5}>
      <ColumnFlex height="100%" justifyContent="space-between" width={1}>
        <H1 fontSize={-1} textAlign="center" color="white">{watch('slider-value', '5')}</H1>
        <Slider width={1} name="slider-value" onMouseUp={() => goToChild(getValues()['slider-value'] || null)} min={0} max={10} mt={4} defaultValue={5} ref={register} />
      </ColumnFlex>
    </Div>
  )
};
