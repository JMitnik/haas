import React from 'react';
import styled, { css } from 'styled-components';
import { Paragraph } from './Type';
import { Div } from './Generics';

export const ModalTitle = styled(Paragraph)``;

export const ModalBody = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 1.5}px;
  `}
`;

interface ModalHeadProps {
  children: React.ReactNode;
}

const ModalHeadContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 1}px ${theme.gutter * 1.5}px;
    background: ${theme.colors.neutral[300]};
    border-radius: 10px 10px 0 0;

    ${ModalTitle} {
      font-size: 1.5rem;
      color: ${theme.colors.main[500]};
      font-weight: 600;
    }

    & + ${ModalBody} {
      /* Give it some inset box-shadow for a bit of spiciness */
      box-shadow: rgb(0 0 0 / 6%) 0px 1px 4px 0px inset;
    }
  `}
`;

export const ModalHead = ({ children }: ModalHeadProps) => (
  <ModalHeadContainer>
    {children}
  </ModalHeadContainer>
)
