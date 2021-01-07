import React, { forwardRef } from 'react';
import { 
  Button as ChakraButton, ButtonProps as ChakraButtonProps,
  ButtonGroup as ChakraButtonGroup, ButtonGroupProps as ChakraButtonGroupProps,
  IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps
} from '@chakra-ui/core';
import styled, { css } from 'styled-components';


export interface ButtonProps extends ChakraButtonProps {};

const ButtonContainer = styled.div`
  svg {
    width: 1rem;
  }
`;

export const Button = (props: ButtonProps) => (
  <ButtonContainer>
    <ChakraButton {...props} />
  </ButtonContainer>
);

export const ButtonGroup = (props: ChakraButtonGroupProps) => (
  <ChakraButtonGroup {...props} />
);

export const IconButton = (props: ChakraIconButtonProps) => (
  <ChakraIconButton {...props} />
);