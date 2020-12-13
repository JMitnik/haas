import Color from 'color';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled, { css } from 'styled-components/macro';

import { Div, H2 } from '@haas/ui';

export const NodeContainer = styled(Div)`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    height: 100%;

    @media (min-width: 601px) {
      height: 90%;
    }
    
    > ${Div} {
      text-align: center;
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      height: 100%;
    }

    @media and ${theme.media.desk} {
      height: 90%;
    }
  `}
`;

type NodeTitleSize = 'xs' | 'sm' | 'md' | 'lg';

const NodeTitleWrapper = styled(H2)<{ size: NodeTitleSize }>`
  font-weight: 800;
  white-space: pre-line;
  text-align: left;

  @media (min-width: 601px) {
    text-align: center;
  }
  
  ${({ theme, size }) => css`
    ${size === 'xs' && css`
      font-size: 1.1rem;
    
      @media (min-width: 601px) {
        font-size: 1.5rem;
      }
    `}

    ${size === 'sm' && css`
      font-size: 1.3rem;
    
      @media (min-width: 601px) {
        font-size: 1.8rem;
      }
    `}

    ${size === 'md' && css`
      font-size: 1.8rem;
    
      @media (min-width: 601px) {
        font-size: 2rem;
      }
    `}

    ${size === 'lg' && css`
      font-size: 2.5rem;
    
      @media (min-width: 601px) {
        font-size: 2.5rem;
      }
    `}

    
  color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.9).saturate(1).hex()
    : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
  `}
`;

export const NodeTitle = ({ children }: { children: string }) => {
  const textLength = children.length;

  let fontSize: NodeTitleSize = 'md';

  switch (true) {
    case textLength < 30:
      fontSize = 'lg';
      break;
    case textLength >= 30 && textLength < 60:
      fontSize = 'md';
      break;
    default:
      fontSize = 'sm';
      break;
  }

  return (
    <NodeTitleWrapper size={fontSize}>
      <ReactMarkdown>
        {children}
      </ReactMarkdown>
    </NodeTitleWrapper>
  );
};
