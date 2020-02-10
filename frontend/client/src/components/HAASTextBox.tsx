import React from 'react';
import { H1, H5, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, MultiChoiceOption } from '../hooks/use-json-tree';
import { Instagram } from 'react-feather';
import { useTransition, animated } from 'react-spring';

export const HAASTextBox = () => {
  const { goToChild } = useJSONTree();

  return (
    <>
      <Flex>
        <textarea />
        <Button onClick={() => goToChild('')}>Continue</Button>
      </Flex>
    </>
  );
}
