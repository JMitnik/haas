import React from 'react';
import Color from 'color';
import {
  Button as ChakraButton, ButtonProps as ChakraButtonProps,
  ButtonGroup as ChakraButtonGroup, ButtonGroupProps as ChakraButtonGroupProps,
  IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps
} from '@chakra-ui/core';
import styled, { css } from 'styled-components';


export interface ButtonProps extends ChakraButtonProps { };

const ButtonContainer = styled.div`
  svg {
    width: 1rem;
  }
`;

export const Button = React.forwardRef((props: ButtonProps, ref) => (
  <ButtonContainer>
    <ChakraButton borderRadius={10} variantColor="main" {...props} ref={ref} />
  </ButtonContainer>
));

export const ButtonGroup = (props: ChakraButtonGroupProps) => (
  <ChakraButtonGroup {...props} />
);

export const GradientButton = styled(Button)`
  ${({ theme }) => css`
    box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
    border-radius: 10px;
    transform: none;
    padding: 12px !important;
    font-size: 1rem;
    background: linear-gradient(45deg, ${Color(theme.colors.primary).lighten(0.3).hex()}, ${Color(theme.colors.primary).lighten(0.3).saturate(1).hex()});
    font-family: 'Inter', sans-serif;
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.8).saturate(1).hex()
      : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
    white-space: normal !important;

    &:hover {
      box-shadow: 0 4px 6px rgba(50,50,93,.20), 0 1px 3px rgba(0,0,0,.16);
    }
  `}
`;

export const IconButton = (props: ChakraIconButtonProps) => (
  <ChakraIconButton {...props} />
);
