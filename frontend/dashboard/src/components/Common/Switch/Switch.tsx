import * as RadixSwitch from '@radix-ui/react-switch';
import React from 'react';
import styled, { css } from 'styled-components';

export const SwitchContainer = styled(RadixSwitch.Root)`
 ${({ theme }) => css`
    all: unset;
    cursor: pointer;
    width: 42px;
    height: 25px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 90px;
    position: relative;
    box-shadow: ${theme.boxShadows.sm};

    &[data-state='checked'] { 
      background-color: ${theme.colors.main['500']};
    };
  `}
`;

export const SwitchThumb = styled(RadixSwitch.Thumb)`
  ${({ theme }) => css`
  display: block;
  width: 21px;
  height: 21px;
  background-color: white;
  border-radius: 90px;
  box-shadow: ${theme.boxShadows.sm};
  transition: transform 100ms;
  transform: translateX(2px);
  will-change: transform;

  &[data-state="checked"] { 
    transform: translateX(19px);
  };

  `}
`;

interface SwitchProps {
  style?: React.CSSProperties;
  children: React.ReactNode;
  isChecked: boolean;
  onChange: () => void;
}

export const Switch = ({ style, children, isChecked, onChange }: SwitchProps) => (
  <SwitchContainer onCheckedChange={onChange} checked={isChecked} style={style}>
    {children}
  </SwitchContainer>
);
