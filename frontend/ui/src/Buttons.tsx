import React from 'react';
import { 
  Button as ChakraButton, ButtonProps as ChakraButtonProps,
  ButtonGroup as ChakraButtonGroup, ButtonGroupProps as ChakraButtonGroupProps,
  IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps
} from '@chakra-ui/core';

import { forwardRef } from 'react';


export interface ButtonProps extends ChakraButtonProps {}

export const Button = forwardRef((props: ButtonProps) => (
  <ChakraButton {...props} />
));

export const ButtonGroup = forwardRef((props: ChakraButtonGroupProps) => (
  <ChakraButtonGroup {...props} />
));

export const IconButton = forwardRef((props: ChakraIconButtonProps) => (
  <ChakraIconButton {...props} />
));