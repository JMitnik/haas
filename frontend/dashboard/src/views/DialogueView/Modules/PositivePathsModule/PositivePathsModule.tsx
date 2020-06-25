import React from 'react';

import { H3, Card, CardBody, Flex, Span, Div } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

import ModuleContainer from '../Module';

const PostivePathsModuleList = styled.ol`
  ${({ theme }) => css`
   list-style: none;
   padding: 12px 0 0 0 !important;
   counter-reset: item;
   
 
    li {
      counter-increment: item;
      color: ${theme.colors.default.darkest};
      border-bottom: 1px solid ${theme.colors.default.normalAlt};
      padding: 18px 24px;

      &:last-child {
        border-bottom: 0;
      }

      &::before {
        transform: translateX(-18px);
        content: counter(item);
        display: inline-block;
        color: ${theme.colors.default.darker};
        border: 2px solid #f7f8fb;
        padding: 4px;
        font-size: 0.7rem;
      }
    }
  `} 
`;

const PositivePathsModule = ({ positivePaths }: { positivePaths: any }) => (
  <ModuleContainer>
    <Card bg="white">
      <CardBody>
        <H3 color="success">
          <Flex justifyContent="space-between" alignItems="center">
            <Span>Top positive paths</Span>
          </Flex>
        </H3>
        <Div>
          <PostivePathsModuleList>
            {positivePaths && positivePaths.map(({ answer, quantity }: { answer: string, quantity: number }) => (
              <li key={`${answer}-${quantity}`}>
                {`${answer}`}
              </li>
            ))}
          </PostivePathsModuleList>
        </Div>
      </CardBody>
    </Card>
    <H3 />

  </ModuleContainer>
);

export default PositivePathsModule;
