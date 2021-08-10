import styled, { css } from 'styled-components';
import React from 'react';
import { Skeleton as ChakraSkeleton } from '@chakra-ui/core';
import { Text } from './Type';
import Card from './Cards';
import { Span } from './Span';
import { CloseIcon } from './assets/icon-close';
import { Div } from './Generics';

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

export const IllustrationCard = ({ svg, text, children, isFlat }: { svg: any, text: string, children?: React.ReactNode, isFlat?: boolean; }) => {
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


const CloseButtonContainer = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 1rem;
  height: 1rem;
`;

export const CloseButton = ({ onClose }: any) => (
  <CloseButtonContainer onClick={onClose}>
    <CloseIcon />
  </CloseButtonContainer>
);

interface SkeletonProps {
  isLoading: boolean;
  borderRadius?: string;
  children?: React.ReactNode;
  isRefreshing?: boolean;
  manualHeight?: number;
}

/**
 * Skeletons are responsible for handling loading / refreshing states.
 *
 * Note:
 * - Refresh has priority over loading.
 * - It is adviced to group the relevant states into a single object, like:
 * const fetchStatus = {
 *  isLoading: loadingCondition,
 *  isRefresing: loadingCondition && refreshingCondition
 * }
 */
export const Skeleton = ({ isLoading, borderRadius = '10px', isRefreshing = false, manualHeight, children }: SkeletonProps) => (
  <>
    {isRefreshing ? (
      <Div opacity={0.5} style={{ pointerEvents: 'none', cursor: 'initial' }}>
        {children}
      </Div>
    ): (
      <ChakraSkeleton isLoaded={!isLoading} borderRadius={borderRadius} height={!!manualHeight ? `${manualHeight}px` : 'auto'}>
        {children}
      </ChakraSkeleton>
    )}
  </>
)
