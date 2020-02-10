import React from 'react';
import { H1, H5, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, MultiChoiceOption } from '../hooks/use-json-tree';
import { Instagram } from 'react-feather';
import { useTransition, animated } from 'react-spring';


export const HAASSignIn = () => {
  return (
    <>
      <Flex>
        <label htmlFor="email">
          Email Address
          <input id="email" type="email"></input>
        </label>

        <Button onClick={() => console.log('clicked')}>Continue</Button>
      </Flex>
    </>
  );
}
