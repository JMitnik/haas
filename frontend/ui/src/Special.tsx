import styled, { css } from 'styled-components';
import React from 'react';
import { Text } from './Type';
import Card from './Cards';
import { Span } from './Span';

const IllustrationCardWrapper = styled.div`
  ${({ theme }) => css`
    ${Span} {
      color: ${theme.colors.gray['500']};
      bottom: ${theme.gutter}px;
      font-weight: 200;
      font-size: 1.3rem;
      text-align: center; 
      transform: translateY(-35%);
      display: block;
      max-width: 80%;
      margin: 0 auto;
    }

    > svg {
      color: ${theme.colors.primary};
      max-width: 300px;
      max-height: 300px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin: 0 auto;
      opacity: 0.5;
    }
  `}
`;


export const IllustrationCard = ({svg, text, children, isFlat}: { svg: any, text: string, children?: React.ReactNode, isFlat?: boolean; }) => {
  return (
    <Card noHover isFlat={isFlat}>
      <IllustrationCardWrapper>
        {svg}
        <Span>
          <Text pb={2}>{text}</Text>
          {children}
        </Span>
      </IllustrationCardWrapper>
    </Card>
  );
};


export const Hr = styled.hr`
  ${({ theme }) => css`
    padding: ${theme.gutter / 2}px 0;
  `}
`;
