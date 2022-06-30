import styled, { css } from 'styled-components';
import React from 'react';
import { Skeleton as ChakraSkeleton } from '@chakra-ui/core';
import { H4, Text } from './Type';
import { BoxShadowSize, Card } from './Cards';
import { Span } from './Span';
import { CloseIcon } from './assets/icon-close';
import { Div } from './Generics';
import { Icon } from './Icon';
import { AlertTriangle } from 'react-feather';
import { Flex } from './Container';

const IllustrationCardWrapper = styled.div`
  ${({ theme }) => css`
    ${Span} {
      color: ${theme.colors.gray['800']};
      bottom: ${theme.gutter}px;
      font-weight: 200;
      font-size: 1.3rem;
      text-align: center;
      transform: translateY(-35%);
      display: block;
      max-width: 80%;
      margin: 0 auto;
    }

    ${Text} {
      color: ${theme.colors.off['500']};
      font-weight: 300;
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

interface IllustrationCardProps {
  svg: any;
  text: string;
  children?: React.ReactNode;
  boxShadow?: BoxShadowSize;
}

export const IllustrationCard = ({ svg, text, children, boxShadow }: IllustrationCardProps) => {
  return (
    <Card boxShadow={boxShadow}>
      <IllustrationCardWrapper>
        {svg}
        <Span>
          <H4 color="off.500" pt={4} fontWeight={500} pb={2}>{text}</H4>
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


export const CloseButtonContainer = styled.button.attrs({ type: 'button' }) <{ top?: string, right?: string }>`
  position: absolute;
  top: ${props => props?.top || '12px'};
  right: ${props => props?.right || '12px'};
  width: 1rem;
  height: 1rem;
`;

interface CloseButtonProps {
  onClose: any;
  top?: string;
  right?: string;
}

export const CloseButton = ({ onClose, top, right }: CloseButtonProps) => (
  <CloseButtonContainer top={top} right={right} onClick={onClose}>
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
    ) : (
      <ChakraSkeleton isLoaded={!isLoading} borderRadius={borderRadius} height={!!manualHeight ? `${manualHeight}px` : 'auto'}>
        {children}
      </ChakraSkeleton>
    )}
  </>
)

interface ErrorPaneProps {
  header?: string;
  text?: string;
  renderCallToAction?: React.ReactNode;
}

const PaneHeader = styled(Text)`
  font-weight: 600;
  line-height: 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PaneIcon = styled(Div)`
  ${Icon} {
    display: block;
    width: 16px;
    height: 16px;

    svg {
      width: 100%;
      height: 100%;
    }
  }
`;

export const ErrorPane = ({ header, text, renderCallToAction }: ErrorPaneProps) => (
  <Div position="relative" padding={4} ml={4} bg="red.100" borderRadius="2px 5px 5px 2px" borderLeft="2px solid" borderColor="red.500">
    {header && (
      <Flex alignItems="flex-end">
        <PaneIcon mr={2} color="red.500"><Icon><AlertTriangle /></Icon></PaneIcon>
        <PaneHeader color="red.500" fontSize="900">{header}</PaneHeader>
      </Flex>
    )}


    <Div mt={2} bg="red.200" padding={2} borderRadius="8px">
      {text}
    </Div>

    {!!renderCallToAction && (
      <>
        {renderCallToAction}
      </>
    )}
  </Div>
);

export const Separator = styled(Div)`
  ${({ theme }) => css`
    width: 2px;
    height: 80%;
    margin-left: ${theme.gutter / 2}px;
    margin-right: ${theme.gutter / 2}px;
  `}
`


interface PaddedBodyProps {
  fraction?: number;
}
export const PaddedBody = styled(Div) <PaddedBodyProps>`
  ${({ theme, fraction = 1 }) => css`
    padding: ${theme.gutter * fraction}px;
  `}
`;
