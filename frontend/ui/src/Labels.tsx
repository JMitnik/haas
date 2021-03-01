import React from 'react';
import { Tag as ChakraTag, TagProps as ChakraTagProps } from '@chakra-ui/core';
import { Span } from './Span';
import styled, { css } from 'styled-components';

export const Label = (props: ChakraTagProps) => (
  <ChakraTag {...props} />
);

export const MicroLabel = styled(Span)`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    border-radius: 0.25rem;
    min-width: 2rem;
    font-weight: 600;
    line-height: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.6rem;
    min-height: auto;
    padding: 4px 8px;
  `}
`