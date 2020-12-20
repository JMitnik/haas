import React, { forwardRef } from 'react';
import { 
  Button as ChakraButton, ButtonProps as ChakraButtonProps,
  ButtonGroup as ChakraButtonGroup, ButtonGroupProps as ChakraButtonGroupProps,
  IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps
} from '@chakra-ui/core';
import styled, { css } from 'styled-components/macro';


export interface ButtonProps extends ChakraButtonProps {};

const ButtonContainer = styled.div`
  svg {
    width: 1rem;
  }
`;

export const Button = forwardRef((props: ButtonProps) => (
  <ButtonContainer>
    <ChakraButton {...props} />
  </ButtonContainer>
));

export const ButtonGroup = forwardRef((props: ChakraButtonGroupProps) => (
  <ChakraButtonGroup {...props} />
));

export const IconButton = forwardRef((props: ChakraIconButtonProps) => (
  <ChakraIconButton {...props} />
));